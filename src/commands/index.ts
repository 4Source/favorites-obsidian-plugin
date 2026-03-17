import CurrentPlugin from '../main';
import ClearPluginFavoritesList from './ClearPluginFavoritesList';
import ClearPluginInUseList from './ClearPluginInUseList';
import ClearPluginKnownList from './ClearPluginKnownList';
import ClearThemeFavoritesList from './ClearThemeFavoritesList';
import ClearThemeInUseList from './ClearThemeInUseList';
import ClearThemeKnownList from './ClearThemeKnownList';
import ExportLists from './ExportLists';
import ImportLists from './ImportLists';
import LoadLists from './LoadLists';
import SaveLists from './SaveLists';
import SearchAndAddPluginToFavoriteList from './SearchAndAddPluginToFavoriteList';
import SearchAndAddThemeToFavoriteList from './SearchAndAddThemeToFavoriteList';
import SearchAndRemovePluginFromFavoriteList from './SearchAndRemovePluginFromFavoriteList';
import SearchAndRemoveThemeFromFavoriteList from './SearchAndRemoveThemeFromFavoriteList';

export async function addAllCommands(plugin: CurrentPlugin) {
	// TODO: Dynamically import all files in the commands folder during bundling time

	plugin.addCommand(ClearPluginFavoritesList(plugin));
	plugin.addCommand(ClearPluginInUseList(plugin));
	plugin.addCommand(ClearPluginKnownList(plugin));
	plugin.addCommand(ClearThemeFavoritesList(plugin));
	plugin.addCommand(ClearThemeInUseList(plugin));
	plugin.addCommand(ClearThemeKnownList(plugin));
	plugin.addCommand(ExportLists(plugin));
	plugin.addCommand(ImportLists(plugin));
	plugin.addCommand(LoadLists(plugin));
	plugin.addCommand(SaveLists(plugin));
	plugin.addCommand(SearchAndAddPluginToFavoriteList(plugin));
	plugin.addCommand(SearchAndAddThemeToFavoriteList(plugin));
	plugin.addCommand(SearchAndRemovePluginFromFavoriteList(plugin));
	plugin.addCommand(SearchAndRemoveThemeFromFavoriteList(plugin));
}