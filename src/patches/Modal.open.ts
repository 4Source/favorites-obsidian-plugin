import { Modal } from 'obsidian';
import MyPlugin from '../main';
import CommunityThemeModalShowItem from './CommunityThemeModal.showItem';
import CommunityThemeModalUpdateItems from './CommunityThemeModal.updateItems';
import CommunityPluginModalShowItem from './CommunityPluginModal.showItem';
import CommunityPluginModalUpdateItems from './CommunityPluginModal.updateItems';
import { around, dedupe } from 'monkey-around';
import { MONKEY_KEY_MODAL_OPEN } from 'src/constants';

export default (plugin: MyPlugin) => around(Modal.prototype, {
	open(oldMethod) {
		return dedupe(MONKEY_KEY_MODAL_OPEN, oldMethod, function () {
			console.debug('Call Modal.open');
			const result = oldMethod && oldMethod.apply(this);

			// Check the opened Modal is the Community plugin browse modal
			if (this.containerEl?.querySelector('.mod-community-plugin')) {
				// Patch updateItems method
				if (!plugin.uninstallCommunityPluginModalUpdateItems) {
					console.debug('Patch CommunityPluginModal.updateItems');
					plugin.uninstallCommunityPluginModalUpdateItems = CommunityPluginModalUpdateItems(this, plugin);
				}

				// Patch showItem method
				if (!plugin.uninstallCommunityPluginModalShowItem) {
					console.debug('Patch CommunityPluginModal.showItem');
					plugin.uninstallCommunityPluginModalShowItem = CommunityPluginModalShowItem(this, plugin);
				}
			}

			// Check the opened Modal is the Community themes browse modal
			if (this.containerEl?.querySelector('.mod-community-theme')) {
				// Patch updateItems method
				if (!plugin.uninstallCommunityThemeModalUpdateItems) {
					console.debug('Patch CommunityThemeModal.updateItems');
					plugin.uninstallCommunityThemeModalUpdateItems = CommunityThemeModalUpdateItems(this, plugin);
				}

				// Patch showItems method
				if (!plugin.uninstallCommunityThemeModalShowItem) {
					console.debug('Patch CommunityThemeModal.showItem');
					plugin.uninstallCommunityThemeModalShowItem = CommunityThemeModalShowItem(this, plugin);
				}
			}

			if (plugin.uninstallModalOpen && plugin.uninstallCommunityPluginModalUpdateItems && plugin.uninstallCommunityPluginModalShowItem && plugin.uninstallCommunityThemeModalUpdateItems && plugin.uninstallCommunityThemeModalShowItem) {
				console.debug('Uninstall Modal.open');
				plugin.uninstallModalOpen();
				plugin.uninstallModalOpen = undefined;
			}

			return result;
		});
	},
});