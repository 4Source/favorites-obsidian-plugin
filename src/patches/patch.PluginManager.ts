import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { PluginManifest } from 'obsidian';
import { PLUGIN_ID } from 'src/constants';

const MONKEY_KEY = `${PLUGIN_ID}-PluginManager-`;

export default (plugin: MyPlugin) => around(plugin.app.plugins, {
	installPlugin(oldMethod) {
		return dedupe(`${MONKEY_KEY}installPlugin`, oldMethod, async function (repo: string, version: string, manifest: PluginManifest) {
			console.debug('Call PluginManager.installPlugin');

			const result = oldMethod && await oldMethod.apply(this, [repo, version, manifest]);

			// Load the plugin lists
			plugin.loadKnownPlugins();

			// Add Plugin to known list if not already
			if (!plugin.knownPlugins.contains(manifest.id)) {
				plugin.knownPlugins.push(manifest.id);
			}

			plugin.saveKnownPlugins();

			return result;
		});
	},
	loadPlugin(oldMethod) {
		return dedupe(`${MONKEY_KEY}loadPlugin`, oldMethod, async function (id: string) {
			console.debug('Call PluginManager.loadPlugin');

			const currentVault = plugin.app.appId;

			// Load the plugin lists
			plugin.loadInUsePlugins();

			// Add the plugin to the in use list with this vault as user
			if (!plugin.inUsePlugins[id] || !Array.isArray(plugin.inUsePlugins[id])) {
				plugin.inUsePlugins[id] = [];
			}
			if (!plugin.inUsePlugins[id].contains(currentVault)) {
				plugin.inUsePlugins[id].push(currentVault);
			}

			plugin.saveInUsePlugins();

			return oldMethod && oldMethod.apply(this, [id]);
		});
	},
	unloadPlugin(oldMethod) {
		return dedupe(`${MONKEY_KEY}unloadPlugin`, oldMethod, async function (id: string) {
			console.debug('Call PluginManager.unloadPlugin');

			const currentVault = plugin.app.appId;

			// Load the plugin lists
			plugin.loadInUsePlugins();

			// Remove current vault from unloaded plugin
			if (plugin.inUsePlugins[id] && Array.isArray(plugin.inUsePlugins[id]) && plugin.inUsePlugins[id].contains(currentVault)) {
				plugin.inUsePlugins[id].remove(currentVault);

				// Cleanup in use if last vault stops using it
				if (plugin.inUsePlugins[id].length <= 0) {
					delete plugin.inUsePlugins[id];
				}
			}

			plugin.saveInUsePlugins();

			return oldMethod && oldMethod.apply(this, [id]);
		});
	},
});