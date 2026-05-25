<script lang="ts">
	import { Folder, FileText, Image, Music } from '@lucide/svelte';
	import Window from '$lib/components/Window.svelte';
	import MusicPlayer from '$lib/components/MusicPlayer.svelte';
	import SystemInfo from '$lib/components/SystemInfo.svelte';
	import { windowsState } from '$lib/stores/windows.svelte';

	let windowOpen = $state(true);
	let musicOpen = $state(false);

	type IconType = typeof Folder;
	type Item = { id: number; label: string; icon: IconType; x: number; y: number };

	let items = $state<Item[]>([
		{ id: 1, label: 'Documents', icon: Folder, x: 40, y: 40 },
		{ id: 2, label: 'Projects', icon: Folder, x: 140, y: 40 },
		{ id: 3, label: 'Notes.txt', icon: FileText, x: 40, y: 160 },
		{ id: 4, label: 'Photo.png', icon: Image, x: 140, y: 160 },
		{ id: 5, label: 'Music', icon: Music, x: 240, y: 40 }
	]);

	let dragging: { id: number; offsetX: number; offsetY: number } | null = $state(null);
	let selected: number | null = $state(null);
	let container: HTMLDivElement;

	const iconConfigMap = new Map([
		[Folder, { gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', filled: true }],
		[FileText, { gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', filled: false }],
		[Image, { gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)', filled: false }],
		[Music, { gradient: 'linear-gradient(135deg, #EC4899, #BE185D)', filled: false }]
	]);

	const fallbackConfig = { gradient: 'linear-gradient(135deg, #6B7280, #4B5563)', filled: false };

	function onpointerdown(e: PointerEvent, item: Item) {
		const el = e.currentTarget as HTMLElement;
		el.setPointerCapture(e.pointerId);
		const rect = el.getBoundingClientRect();
		dragging = { id: item.id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
		selected = item.id;
		e.preventDefault();
	}

	function onpointermove(e: PointerEvent) {
		if (!dragging) return;
		const containerRect = container.getBoundingClientRect();
		const item = items.find((i) => i.id === dragging!.id)!;
		item.x = e.clientX - containerRect.left - dragging.offsetX;
		item.y = e.clientY - containerRect.top - dragging.offsetY;
	}

	function onpointerup() {
		dragging = null;
	}

	function oncanvasdown(e: PointerEvent) {
		if (e.target === container) selected = null;
	}
</script>

<svelte:head>
	<title>P Zetterberg</title>
</svelte:head>

<div
	bind:this={container}
	role="application"
	aria-label="Desktop"
	class="relative h-full overflow-hidden"
	{onpointermove}
	{onpointerup}
	onpointerdown={oncanvasdown}
>
	{#if windowOpen}
		<Window title="Example Window" x={300} y={80} width={420} height={300} onclose={() => (windowOpen = false)}>
			<p class="text-sm text-white/70 leading-relaxed">
				This is a reusable window component. It's draggable, resizable, closeable, and this content area scrolls.
			</p>
			<p class="mt-3 text-sm text-white/50 leading-relaxed">
				Drag the title bar to move it. Grab any edge or corner to resize. Click the red dot to close.
			</p>
		</Window>
	{/if}

	{#if musicOpen}
		<Window title="Music" x={120} y={60} width={320} height={420} onclose={() => (musicOpen = false)}>
			<MusicPlayer />
		</Window>
	{/if}

	{#if windowsState.systemOpen}
		<Window title="System" x={200} y={80} width={420} height={480} onclose={() => (windowsState.systemOpen = false)}>
			<SystemInfo />
		</Window>
	{/if}

	{#each items as item (item.id)}
		{@const Icon = item.icon}
		{@const config = iconConfigMap.get(item.icon) ?? fallbackConfig}
		{@const isDragging = dragging?.id === item.id}
		{@const isSelected = selected === item.id && !isDragging}
		<div
			role="button"
			tabindex="0"
			aria-label={item.label}
			class="absolute flex w-20 cursor-grab flex-col items-center gap-2 rounded-xl p-1 select-none"
			style="left: {item.x}px; top: {item.y}px;
				transform: scale({isDragging ? 1.1 : 1});
				transition: transform 150ms ease, filter 150ms ease;
				filter: {isDragging
				? 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))'
				: isSelected
					? 'drop-shadow(0 0 8px rgba(255,255,255,0.4))'
					: 'none'};
				z-index: {isDragging ? 10 : 1};"
			onpointerdown={(e) => onpointerdown(e, item)}
			ondblclick={() => { if (item.id === 5) musicOpen = true; }}
		>
			<!-- App tile -->
			<div
				class="flex h-18 w-18 items-center justify-center rounded-2xl"
				style="background: {config.gradient};
					box-shadow: {isSelected
					? '0 4px 16px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.5)'
					: '0 4px 16px rgba(0,0,0,0.3)'};"
			>
				<Icon
					class="h-9 w-9 text-white"
					fill={config.filled ? 'currentColor' : 'none'}
					strokeWidth={1.5}
				/>
			</div>
			<!-- Label -->
			<span
				class="w-full text-center text-xs leading-tight font-medium text-white"
				style="text-shadow: 0 1px 3px rgba(0,0,0,0.8);"
			>
				{item.label}
			</span>
		</div>
	{/each}
</div>
