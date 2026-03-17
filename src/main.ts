import { Plugin } from 'obsidian';
import { addAllCommands } from './commands';
import patchSettingsModal from './patches/patch.SettingsModal';
import patchModal from './patches/patch.Modal';

export default class FavoritesPlugin extends Plugin {
	pluginFavoritesKey: string;
	favoritePlugins: string[];
	themeFavoritesKey: string;
	favoriteThemes: string[];
	pluginInUseKey: string;
	inUsePlugins: Record<string, string[]>;
	themeInUseKey: string;
	inUseThemes: Record<string, string[]>;
	pluginKnownKey: string;
	knownPlugins: string[];
	themeKnownKey: string;
	knownThemes: string[];
	uninstallCommunityPluginModalPatch?: () => void;
	uninstallCommunityPluginsSettingTabPatch?: () => void;
	uninstallCommunityThemeModalPatch?: () => void;
	uninstallModalPatch?: () => void;
	uninstallSettingsModalPatch?: () => void;

	async onload() {
		this.loadStorageKeys();
		this.loadLists();

		// Patch SettingsModal
		if (!this.uninstallSettingsModalPatch) {
			console.debug('Patch SettingsModal');
			this.uninstallSettingsModalPatch = patchSettingsModal(this);
		}

		// Patch Modal
		if (!this.uninstallModalPatch) {
			console.debug('Patch Modal');
			this.uninstallModalPatch = patchModal(this);
		}

		// TODO: Patch install, uninstall, enable, disable for plugins/themes

		// Add all commands registered
		addAllCommands(this);
	}

	async onunload() {
		try {
			// Restore the original functions
			if (this.uninstallCommunityPluginModalPatch) {
				console.debug('Uninstall CommunityPluginModal patch');
				this.uninstallCommunityPluginModalPatch();
				this.uninstallCommunityPluginModalPatch = undefined;
			}

			if (this.uninstallCommunityPluginsSettingTabPatch) {
				console.debug('Uninstall CommunityPluginsSettingTab patch');
				this.uninstallCommunityPluginsSettingTabPatch();
				this.uninstallCommunityPluginsSettingTabPatch = undefined;
			}

			if (this.uninstallCommunityThemeModalPatch) {
				console.debug('Uninstall CommunityThemeModal patch');
				this.uninstallCommunityThemeModalPatch();
				this.uninstallCommunityThemeModalPatch = undefined;
			}

			if (this.uninstallModalPatch) {
				console.debug('Uninstall Modal patch');
				this.uninstallModalPatch();
				this.uninstallModalPatch = undefined;
			}

			if (this.uninstallSettingsModalPatch) {
				console.debug('Uninstall SettingsModal patch');
				this.uninstallSettingsModalPatch();
				this.uninstallSettingsModalPatch = undefined;
			}
		}
		catch (e) {
			console.error('Failed uninstalling patch functions!');
			console.error(e);
		}
	}

	loadStorageKeys() {
		// favorite keys
		if (process.env.FAVORITE_PLUGINS_KEY) {
			this.pluginFavoritesKey = process.env.FAVORITE_PLUGINS_KEY;
		}
		else {
			throw Error('Missing environment variable \'FAVORITE_PLUGINS_KEY\'');
		}
		if (process.env.FAVORITE_THEMES_KEY) {
			this.themeFavoritesKey = process.env.FAVORITE_THEMES_KEY;
		}
		else {
			throw Error('Missing environment variable \'FAVORITE_THEMES_KEY\'');
		}
		console.debug(`Plugins favorite key: ${this.pluginFavoritesKey} Themes favorite key: ${this.themeFavoritesKey}`);

		// In use keys
		if (process.env.INUSE_PLUGINS_KEY) {
			this.pluginInUseKey = process.env.INUSE_PLUGINS_KEY;
		}
		else {
			throw Error('Missing environment variable \'INUSE_PLUGINS_KEY\'');
		}
		if (process.env.INUSE_THEMES_KEY) {
			this.themeInUseKey = process.env.INUSE_THEMES_KEY;
		}
		else {
			throw Error('Missing environment variable \'INUSE_THEMES_KEY\'');
		}
		console.debug(`Plugins in use key: ${this.pluginInUseKey} Themes in use key: ${this.themeInUseKey}`);

		// Known keys
		if (process.env.KNOWN_PLUGINS_KEY) {
			this.pluginKnownKey = process.env.KNOWN_PLUGINS_KEY;
		}
		else {
			throw Error('Missing environment variable \'KNOWN_PLUGINS_KEY\'');
		}
		if (process.env.KNOWN_THEMES_KEY) {
			this.themeKnownKey = process.env.KNOWN_THEMES_KEY;
		}
		else {
			throw Error('Missing environment variable \'KNOWN_THEMES_KEY\'');
		}
		console.debug(`Plugins known key: ${this.pluginKnownKey} Themes known key: ${this.themeKnownKey}`);

		// Register for storage key changes
		this.registerDomEvent(window, 'storage', (event) => {
			if (event.key === this.pluginFavoritesKey) {
				console.debug('Plugins favorites key content changed', event);
				this.onFavoritePluginsChanged(event.newValue);
			}
			if (event.key === this.themeFavoritesKey) {
				console.debug('Themes favorites key content changed', event);
				this.onFavoriteThemesChanged(event.newValue);
			}
			if (event.key === this.pluginInUseKey) {
				console.debug('Plugins in use key content changed', event);
				this.onInUsePluginsChanged(event.newValue);
			}
			if (event.key === this.themeInUseKey) {
				console.debug('Themes in use key content changed', event);
				this.onInUseThemesChanged(event.newValue);
			}
			if (event.key === this.pluginKnownKey) {
				console.debug('Plugins known key content changed', event);
				this.onKnownPluginsChanged(event.newValue);
			}
			if (event.key === this.themeKnownKey) {
				console.debug('Themes known key content changed', event);
				this.onKnownThemesChanged(event.newValue);
			}
		});
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

	onInUsePluginsChanged(newValue: string | null) {
		console.debug(`onInUsePluginsChanged: ${newValue}`);
		if (newValue) {
			this.inUsePlugins = JSON.parse(newValue);
		}
		else {
			this.inUsePlugins = {};
		}
	}

	onInUseThemesChanged(newValue: string | null) {
		console.debug(`onInUseThemesChanged: ${newValue}`);
		if (newValue) {
			this.inUseThemes = JSON.parse(newValue);
		}
		else {
			this.inUseThemes = {};
		}
	}

	onKnownPluginsChanged(newValue: string | null) {
		console.debug(`onKnownPluginsChanged: ${newValue}`);
		if (newValue) {
			this.knownPlugins = JSON.parse(newValue);
		}
		else {
			this.knownPlugins = [];
		}
	}

	onKnownThemesChanged(newValue: string | null) {
		console.debug(`onKnownThemesChanged: ${newValue}`);
		if (newValue) {
			this.knownThemes = JSON.parse(newValue);
		}
		else {
			this.knownThemes = [];
		}
	}

	loadFavoritePlugins() {
		// Load the favorite plugins
		this.favoritePlugins = JSON.parse(localStorage.getItem(this.pluginFavoritesKey) || '[]');
	}

	loadFavoriteThemes() {
		// Load the favorite plugins
		this.favoriteThemes = JSON.parse(localStorage.getItem(this.themeFavoritesKey) || '[]');
	}

	loadInUsePlugins() {
		// Load the in use plugins
		this.inUsePlugins = JSON.parse(localStorage.getItem(this.pluginInUseKey) || '{}');
	}

	loadInUseThemes() {
		// Load the in use plugins
		this.inUseThemes = JSON.parse(localStorage.getItem(this.themeInUseKey) || '{}');
	}

	loadKnownPlugins() {
		// Load the known plugins
		this.knownPlugins = JSON.parse(localStorage.getItem(this.pluginKnownKey) || '[]');
	}

	loadKnownThemes() {
		// Load the known plugins
		this.knownThemes = JSON.parse(localStorage.getItem(this.themeKnownKey) || '[]');
	}

	loadLists() {
		this.loadFavoritePlugins();
		this.loadFavoriteThemes();
		this.loadInUsePlugins();
		this.loadInUseThemes();
		this.loadKnownPlugins();
		this.loadKnownThemes();
	}

	saveFavoritePlugins() {
		if (this.favoritePlugins.length > 0) {
			localStorage.setItem(this.pluginFavoritesKey, JSON.stringify(this.favoritePlugins));
		}
		else {
			localStorage.removeItem(this.pluginFavoritesKey);
		}
	}

	saveFavoriteThemes() {
		if (this.favoriteThemes.length > 0) {
			localStorage.setItem(this.themeFavoritesKey, JSON.stringify(this.favoriteThemes));
		}
		else {
			localStorage.removeItem(this.themeFavoritesKey);
		}
	}

	saveInUsePlugins() {
		if (Object.keys(this.inUsePlugins).length > 0) {
			localStorage.setItem(this.pluginInUseKey, JSON.stringify(this.inUsePlugins));
		}
		else {
			localStorage.removeItem(this.pluginInUseKey);
		}
	}

	saveInUseThemes() {
		if (Object.keys(this.inUseThemes).length > 0) {
			localStorage.setItem(this.themeInUseKey, JSON.stringify(this.inUseThemes));
		}
		else {
			localStorage.removeItem(this.themeInUseKey);
		}
	}

	saveKnownPlugins() {
		if (this.knownPlugins.length > 0) {
			localStorage.setItem(this.pluginKnownKey, JSON.stringify(this.knownPlugins));
		}
		else {
			localStorage.removeItem(this.pluginKnownKey);
		}
	}

	saveKnownThemes() {
		if (this.knownThemes.length > 0) {
			localStorage.setItem(this.themeKnownKey, JSON.stringify(this.knownThemes));
		}
		else {
			localStorage.removeItem(this.themeKnownKey);
		}
	}

	saveLists() {
		this.saveFavoritePlugins();
		this.saveFavoriteThemes();
		this.saveInUsePlugins();
		this.saveInUseThemes();
		this.saveKnownPlugins();
		this.saveKnownThemes();
	}
}
