import { Command } from "obsidian";
import CurrentPlugin from "../main";

export default function (plugin: CurrentPlugin): Command {
    return {
        id: 'export-favorite-lists',
        name: 'Export favorite lists to file',
        callback: () => { plugin.exportFavorites(); },
    };
}