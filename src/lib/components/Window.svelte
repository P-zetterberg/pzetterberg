<script lang="ts">
	import type { Snippet } from 'svelte';

	type ResizeDir = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

	let {
		title = '',
		x = $bindable(100),
		y = $bindable(100),
		width = $bindable(480),
		height = $bindable(320),
		onclose,
		children
	}: {
		title?: string;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		onclose?: () => void;
		children?: Snippet;
	} = $props();

	const MIN_W = 240;
	const MIN_H = 150;

	// Drag state
	let drag: { startX: number; startY: number; originX: number; originY: number } | null =
		$state(null);

	// Resize state
	let resize: {
		dir: ResizeDir;
		startX: number;
		startY: number;
		originX: number;
		originY: number;
		originW: number;
		originH: number;
	} | null = $state(null);

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

	function startResize(e: PointerEvent, dir: ResizeDir) {
		const el = e.currentTarget as HTMLElement;
		el.setPointerCapture(e.pointerId);
		resize = {
			dir,
			startX: e.clientX,
			startY: e.clientY,
			originX: x,
			originY: y,
			originW: width,
			originH: height
		};
		e.preventDefault();
		e.stopPropagation();
	}

	function onResizeMove(e: PointerEvent) {
		if (!resize) return;
		const dx = e.clientX - resize.startX;
		const dy = e.clientY - resize.startY;
		const { dir, originX, originY, originW, originH } = resize;

		let newX = originX;
		let newY = originY;
		let newW = originW;
		let newH = originH;

		if (dir.includes('e')) newW = Math.max(MIN_W, originW + dx);
		if (dir.includes('s')) newH = Math.max(MIN_H, originH + dy);
		if (dir.includes('w')) {
			newW = Math.max(MIN_W, originW - dx);
			newX = originX + originW - newW;
		}
		if (dir.includes('n')) {
			newH = Math.max(MIN_H, originH - dy);
			newY = originY + originH - newH;
		}

		x = newX;
		y = newY;
		width = newW;
		height = newH;
	}

	function stopResize() {
		resize = null;
	}

	const cursorMap: Record<ResizeDir, string> = {
		n: 'ns-resize',
		s: 'ns-resize',
		e: 'ew-resize',
		w: 'ew-resize',
		ne: 'nesw-resize',
		sw: 'nesw-resize',
		nw: 'nwse-resize',
		se: 'nwse-resize'
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="window"
	style="left:{x}px; top:{y}px; width:{width}px; height:{height}px;"
	onpointermove={(e) => {
		onDragMove(e);
		onResizeMove(e);
	}}
	onpointerup={() => {
		stopDrag();
		stopResize();
	}}
>
	<!-- Resize handles -->
	{#each (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as ResizeDir[]) as dir}
		<div
			class="resize-handle resize-{dir}"
			style="cursor:{cursorMap[dir]};"
			onpointerdown={(e) => startResize(e, dir)}
		></div>
	{/each}

	<!-- Title bar -->
	<div class="title-bar" onpointerdown={startDrag}>
		<div class="traffic-lights">
			<button
				class="traffic-light close"
				aria-label="Close"
				onclick={onclose}
				onpointerdown={(e) => e.stopPropagation()}
			></button>
			<button
				class="traffic-light minimize"
				aria-label="Minimize"
				onpointerdown={(e) => e.stopPropagation()}
			></button>
			<button
				class="traffic-light maximize"
				aria-label="Maximize"
				onpointerdown={(e) => e.stopPropagation()}
			></button>
		</div>
		<span class="window-title">{title}</span>
	</div>

	<!-- Scrollable content -->
	<div class="window-content">
		{@render children?.()}
	</div>
</div>

<style>
	.window {
		position: absolute;
		display: flex;
		flex-direction: column;
		background: rgba(18, 18, 18, 0.72);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.55),
			0 0 0 0.5px rgba(255, 255, 255, 0.05) inset;
		overflow: hidden;
		z-index: 20;
	}

	/* ── Title bar ── */
	.title-bar {
		position: relative;
		display: flex;
		align-items: center;
		height: 32px;
		min-height: 32px;
		padding: 0 12px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		cursor: default;
		user-select: none;
		flex-shrink: 0;
	}

	.traffic-lights {
		display: flex;
		align-items: center;
		gap: 6px;
		z-index: 1;
	}

	.traffic-light {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		padding: 0;
		cursor: pointer;
		flex-shrink: 0;
		transition: filter 120ms ease;
	}

	.traffic-light:hover {
		filter: brightness(1.15);
	}

	.close { background: #FF5F57; }
	.minimize { background: #FFBD2E; }
	.maximize { background: #28C840; }

	.window-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.75rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.65);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: calc(100% - 120px);
		pointer-events: none;
	}

	/* ── Content ── */
	.window-content {
		flex: 1 1 0;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 12px;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
	}

	.window-content::-webkit-scrollbar {
		width: 6px;
	}

	.window-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.window-content::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.18);
		border-radius: 3px;
	}

	/* ── Resize handles ── */
	.resize-handle {
		position: absolute;
		z-index: 10;
	}

	.resize-n  { top: -3px;  left: 10px;  right: 10px; height: 6px; }
	.resize-s  { bottom: -3px; left: 10px; right: 10px; height: 6px; }
	.resize-w  { left: -3px; top: 10px;  bottom: 10px; width: 6px; }
	.resize-e  { right: -3px; top: 10px; bottom: 10px; width: 6px; }
	.resize-nw { top: -3px;    left: -3px;   width: 14px; height: 14px; }
	.resize-ne { top: -3px;    right: -3px;  width: 14px; height: 14px; }
	.resize-sw { bottom: -3px; left: -3px;   width: 14px; height: 14px; }
	.resize-se { bottom: -3px; right: -3px;  width: 14px; height: 14px; }
</style>
