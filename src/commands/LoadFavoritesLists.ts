import { Command, Notice } from "obsidian";
import CurrentPlugin from "../main";

export default function (plugin: CurrentPlugin): Command {
    return {
        id: 'load-favorites-lists',
        name: 'Manually load the favorites lists',
        callback: () => {
            plugin.loadFavorites();
            new Notice('Loaded favorite lists');
        },
    };
}