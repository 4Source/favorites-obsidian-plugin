import { CommunityItem, CommunityModal, Modal, Plugin } from 'obsidian';
import { dedupe, around } from 'monkey-around';
import { MONKEY_KEY_PLUGIN_BROWSER_MODAL_UPDATE_ITEMS, MONKEY_KEY_MODAL_OPEN, MONKEY_KEY_THEME_BROWSER_MODAL_UPDATE_ITEMS, MONKEY_KEY_THEME_BROWSER_MODAL_SHOW_ITEMS, MONKEY_KEY_PLUGIN_BROWSER_MODAL_SHOW_ITEMS } from './constants';

export default class FavoritesPlugin extends Plugin {
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

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const plugin = this;

		this.uninstallModalOpen = around(Modal.prototype, {
			open(oldMethod) {
				return dedupe(MONKEY_KEY_MODAL_OPEN, oldMethod, function (...args) {
					const result = oldMethod && oldMethod.apply(this, args);

					// Check the opened Modal is the Community plugin browse modal
					if (this.containerEl?.querySelector('.mod-community-plugin')) {
						// Patch updateItems method
						plugin.uninstallPluginBrowserModalUpdateItems = around(this.constructor.prototype, {
							updateItems(oldMethod) {
								return dedupe(MONKEY_KEY_PLUGIN_BROWSER_MODAL_UPDATE_ITEMS, oldMethod, function () {
									// Load the favorite plugins
									plugin.favoritePlugins = JSON.parse(localStorage.getItem('favorite-plugins') || '[]');

									const result = oldMethod && oldMethod.apply(this, args);

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
						plugin.uninstallPluginBrowserModalShowItem = around(this.constructor.prototype, {
							showItem(oldMethod) {
								return dedupe(MONKEY_KEY_PLUGIN_BROWSER_MODAL_SHOW_ITEMS, oldMethod, async function (...args: CommunityItem[]) {
									// Load the favorite plugins
									plugin.favoritePlugins = JSON.parse(localStorage.getItem('favorite-plugins') || '[]');

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
						plugin.uninstallThemeBrowserModalUpdateItems = around(this.constructor.prototype, {
							updateItems(oldMethod) {
								return dedupe(MONKEY_KEY_THEME_BROWSER_MODAL_UPDATE_ITEMS, oldMethod, function () {
									// Load the favorite themes
									plugin.favoriteThemes = JSON.parse(localStorage.getItem('favorite-themes') || '[]');

									const result = oldMethod && oldMethod.apply(this, args);

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
						plugin.uninstallThemeBrowserModalShowItem = around(this.constructor.prototype, {
							showItem(oldMethod) {
								return dedupe(MONKEY_KEY_THEME_BROWSER_MODAL_SHOW_ITEMS, oldMethod, async function (...args: CommunityItem[]) {
									// Load the favorite themes
									plugin.favoriteThemes = JSON.parse(localStorage.getItem('favorite-themes') || '[]');

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
		this.uninstallModalOpen();
		this.uninstallPluginBrowserModalUpdateItems();
		this.uninstallPluginBrowserModalShowItem();
		this.uninstallThemeBrowserModalUpdateItems();
		this.uninstallThemeBrowserModalShowItem();
	}

	async loadSettings() {

	}

	async saveSettings() {
		if (this.favoritePlugins) {
			if (this.favoritePlugins.length > 0) {
				localStorage.setItem('favorite-plugins', JSON.stringify(this.favoritePlugins));
			}
			else {
				localStorage.removeItem('favorite-plugins');
			}
		}

		if (this.favoriteThemes) {
			if (this.favoriteThemes.length > 0) {
				localStorage.setItem('favorite-themes', JSON.stringify(this.favoriteThemes));
			}
			else {
				localStorage.removeItem('favorite-themes');
			}
		}
	}
}
