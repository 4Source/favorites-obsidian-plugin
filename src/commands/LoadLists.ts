import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'load-lists',
		name: 'Manually load the lists',
		callback: () => {
			plugin.loadLists();
			new Notice('Loaded lists');
		},
	};
}