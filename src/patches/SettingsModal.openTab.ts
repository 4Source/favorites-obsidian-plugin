import { CommunityPluginsSettingTab, SettingsModal, SettingTab } from 'obsidian';
import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { PLUGIN_ID } from 'src/constants';
import CommunityPluginsSettingTabRenderInstalledPlugin from './CommunityPluginsSettingTab.renderInstalledPlugin';

const MONKEY_KEY = `${PLUGIN_ID}-SettingsModal-openTab`;

export default (plugin: MyPlugin) => around(plugin.app.setting as SettingsModal, {
	openTab(oldMethod) {
		return dedupe(MONKEY_KEY, oldMethod, function (tab: SettingTab) {
			console.debug('Call SettingsModal.openTab');

			if (tab.id === 'community-plugins') {
				if (!plugin.uninstallCommunityPluginsSettingTabRenderInstalledPlugin) {
					console.debug('Patch CommunityPluginsSettingTab.renderInstalledPlugin');
					plugin.uninstallCommunityPluginsSettingTabRenderInstalledPlugin = CommunityPluginsSettingTabRenderInstalledPlugin(tab as CommunityPluginsSettingTab, plugin);
				}
			}

			if (plugin.uninstallSettingsModalOpenTab && plugin.uninstallCommunityPluginsSettingTabRenderInstalledPlugin) {
				console.debug('Uninstall SettingsModal.openTab');
				plugin.uninstallSettingsModalOpenTab();
				plugin.uninstallSettingsModalOpenTab = undefined;
			}

			return oldMethod && oldMethod.apply(this, [tab]);
		});
	},
});