import { Command, Notice } from 'obsidian';
import CurrentPlugin from '../main';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'save-favorites-lists',
		name: 'Manually save the favorites lists',
		callback: () => {
			plugin.saveFavorites();
			new Notice('Saved favorite lists');
		},
	};
}