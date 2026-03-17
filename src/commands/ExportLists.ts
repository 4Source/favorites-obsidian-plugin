import { Command, normalizePath, Notice } from 'obsidian';
import CurrentPlugin from '../main';
import { PLUGIN_BACKUP_BASE_PATH } from 'src/constants';

export default function (plugin: CurrentPlugin): Command {
	return {
		id: 'export-lists',
		name: 'Export lists to file',
		callback: async () => {
			if (plugin.favoritePlugins.length <= 0 && plugin.favoriteThemes.length <= 0 && Object.keys(plugin.inUsePlugins).length <= 0 && Object.keys(plugin.inUseThemes).length <= 0 && plugin.knownPlugins.length <= 0 && plugin.knownThemes.length <= 0) {
				new Notice('No lists to backup');
				return;
			}

			// Ensure backup path does exist
			const backupPath = normalizePath(`${plugin.app.vault.configDir}${PLUGIN_BACKUP_BASE_PATH}`);
			await plugin.app.vault.adapter.mkdir(backupPath);

			// Create the file name
			const pad = (n: number) => n.toString().padStart(2, '0');
			const date = new Date();
			const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
			const backupFilePath = normalizePath(`${backupPath}/favorite-${dateString}.json`);

			// Write backup file for lists
			await plugin.app.vault.adapter.write(backupFilePath, JSON.stringify({
				favoritePlugins: plugin.favoritePlugins,
				favoriteThemes: plugin.favoriteThemes,
				inUsePlugins: plugin.inUsePlugins,
				inUseThemes: plugin.inUseThemes,
				knownPlugins: plugin.knownPlugins,
				knownThemes: plugin.knownThemes,
			}));
			new Notice(`Lists backup successful written to: ${backupFilePath}`);
		},
	};
}