import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { DialogModal } from 'src/modals/DialogModal';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'clear-plugin-in-use-list',
		name: 'Clear the plugin in use list',
		callback: () => {
			plugin.loadInUsePlugins();
			const numberClear = Object.keys(plugin.inUsePlugins).length;
			new DialogModal(plugin.app, `Clear ${numberClear} plugin(s) permanently from in use list?`, '', () => {
				plugin.inUsePlugins = {};
				plugin.saveInUsePlugins();
				new Notice(`Cleared ${numberClear} plugins from in use list`);
			}, () => {
				new Notice('Canceled clear plugins from in use list');
			}, 'Clear', true, 'Cancel', false).open();
		},
	};
}