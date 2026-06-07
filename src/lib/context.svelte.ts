export interface DoltePageContext {
	title?: string;
	description?: string;
	frontmatter?: Record<string, string>;
}

export const dolte_page = $state<{ current: DoltePageContext }>({ current: {} });

export function useDoltePage() {
	return {
		get current() {
			return dolte_page.current;
		},
		set current(v) {
			dolte_page.current = v;
		}
	};
}
