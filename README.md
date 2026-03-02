***Favorites*** lets you manage a global favorites list for both plugins and themes in Obsidian - and keeps it consistent across all your vaults.

Stop re-searching the same plugins or themes in every vault. With one central list, your essential tools and styles are always easy to find. 

# Features
- **Global Favorites for Plugins & Themes** - Mark your go to plugins and themes once and use them in all vaults
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
<img width="1104" height="1004" alt="image" src="https://github.com/user-attachments/assets/61b41e7b-4569-4509-95f3-d5e8a667d653" />

<img width="1100" height="1000" alt="image" src="https://github.com/user-attachments/assets/a0b35f98-b194-433f-bd9e-66eecb5dd111" />

<img width="1104" height="1004" alt="image" src="https://github.com/user-attachments/assets/960eac0d-fea2-48e1-8faf-e54a7504149e" />

# Commands
If you prefer managing your favorites list with commands here are the available commands
- [Add plugin to favorite list](#add-plugin-to-favorite-list) 
- [Add theme to favorite list](#add-theme-to-favorite-list) 
- [Remove plugin from favorite list](#remove-plugin-from-favorite-list) 
- [Remove theme from favorite list](#remove-theme-from-favorite-list) 
- [Clear the plugin favorites lists](#clear-the-plugin-favorites-lists) 
- [Clear the theme favorites lists](#clear-the-theme-favorites-lists) 
- [Manually load the favorites lists](#manually-load-the-favorites-lists) 
- [Manually save the favorites lists](#manually-save-the-favorites-lists) 
- [Export favorite lists to file](#export-favorite-lists-to-file) 
- [Import favorite lists from file](#import-favorite-lists-from-file) 

## Add plugin to favorite list
Search and select a community plugin to add it to your favorites list. The list is fetched from the community plugin registry.

## Add theme to favorite list
Search and select a community theme to add it to your favorites list. The list is fetched from the community theme registry.

## Remove plugin from favorite list
Search and select from your current favorite plugins to remove it from your favorites list.

## Remove theme from favorite list
Search and select from your current favorite themes to remove it from your favorites list.

## Clear the plugin favorites lists
Permanently removes ***all*** plugins from your favorites list after confirmation. 
> [!WARNING]
> This action cannot be undone.

## Clear the theme favorites lists
Permanently removes ***all*** themes from your favorites list after confirmation.
> [!WARNING]
> This action cannot be undone.

## Manually load the favorites lists
Reloads the saved favorite plugins and themes. Use this to restore your favorites if they were changed externally or need to be refreshed.
> [!NOTE]
> This is normally not necessary because the plugin handles this internally.

## Manually save the favorites lists
Forces the plugin to immediately save your current favorite plugins and themes. Use this if you want to ensure your favorites are persistent.
> [!WARNING] 
> This could overwrite changes from another running Obsidian instance if the changes from there are not loaded beforehand.

> [!NOTE]
> This is normally not necessary because the plugin handles this internally. 

## Export favorite lists to file
Creates a backup file containing your current favorite plugins and themes. The backup is saved as a timestamped JSON file inside the plugin’s backup folder within your vault configuration directory.

## Import favorite lists from file
Restores favorite plugins and themes from a previously created backup file. You will be prompted to select a backup file from the plugin’s backup folder. After confirmation imported favorites will replaces your current favorites with the contents of the selected backup.
> [!WARNING] 
> This will overwrite current favorite lists and can't be undone.

# Contribution
Feel free to contribute.

You can create an [issue](https://github.com/4Source/favorites-obsidian-plugin/issues) if you found a bug, have an idea to improve this plugin or ask a question. Please make sure beforehand that your issue does not already exist.

Or instead create a [pull request](https://github.com/4Source/favorites-obsidian-plugin/pulls) to contribute a bug fix or improvement for this plugin.

*Not a developer* but still want to help? You can help with testing. Either you test the current version for possible problems or, if there are currently any, you can also test [pre-releases (alpha/beta)](https://github.com/4Source/favorites-obsidian-plugin/releases). This can be easily accomplished if you install [VARE](https://obsidian.md/plugins?id=vare). Any version of this plugin must be installed. Then simply go to VARE's Settings tab and select the version you want to test from the drop-down menu. You could also add this plugin manually just ![plus](https://github.com/4Source/settings-profiles-obsidian-plugin/assets/38220764/663a0bd6-53f9-4da3-b0ab-33e30eae3029)``Add unlisted plugin`` and enter ``4Source`` and ``favorites-obsidian-plugin``. If you found a bug or unexpected behavior create an [issue](https://github.com/4Source/favorites-obsidian-plugin/issues) with the version you have tested. Before creating an issue, make sure you know how to reproduce the bug. If there is already an issue for the bug you found that is still open but you have additional information, add it to the issue.

For more info see [CONTRIBUTING](https://github.com/4Source/favorites-obsidian-plugin/blob/master/.github/CONTRIBUTING.md)

# Support
If you want to support me and my work.

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-violet.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/4Source)
