import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { DialogModal } from 'src/modals/DialogModal';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'clear-theme-in-use-list',
		name: 'Clear the theme in use list',
		callback: () => {
			plugin.loadInUseThemes();
			const numberClear = Object.keys(plugin.inUseThemes).length;
			new DialogModal(plugin.app, `Clear ${numberClear} theme(s) permanently from in use list?`, '', () => {
				plugin.inUseThemes = {};
				plugin.saveInUseThemes();
				new Notice(`Cleared ${numberClear} themes from in use list`);
			}, () => {
				new Notice('Canceled clear themes from in use list');
			}, 'Clear', true, 'Cancel', false).open();
		},
	};
}