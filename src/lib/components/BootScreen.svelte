<script lang="ts">
	import { onMount } from 'svelte';
	import { bootState } from '$lib/stores/boot.svelte';

	// Stages:
	// 0 - black, nothing visible
	// 1 - logo fading in
	// 2 - progress bar filling
	// 3 - hold at 100%
	// 4 - fading out
	// 5 - done (unmounted)

	let stage = $state(0);
	let mounted = $state(true);

	onMount(() => {
		// Skip animation if already booted in this session
		if (sessionStorage.getItem('booted')) {
			bootState.complete = true;
			mounted = false;
			return;
		}

		// Stage 0 → 1: show logo after brief black pause
		const t1 = setTimeout(() => (stage = 1), 300);

		// Stage 1 → 2: start progress bar
		const t2 = setTimeout(() => (stage = 2), 1100);

		// Stage 2 → 3: hold at 100%
		const t3 = setTimeout(() => (stage = 3), 2700);

		// Stage 3 → 4: fade out
		const t4 = setTimeout(() => (stage = 4), 3100);

		// Stage 4 → 5: mark complete and remove from DOM
		const t5 = setTimeout(() => {
			sessionStorage.setItem('booted', '1');
			bootState.complete = true;
			mounted = false;
		}, 3950);

		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			clearTimeout(t4);
			clearTimeout(t5);
		};
	});

	const logoVisible = $derived(stage >= 1 && stage <= 4);
	const barVisible = $derived(stage >= 2 && stage <= 4);
	const screenOpacity = $derived(stage === 4 ? 0 : 1);
</script>

{#if mounted}
	<div
		class="fixed inset-0 z-9999 flex items-center justify-center bg-black"
		style="opacity: {screenOpacity}; transition: opacity {stage === 4 ? '0.85s' : '0s'} ease;"
		aria-hidden="true"
	>
		<div class="flex flex-col items-center gap-12">
			<!-- Logo -->
			<div
				class="select-none text-8xl font-extrabold tracking-tighter text-white"
				style="
					opacity: {logoVisible ? 1 : 0};
					transform: scale({logoVisible ? 1 : 0.88});
					transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.2, 0.64, 1);
				"
			>
				PZ
			</div>

			<!-- Progress bar -->
			<div class="h-0.75 w-45 overflow-hidden rounded-full bg-white/15">
				<div
					class="h-full rounded-full bg-white/85"
					style="
						width: {barVisible ? '100%' : '0%'};
						transition: width {stage === 2 ? '1.5s ease-out' : '0s'};
					"
				></div>
			</div>
		</div>
	</div>
{/if}
