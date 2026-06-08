export interface DownKitPage {
	title?: string;
	description?: string;
	frontmatter?: Record<string, string>;
}

export const downkit_page = $state<{ current: DownKitPage }>({ current: {} });
