<script lang="ts">
	type ColorKey = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

	const COLORS: Record<ColorKey, { header: string; body: string; text: string; swatch: string }> = {
		yellow: { header: '#FDE68A', body: '#FFFBEB', text: '#78350F', swatch: '#F59E0B' },
		blue:   { header: '#BFDBFE', body: '#EFF6FF', text: '#1E3A5F', swatch: '#3B82F6' },
		green:  { header: '#BBF7D0', body: '#F0FDF4', text: '#14532D', swatch: '#22C55E' },
		pink:   { header: '#FBCFE8', body: '#FDF2F8', text: '#831843', swatch: '#EC4899' },
		purple: { header: '#DDD6FE', body: '#F5F3FF', text: '#3B0764', swatch: '#8B5CF6' }
	};

	const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];

	let {
		x = $bindable(200),
		y = $bindable(160),
		color = $bindable<ColorKey>('yellow'),
		content = $bindable(''),
		showSwatches = true,
		onclose
	}: {
		x?: number;
		y?: number;
		color?: ColorKey;
		content?: string;
		showSwatches?: boolean;
		onclose?: () => void;
	} = $props();

	let drag: { startX: number; startY: number; originX: number; originY: number } | null = $state(null);

	function startDrag(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement;
		el.setPointerCapture(e.pointerId);
		drag = { startX: e.clientX, startY: e.clientY, originX: x, originY: y };
		e.preventDefault();
	}

	function onDragMove(e: PointerEvent) {
		if (!drag) return;
		x = drag.originX + (e.clientX - drag.startX);
		y = drag.originY + (e.clientY - drag.startY);
	}

	function stopDrag() {
		drag = null;
	}

	const palette = $derived(COLORS[color] ?? COLORS.yellow);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="sticky-note"
	style="left:{x}px; top:{y}px; --header:{palette.header}; --body:{palette.body}; --text:{palette.text};"
	onpointermove={onDragMove}
	onpointerup={stopDrag}
>
	<!-- Header / drag handle -->
	<div class="note-header" onpointerdown={startDrag}>
		<!-- Color swatches -->
		{#if showSwatches}
			<div class="swatches">
				{#each COLOR_KEYS as key}
					<button
						class="swatch"
						style="background:{COLORS[key].swatch}; outline: {color === key ? '2px solid rgba(0,0,0,0.4)' : 'none'}; outline-offset: 1px;"
						aria-label="Color {key}"
						onclick={() => (color = key)}
						onpointerdown={(e) => e.stopPropagation()}
					></button>
				{/each}
			</div>
		{/if}
		<!-- Close -->
		<button
			class="close-btn"
			aria-label="Close"
			onclick={onclose}
			onpointerdown={(e) => e.stopPropagation()}
		>×</button>
	</div>

	<!-- Body -->
	<textarea
		class="note-body"
		bind:value={content}
		placeholder="Type here…"
		spellcheck="false"
	></textarea>
</div>

<style>
	.sticky-note {
		position: absolute;
		width: 220px;
		height: 200px;
		display: flex;
		flex-direction: column;
		border-radius: 6px;
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.25),
			0 1px 3px rgba(0, 0, 0, 0.15);
		z-index: 30;
		overflow: hidden;
		background: var(--body);
	}

	.note-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px 8px;
		background: var(--header);
		cursor: grab;
		user-select: none;
		flex-shrink: 0;
	}

	.note-header:active {
		cursor: grabbing;
	}

	.swatches {
		display: flex;
		gap: 5px;
		align-items: center;
	}

	.swatch {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		padding: 0;
		cursor: pointer;
		flex-shrink: 0;
		transition: transform 100ms ease;
	}

	.swatch:hover {
		transform: scale(1.25);
	}

	.close-btn {
		background: none;
		border: none;
		padding: 0 2px;
		font-size: 16px;
		line-height: 1;
		color: var(--text);
		opacity: 0.5;
		cursor: pointer;
		transition: opacity 100ms ease;
	}

	.close-btn:hover {
		opacity: 1;
	}

	.note-body {
		flex: 1 1 0;
		resize: none;
		border: none;
		outline: none;
		padding: 10px;
		background: var(--body);
		color: var(--text);
		font-size: 0.8125rem;
		line-height: 1.5;
		font-family: inherit;
	}

	.note-body::placeholder {
		color: var(--text);
		opacity: 0.35;
	}
</style>
