/**
 * Credits: https://github.com/TfTHacker/obsidian42-brat
 */

import { request } from 'obsidian';

export interface CommunityEntry {
	name: string;
	author: string;
	repo: string;
}

export interface CommunityPlugin extends CommunityEntry {
	id: string;
	description: string;
}

export interface CommunityTheme extends CommunityEntry {
	screenshot: string;
	modes: string[];
	legacy?: boolean;
}

/**
 * Fetch all community plugin entries.
 * @returns A list of community plugins
 */
export async function fetchCommunityPluginList(): Promise<CommunityPlugin[] | undefined> {
	const URL = 'https://raw.githubusercontent.com/obsidianmd/obsidian-releases/HEAD/community-plugins.json';
	try {
		// Do a request to the url
		const response = await request({ url: URL });

		// Process the response
		return (await JSON.parse(response)) as CommunityPlugin[];
	}
	catch (e) {
		(e as Error).message = 'Failed to fetch community plugin list! ' + (e as Error).message;
		console.error(e);
	}
}

/**
 * Fetch all community theme entries.
 * @returns A list of community themes
 */
export async function fetchCommunityThemeList(): Promise<CommunityTheme[] | undefined> {
	const URL = 'https://raw.githubusercontent.com/obsidianmd/obsidian-releases/refs/heads/master/community-css-themes.json';
	try {
		// Do a request to the url
		const response = await request({ url: URL });

		// Process the response
		return (await JSON.parse(response)) as CommunityTheme[];
	}
	catch (e) {
		(e as Error).message = 'Failed to fetch community plugin list! ' + (e as Error).message;
		console.error(e);
	}
}
