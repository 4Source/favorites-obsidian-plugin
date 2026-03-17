import { Modal } from 'obsidian';
import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { PLUGIN_ID } from 'src/constants';
import patchCommunityPluginModal from './patch.CommunityPluginModal';
import patchCommunityThemeModal from './patch.CommunityThemeModal';

const MONKEY_KEY = `${PLUGIN_ID}-Modal-`;

export default (plugin: MyPlugin) => around(Modal.prototype, {
	open(oldMethod) {
		return dedupe(`${MONKEY_KEY}open`, oldMethod, function () {
			// console.debug('Call Modal.open');
			const result = oldMethod && oldMethod.apply(this);

			// Check the opened Modal is the Community plugin browse modal
			if (this.containerEl?.querySelector('.mod-community-plugin')) {
				// Patch CommunityPluginModal
				if (!plugin.uninstallCommunityPluginModalPatch) {
					// console.debug('Patch CommunityPluginModal');
					plugin.uninstallCommunityPluginModalPatch = patchCommunityPluginModal(this, plugin);
				}
			}

			// Check the opened Modal is the Community themes browse modal
			if (this.containerEl?.querySelector('.mod-community-theme')) {
				// Patch CommunityThemeModal
				if (!plugin.uninstallCommunityThemeModalPatch) {
					// console.debug('Patch CommunityThemeModal');
					plugin.uninstallCommunityThemeModalPatch = patchCommunityThemeModal(this, plugin);
				}
			}

			if (plugin.uninstallModalPatch && plugin.uninstallCommunityPluginModalPatch && plugin.uninstallCommunityThemeModalPatch) {
				// console.debug('Uninstall Modal patch');
				plugin.uninstallModalPatch();
				plugin.uninstallModalPatch = undefined;
			}

			return result;
		});
	},
});