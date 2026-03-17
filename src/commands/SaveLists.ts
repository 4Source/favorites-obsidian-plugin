import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'save-lists',
		name: 'Manually save the lists',
		callback: () => {
			plugin.saveLists();
			new Notice('Saved lists');
		},
	};
}