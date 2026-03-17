import { CommunityPluginsSettingTab, SettingsModal, SettingTab } from 'obsidian';
import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { PLUGIN_ID } from 'src/constants';
import patchCommunityPluginsSettingTab from './patch.CommunityPluginsSettingTab';

const MONKEY_KEY = `${PLUGIN_ID}-SettingsModal-`;

export default (plugin: MyPlugin) => around(plugin.app.setting as SettingsModal, {
	openTab(oldMethod) {
		return dedupe(`${MONKEY_KEY}openTab`, oldMethod, function (tab: SettingTab) {
			console.debug('Call SettingsModal.openTab');

			if (tab.id === 'community-plugins') {
				if (!plugin.uninstallCommunityPluginsSettingTabPatch) {
					console.debug('Patch CommunityPluginsSettingTab');
					plugin.uninstallCommunityPluginsSettingTabPatch = patchCommunityPluginsSettingTab(tab as CommunityPluginsSettingTab, plugin);
				}
			}

			if (plugin.uninstallSettingsModalPatch && plugin.uninstallCommunityPluginsSettingTabPatch) {
				console.debug('Uninstall SettingsModal patch');
				plugin.uninstallSettingsModalPatch();
				plugin.uninstallSettingsModalPatch = undefined;
			}

			return oldMethod && oldMethod.apply(this, [tab]);
		});
	},
});