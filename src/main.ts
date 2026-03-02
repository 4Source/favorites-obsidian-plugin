import { CommunityItem, CommunityPluginsSettingTab, Modal, normalizePath, Notice, Plugin, setIcon, SettingsModal, SettingTab, setTooltip } from 'obsidian';
import { dedupe, around } from 'monkey-around';
import { MONKEY_KEY_PLUGIN_BROWSER_MODAL_UPDATE_ITEMS, MONKEY_KEY_MODAL_OPEN, MONKEY_KEY_THEME_BROWSER_MODAL_UPDATE_ITEMS, MONKEY_KEY_THEME_BROWSER_MODAL_SHOW_ITEMS, MONKEY_KEY_PLUGIN_BROWSER_MODAL_SHOW_ITEMS, MONKEY_KEY_SETTINGS_MODAL_OPEN_TAB, MONKEY_KEY_COMMUNITY_PLUGIN_SETTINGS_TAB_RENDER_INSTALLED_PLUGIN, PLUGIN_BACKUP_BASE_PATH } from './constants';
import { DialogModal } from './modals/DialogModal';
import { CommunitySuggestModal } from './modals/CommunitySuggestModal';
import { CommunityPlugin, CommunityTheme, fetchCommunityPluginList, fetchCommunityThemeList } from './util/GitHub';
import { StringSuggestModal } from './modals/StringSuggestModal';

export default class FavoritesPlugin extends Plugin {
	pluginsKey: string;
	themesKey: string;
	favoritePlugins: string[];
	favoriteThemes: string[];
	uninstallModalOpen?: () => void;
	uninstallSettingsModalOpenTab?: () => void;
	uninstallPluginBrowserModalUpdateItems?: () => void;
	uninstallPluginBrowserModalShowItem?: () => void;
	uninstallThemeBrowserModalUpdateItems?: () => void;
	uninstallThemeBrowserModalShowItem?: () => void;
	uninstallCommunityPluginsSettingTabRenderInstalledPlugin?: () => void;

	onload() {
		if (process.env.FAVORITE_PLUGINS_KEY) {
			this.pluginsKey = process.env.FAVORITE_PLUGINS_KEY;
		}
		else {
			throw Error('Missing environment variable \'FAVORITE_PLUGINS_KEY\'');
		}
		if (process.env.FAVORITE_THEMES_KEY) {
			this.themesKey = process.env.FAVORITE_THEMES_KEY;
		}
		else {
			throw Error('Missing environment variable \'FAVORITE_THEMES_KEY\'');
		}
		console.debug(`Plugins key: ${this.pluginsKey} Themes key: ${this.themesKey}`);
		this.loadFavorites();

		// eslint-disable-next-line @typescript-eslint/no-this-alias -- Is required because the this context wil change inside the 'monkey-around' functions but the plugin is required to be accessible
		const plugin = this;

		// Patch the opening of SettingsModal
		if (!this.uninstallSettingsModalOpenTab) {
			console.debug('Patch SettingsModal.openTab');
			this.uninstallSettingsModalOpenTab = around(this.app.setting as SettingsModal, {
				openTab(oldMethod) {
					return dedupe(MONKEY_KEY_SETTINGS_MODAL_OPEN_TAB, oldMethod, function (...args) {
						console.debug('Call SettingsModal.openTab');

						const tab = args[0] as SettingTab;
						if (tab.id === 'community-plugins') {
							if (!plugin.uninstallCommunityPluginsSettingTabRenderInstalledPlugin) {
								console.debug('Patch CommunityPluginsSettingTab.renderInstalledPlugin');
								plugin.uninstallCommunityPluginsSettingTabRenderInstalledPlugin = around((tab as CommunityPluginsSettingTab), {
									renderInstalledPlugin(oldMethod) {
										return dedupe(MONKEY_KEY_COMMUNITY_PLUGIN_SETTINGS_TAB_RENDER_INSTALLED_PLUGIN, oldMethod, function (...args) {
											console.debug('Call CommunityPluginsSettingTab.renderInstalledPlugin');
											oldMethod && oldMethod.apply(this, args);

											// Load the favorite plugins
											plugin.loadFavoritePlugins();

											const selectedPluginID = args[0].id;
											const isFavorite = plugin.favoritePlugins.contains(selectedPluginID);

											const favEl = createDiv('clickable-icon extra-setting-button');

											plugin.registerDomEvent(favEl, 'click', () => {
												if (isFavorite) {
													plugin.favoritePlugins.remove(selectedPluginID);
												}
												else {
													plugin.favoritePlugins.push(selectedPluginID);
												}

												plugin.saveFavoritesPlugins();

												// Redraw
												(tab as CommunityPluginsSettingTab).render(false);
											});

											if (isFavorite) {
												setIcon(favEl, 'star-off');
												setTooltip(favEl, 'Unfavorite');
											}
											else {
												setIcon(favEl, 'star');
												setTooltip(favEl, 'Favorite');
											}

											// Add Favorite Icon to plugin control
											const controlEl: HTMLElement = this.installedPlugins.listEl.lastChild?.getElementsByClassName('setting-item-control')[0];
											controlEl.insertBefore(favEl, controlEl.children[0]);
										});
									},
								});
							}
							else {
								console.debug('CommunityPluginsSettingTab.renderInstalledPlugin already patched!');
							}
						}

						if (plugin.uninstallSettingsModalOpenTab && plugin.uninstallCommunityPluginsSettingTabRenderInstalledPlugin) {
							console.debug('Uninstall SettingsModal.openTab');
							plugin.uninstallSettingsModalOpenTab();
							plugin.uninstallSettingsModalOpenTab = undefined;
						}
						return oldMethod && oldMethod.apply(this, args);
					});
				},
			});
		}

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
											plugin.favoritePlugins.forEach(id => {
												if (this.items && this.items[id]?.nameEl) {
													this.items[id].nameEl.createSpan({
														cls: 'flair',
														text: 'favorite',
													});
												}
											});

											return result;
										});
									},
								});
							}
							else {
								console.debug('PluginBrowserModal.updateItems already patched!');
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
													const isFavorite = plugin.favoritePlugins.contains(this.selectedItemId);

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
															plugin.favoritePlugins.remove(this.selectedItemId);
														}
														else {
															plugin.favoritePlugins.push(this.selectedItemId);
														}

														plugin.saveFavoritesPlugins();

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
								console.debug('PluginBrowserModal.showItem already patched!');
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
											plugin.favoriteThemes.forEach(id => {
												if (this.items && this.items[id]?.nameEl) {
													this.items[id].nameEl.createSpan({
														cls: 'flair',
														text: 'favorite',
													});
												}
											});

											return result;
										});
									},
								});
							}
							else {
								console.debug('ThemeBrowserModal.updateItems already patched!');
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
													const isFavorite = plugin.favoriteThemes.contains(this.selectedItemId);

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
															plugin.favoriteThemes.remove(this.selectedItemId);
														}
														else {
															plugin.favoriteThemes.push(this.selectedItemId);
														}

														plugin.saveFavoritesThemes();

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
								console.debug('ThemeBrowserModal.showItem already patched!');
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

		this.addCommand({
			id: 'save-favorites-lists',
			name: 'Manually save the favorites lists',
			callback: () => {
				this.saveFavorites();
				new Notice('Saved favorite lists');
			},
		});

		this.addCommand({
			id: 'load-favorites-lists',
			name: 'Manually load the favorites lists',
			callback: () => {
				this.loadFavorites();
				new Notice('Loaded favorite lists');
			},
		});

		this.addCommand({
			id: 'clear-plugin-favorites-lists',
			name: 'Clear the plugin favorites lists',
			callback: () => {
				this.loadFavoritePlugins();
				const numberClear = this.favoritePlugins.length;
				new DialogModal(this.app, `Clear ${numberClear} plugin(s) permanently from favorite list?`, '', () => {
					this.favoritePlugins = [];
					this.saveFavoritesPlugins();
					new Notice(`Cleared ${numberClear} plugins from favorite list`);
				}, () => {
					new Notice('Canceled clear plugins from favorite list');
				}, 'Clear', true, 'Cancel', false).open();
			},
		});

		this.addCommand({
			id: 'clear-theme-favorites-lists',
			name: 'Clear the theme favorites lists',
			callback: () => {
				this.loadFavoriteThemes();
				const numberClear = this.favoriteThemes.length;
				new DialogModal(this.app, `Clear ${numberClear} theme(s) permanently from favorite list?`, '', () => {
					this.favoriteThemes = [];
					this.saveFavoritesThemes();
					new Notice(`Cleared ${numberClear} themes from favorite list`);
				}, () => {
					new Notice('Canceled clear themes from favorite list');
				}, 'Clear', true, 'Cancel', false).open();
			},
		});

		this.addCommand({
			id: 'search-and-add-plugin-to-favorite-list',
			name: 'Add plugin to favorite list',
			callback: async () => {
				const items = await fetchCommunityPluginList();
				if (!items) {
					new Notice('Failed to fetch community plugins. See console for more information.');
					return;
				}

				new CommunitySuggestModal<CommunityPlugin>(this.app, 'Select plugin which should be added to favorites list...', items, (result) => {
					this.loadFavoritePlugins();
					this.favoritePlugins.push(result.id);
					this.saveFavoritesPlugins();
					new Notice(`Added ${result.name} to favorite list`);
				}).open();
			},
		});

		this.addCommand({
			id: 'search-and-add-theme-to-favorite-list',
			name: 'Add theme to favorite list',
			callback: async () => {
				const items = await fetchCommunityThemeList();
				if (!items) {
					new Notice('Failed to fetch community themes. See console for more information.');
					return;
				}

				new CommunitySuggestModal<CommunityTheme>(this.app, 'Select theme which should be added to favorites list...', items, (result) => {
					this.loadFavoriteThemes();
					this.favoriteThemes.push(result.name);
					this.saveFavoritesThemes();
					new Notice(`Added ${result.name} to favorite list`);
				}).open();
			},
		});

		this.addCommand({
			id: 'search-and-remove-plugin-to-favorite-list',
			name: 'Remove plugin from favorite list',
			callback: async () => {
				this.loadFavoritePlugins();
				if (this.favoritePlugins.length <= 0) {
					new Notice('Plugin favorite list is empty');
					return;
				}
				const communityItems = await fetchCommunityPluginList();
				const installedItems = Object.values(this.app.plugins.manifests);
				const items = this.favoritePlugins.map((value) => {
					return communityItems?.find((communityValue) => value === communityValue.id) || installedItems.find(installedValue => value === installedValue.id) as unknown as CommunityPlugin || { id: value, name: value, author: 'unknown' } as CommunityPlugin;
				});

				new CommunitySuggestModal<CommunityPlugin>(this.app, 'Select plugin which should be removed from the favorites list...', items, (result) => {
					this.favoritePlugins.remove(result.id);
					this.saveFavoritesPlugins();
					new Notice(`Removed ${result.name} from favorite list`);
				}).open();
			},
		});

		this.addCommand({
			id: 'search-and-remove-theme-to-favorite-list',
			name: 'Remove theme from favorite list',
			callback: async () => {
				this.loadFavoriteThemes();
				if (this.favoriteThemes.length <= 0) {
					new Notice('Theme favorite list is empty');
					return;
				}
				const communityItems = await fetchCommunityThemeList();
				const installedItems = Object.values(this.app.customCss.themes);
				const items = this.favoriteThemes.map((value) => {
					return communityItems?.find((communityValue) => value === communityValue.name) || installedItems.find(installedValue => value === installedValue.name) as unknown as CommunityTheme || { name: value, author: 'unknown' } as CommunityTheme;
				});

				new CommunitySuggestModal<CommunityTheme>(this.app, 'Select theme which should be removed from the favorites list...', items, (result) => {
					this.favoriteThemes.remove(result.name);
					this.saveFavoritesThemes();
					new Notice(`Removed ${result.name} from favorite list`);
				}).open();
			},
		});

		this.addCommand({
			id: 'export-favorite-lists',
			name: 'Export favorite lists to file',
			callback: () => { this.exportFavorites(); },
		});

		this.addCommand({
			id: 'import-favorite-lists',
			name: 'Import favorite lists from file',
			callback: () => { this.importFavorites(); },
		});
	}

	onunload() {
		try {
			// Restore the original functions
			if (this.uninstallModalOpen) {
				console.debug('Uninstall Modal.open');
				this.uninstallModalOpen();
				this.uninstallModalOpen = undefined;
			}
			if (this.uninstallSettingsModalOpenTab) {
				console.debug('Uninstall SettingsModal.openTab');
				this.uninstallSettingsModalOpenTab();
				this.uninstallSettingsModalOpenTab = undefined;
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
			if (this.uninstallCommunityPluginsSettingTabRenderInstalledPlugin) {
				console.debug('Uninstall CommunityPluginsSettingTab.renderInstalledPlugin');
				this.uninstallCommunityPluginsSettingTabRenderInstalledPlugin();
				this.uninstallCommunityPluginsSettingTabRenderInstalledPlugin = undefined;
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
		this.favoriteThemes = JSON.parse(localStorage.getItem(this.themesKey) || '[]');
	}

	loadFavorites() {
		this.loadFavoritePlugins();
		this.loadFavoriteThemes();
	}

	saveFavoritesPlugins() {
		if (this.favoritePlugins.length > 0) {
			localStorage.setItem(this.pluginsKey, JSON.stringify(this.favoritePlugins));
		}
		else {
			localStorage.removeItem(this.pluginsKey);
		}
	}

	saveFavoritesThemes() {
		if (this.favoriteThemes.length > 0) {
			localStorage.setItem(this.themesKey, JSON.stringify(this.favoriteThemes));
		}
		else {
			localStorage.removeItem(this.themesKey);
		}
	}

	saveFavorites() {
		this.saveFavoritesPlugins();
		this.saveFavoritesThemes();
	}

	async exportFavorites() {
		if (this.favoritePlugins.length <= 0 && this.favoriteThemes.length <= 0) {
			new Notice('No favorite lists to backup');
			return;
		}

		// Ensure backup path does exist
		const backupPath = normalizePath(`${this.app.vault.configDir}${PLUGIN_BACKUP_BASE_PATH}`);
		await this.app.vault.adapter.mkdir(backupPath);

		// Create the file name
		const pad = (n: number) => n.toString().padStart(2, '0');
		const date = new Date();
		const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
		const backupFilePath = normalizePath(`${backupPath}/favorite-${dateString}.json`);

		// Write backup file for lists
		await this.app.vault.adapter.write(backupFilePath, JSON.stringify({ plugins: this.favoritePlugins, themes: this.favoriteThemes }));
		new Notice(`Favorites list backup successful written to: ${backupFilePath}`);
	}

	async importFavorites() {
		const backupPath = normalizePath(`${this.app.vault.configDir}${PLUGIN_BACKUP_BASE_PATH}`);
		if (!(await this.app.vault.adapter.exists(backupPath))) {
			// Backup path does not exist
			new Notice(`Backup path does not exist: ${backupPath}`);
			return;
		}

		const backupFiles = (await this.app.vault.adapter.list(backupPath)).files;
		if (backupFiles.length <= 0) {
			// Backup path is empty
			new Notice('Backup path is empty');
			return;
		}

		new StringSuggestModal(this.app, 'Select backup file to load from', backupFiles, async (result) => {
			const content = await this.app.vault.adapter.read(result);
			const json = JSON.parse(content);
			const loadedPlugins = json.plugins || [];
			const loadedThemes = json.themes || [];
			new DialogModal(this.app, 'Are you sure you want to overwrite current favorite lists?', `The list of favorite plugins will change from ${this.favoritePlugins.length} items to ${loadedPlugins.length} items, and the list of favorite themes will change from ${this.favoriteThemes.length} items to ${loadedThemes.length} items.`, () => {
				this.favoritePlugins = loadedPlugins;
				this.favoriteThemes = loadedThemes;
				this.saveFavorites();

				new Notice('Loaded favorites backup successfully');
			}, () => {
				new Notice('Canceled loading favorites backup by user');
			}, 'Overwrite', true, 'Cancel', false).open();
		}).open();
	}
}
