import { Command, Notice } from "obsidian";
import CurrentPlugin from "../main";
import { DialogModal } from "src/modals/DialogModal";

export default function (plugin: CurrentPlugin): Command {
    return {
        id: 'clear-plugin-favorites-lists',
        name: 'Clear the plugin favorites lists',
        callback: () => {
            plugin.loadFavoritePlugins();
            const numberClear = plugin.favoritePlugins.length;
            new DialogModal(plugin.app, `Clear ${numberClear} plugin(s) permanently from favorite list?`, '', () => {
                plugin.favoritePlugins = [];
                plugin.saveFavoritesPlugins();
                new Notice(`Cleared ${numberClear} plugins from favorite list`);
            }, () => {
                new Notice('Canceled clear plugins from favorite list');
            }, 'Clear', true, 'Cancel', false).open();
        },
    };
}