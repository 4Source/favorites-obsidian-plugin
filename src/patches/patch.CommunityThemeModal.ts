import { CommunityItem, CommunityThemeModal } from 'obsidian';
import MyPlugin from '../main';
import { around, dedupe } from 'monkey-around';
import { PLUGIN_ID } from 'src/constants';
import InstalledFlair from 'src/ui-components/InstalledFlair';
import FavoriteFlair from 'src/ui-components/FavoriteFlair';
import InUseFlair from 'src/ui-components/InUseFlair';
import KnownFlair from 'src/ui-components/KnownFlair';
import ActiveFlair from 'src/ui-components/ActiveFlair';

const MONKEY_KEY = `${PLUGIN_ID}-ThemePluginModal-`;

export default (context: CommunityThemeModal, plugin: MyPlugin) => around(context.constructor.prototype, {
	showItem(oldMethod) {
		return dedupe(`${MONKEY_KEY}showItem`, oldMethod, async function (item: CommunityItem) {
			// console.debug('Call CommunityThemeModal.showItem');

			const result = oldMethod && await oldMethod.apply(this, [item]);

			const infoEl = await this.detailsEl.getElementsByClassName('community-modal-info')[0];
			const infoNameEl = await infoEl?.getElementsByClassName('community-modal-info-name')[0];

			// Add aria label to installed flair
			new InstalledFlair(infoNameEl);

			// Ignore the default theme
			if (this.selectedItemId === '') {
				return result;
			}
			const buttonContainerEl = await infoEl?.getElementsByClassName('community-modal-button-container')[0];

			// Load the theme lists
			plugin.loadFavoriteThemes();
			plugin.loadInUseThemes();
			plugin.loadKnownThemes();

			// Add to the favorite themes a flair to visualize it for the user
			const isFavorite = plugin.favoriteThemes.contains(this.selectedItemId);
			if (isFavorite) {
				new FavoriteFlair(infoNameEl);
			}

			// Add to the in use themes a flair to visualize it for the user
			if (Object.keys(plugin.inUseThemes).contains(this.selectedItemId)) {
				new InUseFlair(infoNameEl);
			}

			// Add to the known themes a flair to visualize it for the user
			if (plugin.knownThemes.contains(this.selectedItemId)) {
				new KnownFlair(infoNameEl);
			}

			plugin.registerDomEvent(buttonContainerEl?.createEl('button', { text: isFavorite ? 'Unfavorite' : 'Favorite' }), 'click', async () => {
				if (isFavorite) {
					plugin.favoriteThemes.remove(this.selectedItemId);
				}
				else {
					plugin.favoriteThemes.push(this.selectedItemId);
				}

				plugin.saveFavoriteThemes();

				// Redraw
				infoEl.detach();
				await this.showItem(this.items[this.selectedItemId]);
				this.update();
			});

			return result;
		});
	},
	updateItems(oldMethod) {
		return dedupe(`${MONKEY_KEY}updateItems`, oldMethod, function () {
			// console.debug('Call CommunityThemeModal.updateItems');

			// Load the theme lists
			plugin.loadFavoriteThemes();
			plugin.loadInUseThemes();
			plugin.loadKnownThemes();

			const result = oldMethod && oldMethod.apply(this);

			// Add aria label to installed flair
			Object.keys(plugin.app.customCss.themes).forEach(id => {
				new InstalledFlair(this.items[id]?.nameEl);
			});

			// Add aria label to active flair
			new ActiveFlair(this.items[plugin.app.customCss.theme]?.nameEl);

			// Ignore the default theme
			if (this.selectedItemId === '') {
				return result;
			}

			// Add to the favorite themes a flair to visualize it for the user
			plugin.favoriteThemes.forEach(id => {
				new FavoriteFlair(this.items[id]?.nameEl);
			});

			// Add to the in use themes a flair to visualize it for the user
			Object.keys(plugin.inUseThemes).forEach(id => {
				new InUseFlair(this.items[id]?.nameEl);
			});

			// Add to the known themes a flair to visualize it for the user
			plugin.knownThemes.forEach(id => {
				new KnownFlair(this.items[id]?.nameEl);
			});

			return result;
		});
	},
});