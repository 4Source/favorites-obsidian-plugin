import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { DialogModal } from 'src/modals/DialogModal';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'clear-theme-known-lists',
		name: 'Clear the theme known lists',
		callback: () => {
			plugin.loadKnownThemes();
			const numberClear = plugin.knownThemes.length;
			new DialogModal(plugin.app, `Clear ${numberClear} theme(s) permanently from known list?`, '', () => {
				plugin.knownThemes = [];
				plugin.saveKnownThemes();
				new Notice(`Cleared ${numberClear} themes from known list`);
			}, () => {
				new Notice('Canceled clear themes from known list');
			}, 'Clear', true, 'Cancel', false).open();
		},
	};
}