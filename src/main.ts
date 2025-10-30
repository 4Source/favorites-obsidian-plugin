import { CommunityItem, CommunityModal, Modal, Plugin } from 'obsidian';
import { dedupe, around } from 'monkey-around';
import { MONKEY_KEY_PLUGIN_BROWSER_MODAL_UPDATE_ITEMS, MONKEY_KEY_MODAL_OPEN, MONKEY_KEY_THEME_BROWSER_MODAL_UPDATE_ITEMS, MONKEY_KEY_THEME_BROWSER_MODAL_SHOW_ITEMS, MONKEY_KEY_PLUGIN_BROWSER_MODAL_SHOW_ITEMS } from './constants';

export default class FavoritesPlugin extends Plugin {
	pluginsKey: string;
	themesKey: string;
	favoritePlugins?: string[];
	favoriteThemes?: string[];
	communityPluginModalPrototype?: CommunityModal;
	communityThemesModalPrototype?: CommunityModal;
	uninstallModalOpen: () => void;
	uninstallPluginBrowserModalUpdateItems: () => void;
	uninstallPluginBrowserModalShowItem: () => void;
	uninstallThemeBrowserModalUpdateItems: () => void;
	uninstallThemeBrowserModalShowItem: () => void;

	async onload() {
		await this.loadSettings();

		this.pluginsKey = process.env.FAVORITE_PLUGINS_KEY || "";
		this.themesKey = process.env.FAVORITE_THEMES_KEY || "";
		console.log(this.pluginsKey, this.themesKey)

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const plugin = this;

		console.debug('Patch Modal.open')
		this.uninstallModalOpen = around(Modal.prototype, {
			open(oldMethod) {
				return dedupe(MONKEY_KEY_MODAL_OPEN, oldMethod, function (...args) {
					console.debug('Call Modal.open')
					const result = oldMethod && oldMethod.apply(this, args);

					// Check the opened Modal is the Community plugin browse modal
					if (this.containerEl?.querySelector('.mod-community-plugin')) {
						// Patch updateItems method
						console.debug('Patch PluginBrowserModal.updateItems')
						plugin.uninstallPluginBrowserModalUpdateItems = around(this.constructor.prototype, {
							updateItems(oldMethod) {
								return dedupe(MONKEY_KEY_PLUGIN_BROWSER_MODAL_UPDATE_ITEMS, oldMethod, function () {
									console.debug('Call PluginBrowserModal.updateItems')
									// Load the favorite plugins
									plugin.favoritePlugins = JSON.parse(localStorage.getItem(this.pluginsKey) || '[]');

									const result = oldMethod && oldMethod.apply(this);

									// Add to the favorite plugins a tag to visualize it for the user
									if (plugin.favoritePlugins) {
										plugin.favoritePlugins.forEach(id => {
											if (this.items && this.items[id]?.nameEl) {
												this.items[id].nameEl.createSpan({
													cls: 'flair',
													text: 'favorite',
												});
											}
										});
									}

									return result;
								});
							},
						});

						// Patch showItem method
						console.debug('Patch PluginBrowserModal.showItem')
						plugin.uninstallPluginBrowserModalShowItem = around(this.constructor.prototype, {
							showItem(oldMethod) {
								return dedupe(MONKEY_KEY_PLUGIN_BROWSER_MODAL_SHOW_ITEMS, oldMethod, async function (...args: CommunityItem[]) {
									console.debug('Call PluginBrowserModal.showItem')
									// Load the favorite plugins
									plugin.favoritePlugins = JSON.parse(localStorage.getItem(this.pluginsKey) || '[]');

									return oldMethod && oldMethod.apply(this, args).then(async (r: void) => {
										const infoEl = await this.detailsEl.getElementsByClassName('community-modal-info')[0];
										const infoNameEl = await infoEl?.getElementsByClassName('community-modal-info-name')[0];
										const buttonContainerEl = await infoEl?.getElementsByClassName('community-modal-button-container')[0];

										const isFavorite = plugin.favoritePlugins?.contains(this.selectedItemId);

										// Add to the favorite plugins a tag to visualize it for the user
										if (isFavorite) {
											if (infoNameEl) {
												infoNameEl.createSpan({
													cls: 'flair',
													text: 'favorite',
												});
											}
										}

										plugin.registerEvent(buttonContainerEl?.createEl('button', { text: isFavorite ? 'Unfavorite' : 'Favorite' }).addEventListener('click', () => {
											console.log('PluginBrowserModal clicked Favorite')
											if (isFavorite) {
												plugin.favoritePlugins?.remove(this.selectedItemId);
											}
											else {
												plugin.favoritePlugins?.push(this.selectedItemId);
											}

											plugin.saveSettings();

											// Redraw
											infoEl.detach();
											this.showItem(this.items[this.selectedItemId]);
											this.update();
										}));

										return r;
									});
								});
							},
						});
					}

					// Check the opened Modal is the Community themes browse modal
					if (this.containerEl?.querySelector('.mod-community-theme')) {
						// Patch updateItems method
						console.debug('Patch ThemeBrowserModal.updateItems')
						plugin.uninstallThemeBrowserModalUpdateItems = around(this.constructor.prototype, {
							updateItems(oldMethod) {
								return dedupe(MONKEY_KEY_THEME_BROWSER_MODAL_UPDATE_ITEMS, oldMethod, function () {
									console.debug('Call ThemeBrowserModal.updateItems')
									// Load the favorite themes
									plugin.favoriteThemes = JSON.parse(localStorage.getItem(this.themesKey) || '[]');

									const result = oldMethod && oldMethod.apply(this);

									// Ignore the default theme
									if (this.selectedItemId === '') {
										return;
									}

									// Add to the favorite themes a tag to visualize it for the user
									if (plugin.favoriteThemes) {
										plugin.favoriteThemes.forEach(id => {
											if (this.items && this.items[id]?.nameEl) {
												this.items[id].nameEl.createSpan({
													cls: 'flair',
													text: 'favorite',
												});
											}
										});
									}

									return result;
								});
							},
						});

						// Patch showItems method
						console.debug('Patch ThemeBrowserModal.showItem')
						plugin.uninstallThemeBrowserModalShowItem = around(this.constructor.prototype, {
							showItem(oldMethod) {
								return dedupe(MONKEY_KEY_THEME_BROWSER_MODAL_SHOW_ITEMS, oldMethod, async function (...args: CommunityItem[]) {
									console.debug('Call ThemeBrowserModal.showItem')
									// Load the favorite themes
									plugin.favoriteThemes = JSON.parse(localStorage.getItem(this.themesKey) || '[]');

									return oldMethod && oldMethod.apply(this, args).then(async (r: void) => {
										// Ignore the default theme
										if (this.selectedItemId === '') {
											return;
										}

										const infoEl = await this.detailsEl.getElementsByClassName('community-modal-info')[0];
										const infoNameEl = await infoEl?.getElementsByClassName('community-modal-info-name')[0];
										const buttonContainerEl = await infoEl?.getElementsByClassName('community-modal-button-container')[0];

										const isFavorite = plugin.favoriteThemes?.contains(this.selectedItemId);

										// Add to the favorite themes a tag to visualize it for the user
										if (isFavorite) {
											if (infoNameEl) {
												infoNameEl.createSpan({
													cls: 'flair',
													text: 'favorite',
												});
											}
										}

										plugin.registerEvent(buttonContainerEl?.createEl('button', { text: isFavorite ? 'Unfavorite' : 'Favorite' }).addEventListener('click', () => {
											console.log('ThemeBrowserModal clicked Favorite')
											if (isFavorite) {
												plugin.favoriteThemes?.remove(this.selectedItemId);
											}
											else {
												plugin.favoriteThemes?.push(this.selectedItemId);
											}

											plugin.saveSettings();

											// Redraw
											infoEl.detach();
											this.showItem(this.items[this.selectedItemId]);
											this.update();
										}));

										return r;
									});
								});
							},
						});
					}

					return result;
				});
			},
		});

		// TODO: Redraw modals if local storage 'favorite-plugins' or 'favorite-themes' changed

		/*
		 * TODO: Add command to save and reload the favorites list
		 * TODO: Add command to remove all favorites from list
		 * TODO: Add command to search for plugin to add to favorites list
		 */
	}

	async onunload() {
		// Restore the original functions
		if (this.uninstallModalOpen) {
			console.debug('Uninstall Modal.open')
			this.uninstallModalOpen();
		}
		if (this.uninstallPluginBrowserModalUpdateItems) {
			console.debug('Uninstall PluginBrowserModal.updateItem')
			this.uninstallPluginBrowserModalUpdateItems();
		}
		if (this.uninstallPluginBrowserModalShowItem) {
			console.debug('Uninstall PluginBrowserModal.showItem')
			this.uninstallPluginBrowserModalShowItem();
		}
		if (this.uninstallThemeBrowserModalUpdateItems) {
			console.debug('Uninstall ThemeBrowserModal.updateItem')
			this.uninstallThemeBrowserModalUpdateItems();
		}
		if (this.uninstallThemeBrowserModalShowItem) {
			console.debug('Uninstall ThemeBrowserModal.showItem')
			this.uninstallThemeBrowserModalShowItem();
		}
	}

	async loadSettings() {

	}

	async saveSettings() {
		if (this.favoritePlugins) {
			if (this.favoritePlugins.length > 0) {
				localStorage.setItem(this.pluginsKey, JSON.stringify(this.favoritePlugins));
			}
			else {
				localStorage.removeItem(this.pluginsKey);
			}
		}

		if (this.favoriteThemes) {
			if (this.favoriteThemes.length > 0) {
				localStorage.setItem(this.themesKey, JSON.stringify(this.favoriteThemes));
			}
			else {
				localStorage.removeItem(this.themesKey);
			}
		}
	}
}
