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
		app: App;
		styleEl: HTMLStyleElement;
		extraStyleEls: HTMLStyleElement[];
		boundRaw: () => unknown;
		oldThemes: unknown[];

		/**
		 * Holds the manifest of the installed themes in this vault
		 *
		 * @private reverse engineered
		 */
		themes: Record<string, ThemeManifest>;
		updates: Record<string, { themeInfo: unknown, version: string }>;
		snippets: string[];
		enabledSnippets: Set<string>;
		csscache: Map<number, unknown>;

		/**
		 * Holds the id of the enabled theme
		 *
		 * @private reverse engineered
		 */
		theme: string;
		requestLoadTheme: () => unknown;
		requestLoadSnippets: () => unknown;
		requestReadThemes: () => unknown;
		queue: unknown;

		onload(): Promise<unknown>;
		loadData(): void;
		readThemes(e: unknown): unknown;
		readSnippets(e: unknown): unknown;
		onRaw(e: unknown): void;
		loadTheme(e: undefined): unknown;
		loadSnippets(): unknown;
		loadCss(path: string): Promise<unknown>;
		setCssEnabledStatus(e: unknown, t: unknown): void;
		setTheme(name: string): void;
		setTranslucency(e: unknown): void;
		enableTranslucency(): void;
		disableTranslucency(): void;
		getThemeFolder(): string;
		getSnippetsFolder(): string;
		getThemePath(e: unknown): string;
		getSnippetPath(e: unknown): string;
		removeTheme(e: unknown): Promise<unknown>;
		downloadLegacyTheme(e: unknown): Promise<unknown>;
		isThemeInstalled(e: unknown): unknown;
		hasUpdates(): unknown;
		checkForUpdate(e: unknown): Promise<unknown>;
		checkForUpdates(): Promise<unknown>;
		installLegacyTheme(e: unknown): Promise<unknown>;
		installTheme(manifest: ThemeManifest, version: string): Promise<unknown>;
		getManifest(e: unknown): Promise<unknown>;
	}

	interface PluginManager {

		/**
		 * Holds the manifest of the installed plugins in this vault
		 *
		 * @private reverse engineered
		 */
		manifests: Record<string, PluginManifest>;

		/**
		 * Holds references to the loaded plugins identified by there id
		 *
		 * @private reverse engineered
		 */
		plugins: Record<string, Plugin>;

		/**
		 * Holds a the ids of the enabled plugins in this vault
		 *
		 * @private reverse engineered
		 */
		enabledPlugins: Set<string>;

		/**
		 * Holds the available updates identified by there id with information about the update
		 *
		 * @private reverse engineered
		 */
		updates: Record<string, { repo: string, version: string, manifest: PluginManifest }>;
		requestSaveConfig: () => unknown;
		app: App;

		onRaw(e: unknown): void;
		loadManifests(): Promise<unknown>;
		loadManifest(path: string): Promise<unknown>;
		loadPlugin(id: string): Promise<unknown>;
		unloadPlugin(id: string): Promise<unknown>;
		initialize(): Promise<unknown>;
		getPluginFolder(): string;
		enablePlugin(id: string): Promise<unknown>;
		disablePlugin(id: string): Promise<unknown>;
		enablePluginAndSave(id: string): Promise<unknown>;
		disablePluginAndSave(id: string): Promise<unknown>;
		uninstallPlugin(id: string): Promise<unknown>;
		getPlugin(id: string): unknown | null;
		saveConfig(): Promise<unknown>;
		isEnabled(): boolean;
		setEnable(e: unknown): Promise<unknown>;
		checkForDeprecations(): Promise<unknown>;
		isDeprecated(e: unknown): unknown;
		installPlugin(repo: string, version: string, manifest: PluginManifest): Promise<unknown>;
		checkForUpdates(): Promise<unknown>;
	}
}