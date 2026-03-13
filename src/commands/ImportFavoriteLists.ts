import { Command } from "obsidian";
import CurrentPlugin from "../main";

export default function (plugin: CurrentPlugin): Command {
    return {
        id: 'import-favorite-lists',
        name: 'Import favorite lists from file',
        callback: () => { plugin.importFavorites(); },
    };
}