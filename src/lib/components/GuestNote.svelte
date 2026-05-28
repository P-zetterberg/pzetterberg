<script lang="ts">
	import { convexClient } from '$lib/stores/convex.svelte';
	import { api } from '$convex/_generated/api';
	import StickyNote from './StickyNote.svelte';
	import type { Id } from '$convex/_generated/dataModel';

	type ColorKey = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

	let {
		id,
		x: sx,
		y: sy,
		color: sc,
		content: scon,
		onclose
	}: {
		id: Id<'guestbookNotes'>;
		x: number;
		y: number;
		color: ColorKey;
		content: string;
		onclose: () => void;
	} = $props();

	// Optimistic local state — updates instantly, server confirms async
	let x = $state(sx);
	let y = $state(sy);
	let color = $state<ColorKey>(sc);
	let content = $state(scon);

	// Merge incoming server state (other visitors' changes)
	$effect(() => {
		x = sx;
	});
	$effect(() => {
		y = sy;
	});
	$effect(() => {
		color = sc;
	});
	$effect(() => {
		content = scon;
	});

	// Debounced position sync — 150ms avoids per-pixel writes during drag
	let posTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		const cx = x,
			cy = y;
		clearTimeout(posTimer);
		posTimer = setTimeout(
			() => convexClient.mutation(api.notes.updatePosition, { id, x: cx, y: cy }),
			150
		);
		return () => clearTimeout(posTimer);
	});

	// Debounced content sync — 400ms for typing
	let contentTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		const c = content;
		clearTimeout(contentTimer);
		contentTimer = setTimeout(
			() => convexClient.mutation(api.notes.updateContent, { id, content: c }),
			400
		);
		return () => clearTimeout(contentTimer);
	});
</script>

<StickyNote bind:x bind:y bind:color bind:content showSwatches={false} {onclose} />
