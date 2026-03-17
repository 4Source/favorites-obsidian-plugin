import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { ThemeManifest } from 'obsidian';
import { PLUGIN_ID } from 'src/constants';

const MONKEY_KEY = `${PLUGIN_ID}-StyleManager-installTheme`;

export default (plugin: MyPlugin) => around(plugin.app.customCss, {
	installTheme(oldMethod) {
		return dedupe(`${MONKEY_KEY}installTheme`, oldMethod, async function (manifest: ThemeManifest, version: string) {
			console.debug('Call StyleManager.installTheme');

			const result = oldMethod && await oldMethod.apply(this, [manifest, version]);

			// Load the theme lists
			plugin.loadKnownThemes();

			// Add Theme to known list if not already
			if (!plugin.knownThemes.contains(manifest.name)) {
				plugin.knownThemes.push(manifest.name);
			}

			plugin.saveKnownThemes();

			return result;
		});
	},
	setTheme(oldMethod) {
		return dedupe(`${MONKEY_KEY}setTheme`, oldMethod, function (name: string) {
			console.debug('Call StyleManager.setTheme', this);

			const currentVault = plugin.app.appId;

			// Load the theme lists
			plugin.loadInUseThemes();

			// Remove current vault from replaced theme
			const oldTheme = this.theme;
			if (plugin.inUseThemes[oldTheme] && Array.isArray(plugin.inUseThemes[oldTheme]) && plugin.inUseThemes[oldTheme].contains(currentVault)) {
				plugin.inUseThemes[oldTheme].remove(currentVault);

				// Cleanup in use if last vault stops using it
				if (plugin.inUseThemes[oldTheme].length <= 0) {
					delete plugin.inUseThemes[oldTheme];
				}
			}

			const result = oldMethod && oldMethod.apply(this, [name]);

			// Ignore the default theme
			if (name === '') {
				plugin.saveInUseThemes();
				return result;
			}

			// Add the theme to the in use list with this vault as user
			if (!plugin.inUseThemes[name] || !Array.isArray(plugin.inUseThemes[name])) {
				plugin.inUseThemes[name] = [];
			}
			if (!plugin.inUseThemes[name].contains(currentVault)) {
				plugin.inUseThemes[name].push(currentVault);
			}

			plugin.saveInUseThemes();

			return result;
		});
	},
});