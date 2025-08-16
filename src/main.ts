import { CommunityItem, CommunityModal, Modal, Plugin } from 'obsidian';

export default class FavoritesPlugin extends Plugin {
	favoritePlugins?: string[];
	favoriteThemes?: string[];
	communityPluginModalPrototype?: CommunityModal;
	communityThemesModalPrototype?: CommunityModal;

	async onload() {
		await this.loadSettings();

		if (!Modal.prototype.originalOpen) {
			Modal.prototype.originalOpen = Modal.prototype.open;
			const originalModalOpen = Modal.prototype.open;

			Modal.prototype.open = (function (originalModalOpen, plugin) {
				return function () {
					originalModalOpen?.apply(this);

					// Check the opened Modal is the Community plugin browse modal
					if (this.containerEl?.querySelector('.mod-community-plugin')) {
						// Store the Community Plugin Browse Modal prototype to be able to reset to the original
						plugin.communityPluginModalPrototype = this.constructor.prototype;

						// Check the plugin updateItems is already overwritten
						if (!this.constructor.prototype.originalUpdateItems) {
							// Save original method
							this.constructor.prototype.originalUpdateItems = this.constructor.prototype.updateItems;
							const originalUpdateItems = this.constructor.prototype.updateItems;
							if (!this.constructor.prototype.originalUpdateItems) {
								console.error('Favorites plugin: Failed to access original updateItems method!');
								return;
							}

							// Overwrite method with additional functionality
							this.constructor.prototype.updateItems = (function (originalUpdateItems, plugin) {
								return function () {
									// Load the favorite plugins
									plugin.favoritePlugins = JSON.parse(localStorage.getItem('favorite-plugins') || '[]');

									const result = originalUpdateItems.apply(this);

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
								};
							})(originalUpdateItems, plugin);
						}

						// Check the plugin showItem is already overwritten
						if (!this.constructor.prototype.originalShowItem) {
							// Save original method
							this.constructor.prototype.originalShowItem = this.constructor.prototype.showItem;
							const originalShowItem = this.constructor.prototype.showItem;
							if (!this.constructor.prototype.originalShowItem) {
								console.error('Favorites: Failed to access original showItem method!');
								return;
							}

							// Overwrite method with additional functionality
							this.constructor.prototype.showItem = (function (originalShowItem, plugin) {
								return function (...args: CommunityItem[]) {
									// Load the favorite plugins
									plugin.favoritePlugins = JSON.parse(localStorage.getItem('favorite-plugins') || '[]');

									return originalShowItem.apply(this, args).then(async (r: void) => {
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
								};
							})(originalShowItem, plugin);
						}
					}

					// Check the opened Modal is the Community themes browse modal
					if (this.containerEl?.querySelector('.mod-community-theme')) {
						// Store the Community Theme Browse Modal prototype to be able to reset to the original
						plugin.communityThemesModalPrototype = this.constructor.prototype;

						// Check the theme updateItems is already overwritten
						if (!this.constructor.prototype.originalUpdateItems) {
							// Save original method
							this.constructor.prototype.originalUpdateItems = this.constructor.prototype.updateItems;
							const originalUpdateItems = this.constructor.prototype.updateItems;
							if (!this.constructor.prototype.originalUpdateItems) {
								console.error('Favorites: Failed to access original updateItems method!');
								return;
							}

							// Overwrite method with additional functionality
							this.constructor.prototype.updateItems = (function (originalUpdateItems, plugin) {
								return function () {
									// Load the favorite themes
									plugin.favoriteThemes = JSON.parse(localStorage.getItem('favorite-themes') || '[]');

									const result = originalUpdateItems.apply(this);

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
								};
							})(originalUpdateItems, plugin);
						}

						// Check the theme showItem is already overwritten
						if (!this.constructor.prototype.originalShowItem) {
							// Save original method
							this.constructor.prototype.originalShowItem = this.constructor.prototype.showItem;
							const originalShowItem = this.constructor.prototype.showItem;
							if (!this.constructor.prototype.originalShowItem) {
								console.error('Favorites: Failed to access original showItem method!');
								return;
							}

							// Overwrite method with additional functionality
							this.constructor.prototype.showItem = (function (originalShowItem, plugin) {
								// Load the favorite themes
								plugin.favoriteThemes = JSON.parse(localStorage.getItem('favorite-themes') || '[]');

								return function (...args: CommunityItem[]) {
									return originalShowItem.apply(this, args).then(async (r: void) => {
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
								};
							})(originalShowItem, plugin);
						}
					}

					// Restore the original Modal open function as soon as the CommunityPluginModal and CommunityThemesModal is opened once
					if (Modal.prototype.originalOpen && plugin.communityPluginModalPrototype && plugin.communityThemesModalPrototype) {
						Modal.prototype.open = Modal.prototype.originalOpen;
						delete Modal.prototype.originalOpen;
					}
				};
			})(originalModalOpen, this);
		}
		else {
			console.warn('Favorites plugin: Modal prototype already has originalOpen, this is not intended!');
		}

		/*
		 * TODO: Add command to save and reload the favorites list
		 * TODO: Add command to remove all favorites from list
		 * TODO: Add command to search for plugin to add to favorites list
		 */
	}

	async onunload() {
		// Restore the original Modal open function

		if (Modal.prototype.originalOpen) {
			Modal.prototype.open = Modal.prototype.originalOpen;
			delete Modal.prototype.originalOpen;
		}

		// Restore the original plugin updateItems function
		if (this.communityPluginModalPrototype && this.communityPluginModalPrototype.originalUpdateItems) {
			this.communityPluginModalPrototype.updateItems = this.communityPluginModalPrototype.originalUpdateItems;
			delete this.communityPluginModalPrototype.originalUpdateItems;
		}

		// Restore the original plugin showItem function
		if (this.communityPluginModalPrototype && this.communityPluginModalPrototype.originalShowItem) {
			this.communityPluginModalPrototype.showItem = this.communityPluginModalPrototype.originalShowItem;
			delete this.communityPluginModalPrototype.originalShowItem;
		}

		// Restore the original theme updateItems function
		if (this.communityThemesModalPrototype && this.communityThemesModalPrototype.originalUpdateItems) {
			this.communityThemesModalPrototype.updateItems = this.communityThemesModalPrototype.originalUpdateItems;
			delete this.communityThemesModalPrototype.originalUpdateItems;
		}

		// Restore the original theme showItem function
		if (this.communityThemesModalPrototype && this.communityThemesModalPrototype.originalShowItem) {
			this.communityThemesModalPrototype.showItem = this.communityThemesModalPrototype.originalShowItem;
			delete this.communityThemesModalPrototype.originalShowItem;
		}
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
