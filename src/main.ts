import { normalizePath, Notice, Plugin } from 'obsidian';
import { PLUGIN_BACKUP_BASE_PATH } from './constants';
import { DialogModal } from './modals/DialogModal';
import { StringSuggestModal } from './modals/StringSuggestModal';
import { addAllCommands } from './commands';
import SettingsModalOpenTab from './patches/SettingsModal.openTab';
import ModalOpen from './patches/Modal.open';

export default class FavoritesPlugin extends Plugin {
	pluginsKey: string;
	themesKey: string;
	favoritePlugins: string[];
	favoriteThemes: string[];
	uninstallModalOpen?: () => void;
	uninstallSettingsModalOpenTab?: () => void;
	uninstallCommunityPluginModalUpdateItems?: () => void;
	uninstallCommunityPluginModalShowItem?: () => void;
	uninstallCommunityThemeModalUpdateItems?: () => void;
	uninstallCommunityThemeModalShowItem?: () => void;
	uninstallCommunityPluginsSettingTabRenderInstalledPlugin?: () => void;

	async onload() {
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

		// Register
		this.registerDomEvent(window, 'storage', (event) => {
			if (event.key === this.pluginsKey) {
				console.debug('Plugins key content changed', event);
				this.onFavoritePluginsChanged(event.newValue);
			}
			if (event.key === this.themesKey) {
				console.debug('Themes key content changed', event);
				this.onFavoriteThemesChanged(event.newValue);
			}
		});

		// Patch the opening of SettingsModal
		if (!this.uninstallSettingsModalOpenTab) {
			console.debug('Patch SettingsModal.openTab');
			this.uninstallSettingsModalOpenTab = SettingsModalOpenTab(this);
		}

		// Patch the opening of Modal
		if (!this.uninstallModalOpen) {
			console.debug('Patch Modal.open');
			this.uninstallModalOpen = ModalOpen(this);
		}

		// Add all commands registered
		addAllCommands(this);
	}

	async onunload() {
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
			if (this.uninstallCommunityPluginModalUpdateItems) {
				console.debug('Uninstall CommunityPluginModal.updateItem');
				this.uninstallCommunityPluginModalUpdateItems();
				this.uninstallCommunityPluginModalUpdateItems = undefined;
			}
			if (this.uninstallCommunityPluginModalShowItem) {
				console.debug('Uninstall CommunityPluginModal.showItem');
				this.uninstallCommunityPluginModalShowItem();
				this.uninstallCommunityPluginModalShowItem = undefined;
			}
			if (this.uninstallCommunityThemeModalUpdateItems) {
				console.debug('Uninstall CommunityThemeModal.updateItem');
				this.uninstallCommunityThemeModalUpdateItems();
				this.uninstallCommunityThemeModalUpdateItems = undefined;
			}
			if (this.uninstallCommunityThemeModalShowItem) {
				console.debug('Uninstall CommunityThemeModal.showItem');
				this.uninstallCommunityThemeModalShowItem();
				this.uninstallCommunityThemeModalShowItem = undefined;
			}
			if (this.uninstallCommunityPluginsSettingTabRenderInstalledPlugin) {
				console.debug('Uninstall CommunityPluginsSettingTab.renderInstalledPlugin');
				this.uninstallCommunityPluginsSettingTabRenderInstalledPlugin();
				this.uninstallCommunityPluginsSettingTabRenderInstalledPlugin = undefined;
			}
		}
		catch (e) {
			console.error('Failed uninstalling patch functions!');
			console.error(e);
		}
	}

	onFavoritePluginsChanged(newValue: string | null) {
		console.debug(`onFavoritePluginsChanged: ${newValue}`);
		if (newValue) {
			this.favoritePlugins = JSON.parse(newValue);
		}
		else {
			this.favoritePlugins = [];
		}
	}

	onFavoriteThemesChanged(newValue: string | null) {
		console.debug(`onFavoriteThemesChanged: ${newValue}`);
		if (newValue) {
			this.favoriteThemes = JSON.parse(newValue);
		}
		else {
			this.favoriteThemes = [];
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
