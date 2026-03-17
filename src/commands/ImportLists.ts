import { Command, normalizePath, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { PLUGIN_BACKUP_BASE_PATH } from 'src/constants';
import { StringSuggestModal } from 'src/modals/StringSuggestModal';
import { DialogModal } from 'src/modals/DialogModal';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'import-lists',
		name: 'Import lists from file',
		callback: async () => {
			const backupPath = normalizePath(`${plugin.app.vault.configDir}${PLUGIN_BACKUP_BASE_PATH}`);
			if (!(await plugin.app.vault.adapter.exists(backupPath))) {
				// Backup path does not exist
				new Notice(`Backup path does not exist: ${backupPath}`);
				return;
			}

			const backupFiles = (await plugin.app.vault.adapter.list(backupPath)).files;
			if (backupFiles.length <= 0) {
				// Backup path is empty
				new Notice('Backup path is empty');
				return;
			}

			new StringSuggestModal(plugin.app, 'Select backup file to load from', backupFiles, async (result) => {
				const content = await plugin.app.vault.adapter.read(result);
				const json = JSON.parse(content);
				const loadedFavoritePlugins = json.favoritePlugins || [];
				const loadedFavoriteThemes = json.favoriteThemes || [];
				const loadedInUsePlugins = json.inUsePlugins || [];
				const loadedInUseThemes = json.inUseThemes || [];
				const loadedKnownPlugins = json.knownPlugins || [];
				const loadedKnownThemes = json.knownThemes || [];
				new DialogModal(plugin.app, 'Are you sure you want to overwrite current lists?', `The following lists will be overwritten: favorite plugins will change from ${plugin.favoritePlugins.length} items to ${loadedFavoritePlugins.length} items, favorite themes will change from ${plugin.favoriteThemes.length} items to ${loadedFavoriteThemes.length} items, in use plugins will change from ${plugin.inUsePlugins.length} items to ${loadedInUsePlugins.length} items, in use themes will change from ${plugin.inUseThemes.length} items to ${loadedInUseThemes.length} items, known plugins will change from ${plugin.knownPlugins.length} items to ${loadedKnownPlugins.length} items, and known themes will change from ${plugin.knownThemes.length} items to ${loadedKnownThemes.length} items.`, () => {
					plugin.favoritePlugins = loadedFavoritePlugins;
					plugin.favoriteThemes = loadedFavoriteThemes;
					plugin.inUsePlugins = loadedInUsePlugins;
					plugin.inUseThemes = loadedInUseThemes;
					plugin.knownPlugins = loadedKnownPlugins;
					plugin.knownThemes = loadedKnownThemes;
					plugin.saveLists();

					new Notice('Loaded backup successfully');
				}, () => {
					new Notice('Canceled loading backup by user');
				}, 'Overwrite', true, 'Cancel', false).open();
			}).open();
		},
	};
}