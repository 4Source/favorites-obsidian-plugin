import { Command, Notice } from "obsidian";
import CurrentPlugin from "../main";
import { DialogModal } from "src/modals/DialogModal";

export default function (plugin: CurrentPlugin): Command {
    return {
        id: 'clear-theme-favorites-lists',
        name: 'Clear the theme favorites lists',
        callback: () => {
            plugin.loadFavoriteThemes();
            const numberClear = plugin.favoriteThemes.length;
            new DialogModal(plugin.app, `Clear ${numberClear} theme(s) permanently from favorite list?`, '', () => {
                plugin.favoriteThemes = [];
                plugin.saveFavoritesThemes();
                new Notice(`Cleared ${numberClear} themes from favorite list`);
            }, () => {
                new Notice('Canceled clear themes from favorite list');
            }, 'Clear', true, 'Cancel', false).open();
        },
    };
}