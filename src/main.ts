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
	uninstallModalOpen?: () => void;
	uninstallPluginBrowserModalUpdateItems?: () => void;
	uninstallPluginBrowserModalShowItem?: () => void;
	uninstallThemeBrowserModalUpdateItems?: () => void;
	uninstallThemeBrowserModalShowItem?: () => void;

	onload() {
		this.pluginsKey = process.env.FAVORITE_PLUGINS_KEY || '';
		this.themesKey = process.env.FAVORITE_THEMES_KEY || '';
		console.debug(`Plugins key: ${this.pluginsKey} Themes key: ${this.themesKey}`);

		// eslint-disable-next-line @typescript-eslint/no-this-alias -- Is required because the this context wil change inside the 'monkey-around' functions but the plugin is required to be accessible
		const plugin = this;

		if (!this.uninstallModalOpen) {
			console.debug('Patch Modal.open');
			this.uninstallModalOpen = around(Modal.prototype, {
				open(oldMethod) {
					return dedupe(MONKEY_KEY_MODAL_OPEN, oldMethod, function (...args) {
						console.debug('Call Modal.open');
						const result = oldMethod && oldMethod.apply(this, args);

						// Check the opened Modal is the Community plugin browse modal
						if (this.containerEl?.querySelector('.mod-community-plugin')) {
							// Patch updateItems method
							if (!plugin.uninstallPluginBrowserModalUpdateItems) {
								console.debug('Patch PluginBrowserModal.updateItems');
								plugin.uninstallPluginBrowserModalUpdateItems = around(this.constructor.prototype, {
									updateItems(oldMethod) {
										return dedupe(MONKEY_KEY_PLUGIN_BROWSER_MODAL_UPDATE_ITEMS, oldMethod, function () {
											console.debug('Call PluginBrowserModal.updateItems');

											// Load the favorite plugins
											plugin.loadFavoritePlugins();

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
							}
							else {
								console.warn('PluginBrowserModal.updateItems already patched!');
							}

							// Patch showItem method
							if (!plugin.uninstallPluginBrowserModalShowItem) {
								console.debug('Patch PluginBrowserModal.showItem');
								plugin.uninstallPluginBrowserModalShowItem = around(this.constructor.prototype, {
									showItem(oldMethod) {
										return dedupe(MONKEY_KEY_PLUGIN_BROWSER_MODAL_SHOW_ITEMS, oldMethod, function (...args: CommunityItem[]) {
											console.debug('Call PluginBrowserModal.showItem');

											return oldMethod && oldMethod.apply(this, args)
												.then(async (r: void) => {
													const infoEl = await this.detailsEl.getElementsByClassName('community-modal-info')[0];
													const infoNameEl = await infoEl?.getElementsByClassName('community-modal-info-name')[0];
													const buttonContainerEl = await infoEl?.getElementsByClassName('community-modal-button-container')[0];

													// Load the favorite plugins
													plugin.loadFavoritePlugins();
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

														plugin.saveFavorites();

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
							else {
								console.warn('PluginBrowserModal.showItem already patched!');
							}
						}

						// Check the opened Modal is the Community themes browse modal
						if (this.containerEl?.querySelector('.mod-community-theme')) {
							// Patch updateItems method
							if (!plugin.uninstallThemeBrowserModalUpdateItems) {
								console.debug('Patch ThemeBrowserModal.updateItems');
								plugin.uninstallThemeBrowserModalUpdateItems = around(this.constructor.prototype, {
									updateItems(oldMethod) {
										return dedupe(MONKEY_KEY_THEME_BROWSER_MODAL_UPDATE_ITEMS, oldMethod, function () {
											console.debug('Call ThemeBrowserModal.updateItems');

											// Load the favorite themes
											plugin.loadFavoriteThemes();

											const result = oldMethod && oldMethod.apply(this);

											// Ignore the default theme
											if (this.selectedItemId === '') {
												return result;
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
							}
							else {
								console.warn('ThemeBrowserModal.updateItems already patched!');
							}

							// Patch showItems method
							if (!plugin.uninstallThemeBrowserModalShowItem) {
								console.debug('Patch ThemeBrowserModal.showItem');
								plugin.uninstallThemeBrowserModalShowItem = around(this.constructor.prototype, {
									showItem(oldMethod) {
										return dedupe(MONKEY_KEY_THEME_BROWSER_MODAL_SHOW_ITEMS, oldMethod, function (...args: CommunityItem[]) {
											console.debug('Call ThemeBrowserModal.showItem');

											return oldMethod && oldMethod.apply(this, args)
												.then(async (r: void) => {
													// Ignore the default theme
													if (this.selectedItemId === '') {
														return r;
													}

													const infoEl = await this.detailsEl.getElementsByClassName('community-modal-info')[0];
													const infoNameEl = await infoEl?.getElementsByClassName('community-modal-info-name')[0];
													const buttonContainerEl = await infoEl?.getElementsByClassName('community-modal-button-container')[0];

													// Load the favorite themes
													plugin.loadFavoriteThemes();
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

														plugin.saveFavorites();

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
							else {
								console.warn('ThemeBrowserModal.showItem already patched!');
							}
						}

						if (plugin.uninstallModalOpen && plugin.uninstallPluginBrowserModalUpdateItems && plugin.uninstallPluginBrowserModalShowItem && plugin.uninstallThemeBrowserModalUpdateItems && plugin.uninstallThemeBrowserModalShowItem) {
							console.debug('Uninstall Modal.open');
							plugin.uninstallModalOpen();
							plugin.uninstallModalOpen = undefined;
						}
						return result;
					});
				},
			});
		}
		else {
			console.warn('Modal.open already patched!');
		}

		// TODO: Redraw modals if local storage 'favorite-plugins' or 'favorite-themes' changed

		/*
		 * TODO: Add command to save and reload the favorites list
		 * TODO: Add command to remove all favorites from list
		 * TODO: Add command to search for plugin to add to favorites list
		 */
	}

	onunload() {
		try {
			// Restore the original functions
			if (this.uninstallModalOpen) {
				console.debug('Uninstall Modal.open');
				this.uninstallModalOpen();
				this.uninstallModalOpen = undefined;
			}
			if (this.uninstallPluginBrowserModalUpdateItems) {
				console.debug('Uninstall PluginBrowserModal.updateItem');
				this.uninstallPluginBrowserModalUpdateItems();
				this.uninstallPluginBrowserModalUpdateItems = undefined;
			}
			if (this.uninstallPluginBrowserModalShowItem) {
				console.debug('Uninstall PluginBrowserModal.showItem');
				this.uninstallPluginBrowserModalShowItem();
				this.uninstallPluginBrowserModalShowItem = undefined;
			}
			if (this.uninstallThemeBrowserModalUpdateItems) {
				console.debug('Uninstall ThemeBrowserModal.updateItem');
				this.uninstallThemeBrowserModalUpdateItems();
				this.uninstallThemeBrowserModalUpdateItems = undefined;
			}
			if (this.uninstallThemeBrowserModalShowItem) {
				console.debug('Uninstall ThemeBrowserModal.showItem');
				this.uninstallThemeBrowserModalShowItem();
				this.uninstallThemeBrowserModalShowItem = undefined;
			}
		}
		catch (e) {
			console.error(e);
		}
	}

	loadFavoritePlugins() {
		// Load the favorite plugins
		this.favoritePlugins = JSON.parse(localStorage.getItem(this.pluginsKey) || '[]');
	}

	loadFavoriteThemes() {
		// Load the favorite plugins
		this.favoritePlugins = JSON.parse(localStorage.getItem(this.themesKey) || '[]');
	}

	saveFavorites() {
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
