import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { DialogModal } from 'src/modals/DialogModal';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'clear-plugin-known-lists',
		name: 'Clear the plugin known lists',
		callback: () => {
			plugin.loadKnownPlugins();
			const numberClear = plugin.knownPlugins.length;
			new DialogModal(plugin.app, `Clear ${numberClear} plugin(s) permanently from known list?`, '', () => {
				plugin.knownPlugins = [];
				plugin.saveKnownPlugins();
				new Notice(`Cleared ${numberClear} plugins from known list`);
			}, () => {
				new Notice('Canceled clear plugins from known list');
			}, 'Clear', true, 'Cancel', false).open();
		},
	};
}