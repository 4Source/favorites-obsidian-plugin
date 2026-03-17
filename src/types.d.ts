import { } from 'obsidian';

declare module 'obsidian' {
	interface App {
		appId: string;
		setting: SettingsModal;
		plugins: PluginManager;
		customCss: StyleManager;
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

	interface StyleManager extends Component {
		themes: Record<string, ThemeManifest>;

		/*
		 * onload(): Promise<unknown>;
		 * loadData(): void;
		 * readThemes(e): unknown;
		 * readSnippets(e): unknown;
		 * onRaw(e): void;
		 * loadTheme(e: undefined): unknown;
		 * loadSnippets(): unknown;
		 * loadCss(path: string): Promise<unknown>;
		 * setCssEnabledStatus(e, t): void;
		 */
		setTheme(name: string): void;

		/*
		 * setTranslucency(e): void;
		 * enableTranslucency(): void;
		 * disableTranslucency(): void;
		 * getThemeFolder(): string;
		 * getSnippetsFolder(): string;
		 * getThemePath(e): string;
		 * getSnippetPath(e): string;
		 * removeTheme(e): Promise<unknown>;
		 * downloadLegacyTheme(e): Promise<unknown>;
		 * isThemeInstalled(e): unknown;
		 * hasUpdates(): unknown;
		 * checkForUpdate(e): Promise<unknown>;
		 * checkForUpdates(): Promise<unknown>;
		 * installLegacyTheme(e): Promise<unknown>;
		 */
		installTheme(manifest: ThemeManifest, version: string): Promise<unknown>;

		// getManifest(e): Promise<unknown>;
	}

	interface PluginManager {
		manifests: Record<string, PluginManifest>;

		/*
		 * onRaw(e): void;
		 * loadManifests(): Promise<unknown>;
		 * loadManifest(path: string): Promise<unknown>;
		 */
		loadPlugin(id: string): Promise<unknown>;
		unloadPlugin(id: string): Promise<unknown>;

		/*
		 * initialize(): Promise<unknown>;
		 * getPluginFolder(): string;
		 * enablePlugin(id: string): Promise<unknown>;
		 * disablePlugin(id: string): Promise<unknown>;
		 * enablePluginAndSave(id: string): Promise<unknown>;
		 * disablePluginAndSave(id: string): Promise<unknown>;
		 * uninstallPlugin(id: string): Promise<unknown>;
		 * getPlugin(id: string): unknown | null;
		 * saveConfig(): Promise<unknown>;
		 * isEnabled(): boolean;
		 * setEnable(e): Promise<unknown>;
		 * checkForDeprecations(): Promise<unknown>;
		 * isDeprecated(e): unknown;
		 */
		installPlugin(repo: string, version: string, manifest: PluginManifest): Promise<unknown>;

		// checkForUpdates(): Promise<unknown>;
	}
}