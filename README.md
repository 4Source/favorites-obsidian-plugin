***Favorites*** lets you manage a global favorites list for both plugins and themes in Obsidian - and keeps it consistent across all your vaults.

Stop re-searching the same plugins or themes in every vault. With one central list, your essential tools and styles are always easy to find. 

# Features
- **Global Favorites list for Plugins & Themes** - Mark your go-to plugins and themes once and access them across all vaults.
- **Global In Use list for Plugins & Themes** - Automatically maintained list of plugins and themes that are currently enabled in at least one vault.
- **Global Known list for Plugins & Themes** - Automatically maintained history of plugins and themes that have been installed at least once in any vault.
- **Ease of Use** - Favorite/unfavorite directly inside the Obsidian's
  - Plugin browser
  - Community plugins tab
  - Theme browser
  - via [Commands](#commands)
- **Vault Independence** - Favorites are stored globally on your device, not tied to a single vault

# How It Works
1. Install and enable ***Favorites***.
2. Open Obsidian's plugin or theme browser.
3. Select the plugin/theme you wan't to favorite.
4. Use the Favorite button.
5. Your favorites are saved globally and appear in every vault.

For plugins you can also favorite already installed plugins directly from the Community plugins tab.

# Screenshots
![FavoritesPluginBrowserDemo_1 4 0](https://github.com/user-attachments/assets/6b93f818-207a-4381-ab4d-f5aa57cad021)

![FavoritesThemeBrowserDemo_1 4 0](https://github.com/user-attachments/assets/3f3b802e-3a82-45fd-a174-b51d5dd4c0f0)

<img width="1100" height="1000" alt="image" src="https://github.com/user-attachments/assets/5c8537dd-f5dc-4393-8cf7-6b506806631c" />

<img width="1100" height="1000" alt="image" src="https://github.com/user-attachments/assets/a6aebde5-a93c-4a93-ba0e-ccb9ad1c6560" />

<img width="1100" height="1000" alt="image" src="https://github.com/user-attachments/assets/e34ec7f4-57f2-4dc1-a150-45e9ab152295" />

<img width="1100" height="1000" alt="image" src="https://github.com/user-attachments/assets/ec9dfdf9-d607-4ff5-8679-fc286cb5e43c" />

<img width="1100" height="1000" alt="image" src="https://github.com/user-attachments/assets/a0b35f98-b194-433f-bd9e-66eecb5dd111" />

# Commands
If you prefer managing your favorites list with commands here are the available commands
- [Search and add plugin to favorite list](#search-and-add-plugin-to-favorite-list)
- [Search and add theme to favorite list](#search-and-add-theme-to-favorite-list)
- [Search and remove plugin from favorite list](#search-and-remove-plugin-from-favorite-list)
- [Search and remove theme from favorite list](#search-and-remove-theme-from-favorite-list)
- [Clear the plugin favorites list](#clear-the-plugin-favorites-list)
- [Clear the plugin in use list](#clear-the-plugin-in-use-list)
- [Clear the plugin known list](#clear-the-plugin-known-list)
- [Clear the theme favorites list](#clear-the-theme-favorites-list)
- [Clear the theme in use list](#clear-the-theme-in-use-list)
- [Clear the theme known list](#clear-the-theme-known-list)
- [Manually load the lists](#manually-load-the-lists)
- [Manually save the lists](#manually-save-the-lists)
- [Export lists to file](#export-lists-to-file)
- [Import lists from file](#import-lists-from-file)

## Search and add plugin to favorite list
Search and select a community plugin to add it to your favorites list. The list is fetched from the community plugin registry.

## Search and add theme to favorite list
Search and select a community theme to add it to your favorites list. The list is fetched from the community theme registry.

## Search and remove plugin from favorite list
Search and select from your current favorite plugins to remove it from your favorites list.

## Search and remove theme from favorite list
Search and select from your current favorite themes to remove it from your favorites list.

## Clear the plugin favorites list
Permanently removes ***all*** plugins from your favorites list after confirmation. 
> [!WARNING]
> This action cannot be undone.

## Clear the plugin in use list
Permanently removes ***all*** plugins from your in use list after confirmation. 
> [!WARNING]
> This action cannot be undone.

## Clear the plugin known list
Permanently removes ***all*** plugins from your known list after confirmation. 
> [!WARNING]
> This action cannot be undone.

## Clear the theme favorites list
Permanently removes ***all*** themes from your favorites list after confirmation.
> [!WARNING]
> This action cannot be undone.

## Clear the theme in use list
Permanently removes ***all*** themes from your in use list after confirmation.
> [!WARNING]
> This action cannot be undone.

## Clear the theme known list
Permanently removes ***all*** themes from your known list after confirmation.
> [!WARNING]
> This action cannot be undone.

## Manually load the lists
Reloads the saved lists for plugins and themes. Use this to restore your lists if they were changed externally or need to be refreshed.
> [!NOTE]
> This is normally not necessary because the plugin handles this internally.

## Manually save the lists
Forces the plugin to immediately save your current lists for plugins and themes. Use this if you want to ensure your lists are persistent.
> [!WARNING] 
> This could overwrite changes from another running Obsidian instance if the changes from there are not loaded beforehand.

> [!NOTE]
> This is normally not necessary because the plugin handles this internally. 

## Export lists to file
Creates a backup file containing your current lists for plugins and themes. The backup is saved as a timestamped JSON file inside the plugins backup folder within your vault configuration directory.

## Import lists from file
Restores lists for plugins and themes from a previously created backup file. You will be prompted to select a backup file from the plugins backup folder. After confirmation imported lists will replaces your current lists with the content of the selected backup.
> [!WARNING] 
> This will overwrite current lists and can't be undone.

# Contribution
Feel free to contribute.

You can create an [issue](https://github.com/4Source/favorites-obsidian-plugin/issues) if you found a bug, have an idea to improve this plugin or ask a question. Please make sure beforehand that your issue does not already exist.

Or instead create a [pull request](https://github.com/4Source/favorites-obsidian-plugin/pulls) to contribute a bug fix or improvement for this plugin.

*Not a developer* but still want to help? You can help with testing. Either you test the current version for possible problems or, if there are currently any, you can also test [pre-releases (alpha/beta)](https://github.com/4Source/favorites-obsidian-plugin/releases). This can be easily accomplished if you install [VARE](https://obsidian.md/plugins?id=vare). Any version of this plugin must be installed. Then simply go to VARE's Settings tab and select the version you want to test from the drop-down menu. You could also add this plugin manually just ![plus](https://github.com/4Source/settings-profiles-obsidian-plugin/assets/38220764/663a0bd6-53f9-4da3-b0ab-33e30eae3029)``Add unlisted plugin`` and enter ``4Source`` and ``favorites-obsidian-plugin``. If you found a bug or unexpected behavior create an [issue](https://github.com/4Source/favorites-obsidian-plugin/issues) with the version you have tested. Before creating an issue, make sure you know how to reproduce the bug. If there is already an issue for the bug you found that is still open but you have additional information, add it to the issue.

For more info see [CONTRIBUTING](https://github.com/4Source/favorites-obsidian-plugin/blob/master/.github/CONTRIBUTING.md)

# Support
If you want to support me and my work.

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/4Source)
