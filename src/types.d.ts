import { } from 'obsidian';

declare module 'obsidian' {
	interface App {
		setting: SettingsModal;
		plugins: {
			manifests: Record<string, PluginManifest>;
		};
		customCss: {
			themes: Record<string, ThemeManifest>;
		}
	}

	interface ThemeManifest {
		author: string;
		authorUrl: string;
		dir: string;
		minAppVersion: string;
		name: string;
		version: string;
	}

	interface CommunityItem {
		id: string;
	}

	interface CommunityModal extends Modal {
		sortOrder: string;
		items: unknown;
		itemsVisible: unknown;
		selectedItemId: string | null;
		dimBackground: unknown;
		onCloseCallback: () => void;
		update(): void;
		returnToGridView(): void;
		selectItem(id: string | null): unknown;
		showSortMenu(event: unknown): void;
		sortItems(items: unknown): unknown;
		scrollIntoView(): unknown;
		addCustomControls(): unknown;
		updateItems(): CommunityItem[];
		showItem(item: CommunityItem): Promise<void>;
	}

	interface CommunityThemeModal extends CommunityModal {

	}

	interface CommunityPluginModal extends CommunityModal {
		setAutoOpen(id: string): CommunityPluginModal;
		loadItems(): unknown;
	}

	interface SettingsModal extends Modal {
		openTab(settingTab: SettingTab): void;
	}

	interface SettingTab {

		/**
		 * Used to identify the tab
		 *
		 * @private reverse engineered
		 */
		id: string;
		setting: unknown;
		navEl: HTMLElement;
	}

	interface CommunityPluginsSettingTab extends SettingTab {
		id: 'community-plugins';
		installedPlugins: {
			listEl: HTMLElement
		};

		render(e: boolean): void;
		renderInstalledPlugin(plugin: CommunityItem, containerEl: HTMLElement, n: unknown, i: unknown, r: unknown): void;
		updateSearch(e: unknown): void
	}

	interface HotkeysSettingTab extends SettingTab {
		name: string;
		id: 'hotkeys';
		setHotkeyScope: unknown;
		commandBeingCustomized: unknown;
		filterHotkeyScope: unknown;
		filterHotkeyEl: unknown;
		filterHotkeyActiveEl: unknown;
		hotkeyListContainerEl: unknown;
		hotkeyFilter: unknown;
	}
}