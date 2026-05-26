export const easterEggState = $state({
	konamiFound: false,
	matrixFound: false
});

export const TOTAL_EGGS = 2;

export function foundCount() {
	return [easterEggState.konamiFound, easterEggState.matrixFound].filter(Boolean).length;
}
