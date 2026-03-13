import CurrentPlugin from "../main";
import ClearPluginFavoritesLists from "./ClearPluginFavoritesLists";
import ClearThemeFavoritesLists from "./ClearThemeFavoritesLists";
import ExportFavoriteLists from "./ExportFavoriteLists";
import ImportFavoriteLists from "./ImportFavoriteLists";
import LoadFavoritesLists from "./LoadFavoritesLists";
import SaveFavoritesLists from "./SaveFavoritesLists";
import SearchAndAddPluginToFavoriteList from "./SearchAndAddPluginToFavoriteList";
import SearchAndAddThemeToFavoriteList from "./SearchAndAddThemeToFavoriteList";
import SearchAndRemovePluginFromFavoriteList from "./SearchAndRemovePluginFromFavoriteList";
import SearchAndRemoveThemeFromFavoriteList from "./SearchAndRemoveThemeFromFavoriteList";

export async function addAllCommands(plugin: CurrentPlugin) {
    // TODO: Dynamically import all files in the commands folder during bundling time

    plugin.addCommand(ClearPluginFavoritesLists(plugin));
    plugin.addCommand(ClearThemeFavoritesLists(plugin));
    plugin.addCommand(ExportFavoriteLists(plugin));
    plugin.addCommand(ImportFavoriteLists(plugin));
    plugin.addCommand(LoadFavoritesLists(plugin));
    plugin.addCommand(SaveFavoritesLists(plugin));
    plugin.addCommand(SearchAndAddPluginToFavoriteList(plugin));
    plugin.addCommand(SearchAndAddThemeToFavoriteList(plugin));
    plugin.addCommand(SearchAndRemovePluginFromFavoriteList(plugin));
    plugin.addCommand(SearchAndRemoveThemeFromFavoriteList(plugin));
}