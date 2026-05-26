<script lang="ts">
	import type { Component } from 'svelte';
	import { Folder, FileText, Image, Music, Monitor, Mail, TerminalSquare } from '@lucide/svelte';
	import Window from '$lib/components/Window.svelte';
	import MusicPlayer from '$lib/components/MusicPlayer.svelte';
	import SystemInfo from '$lib/components/SystemInfo.svelte';
	import ProjectsBrowser from '$lib/components/ProjectsBrowser.svelte';
	import Notes from '$lib/components/Notes.svelte';
	import MailApp from '$lib/components/Mail.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import MatrixRain from '$lib/components/MatrixRain.svelte';
	import { windowsState } from '$lib/stores/windows.svelte';
	import { easterEggState } from '$lib/stores/easterEggs.svelte';
	import { Confetti } from 'svelte-confetti';
	import {
		ContextMenu,
		ContextMenuContent,
		ContextMenuItem,
		ContextMenuLabel,
		ContextMenuSeparator,
		ContextMenuTrigger
	} from '$lib/components/ui/context-menu/index.js';

	type WindowKey = keyof typeof windowsState;
	type WindowConfig = { key: WindowKey; title: string; x: number; y: number; width: number; height: number; component: Component };

	const windows: WindowConfig[] = [
		{ key: 'musicOpen',    title: 'Music',    x: 120, y: 60,  width: 320, height: 420, component: MusicPlayer },
		{ key: 'systemOpen',   title: 'System',   x: 200, y: 80,  width: 420, height: 480, component: SystemInfo },
		{ key: 'projectsOpen', title: 'Projects', x: 160, y: 60,  width: 560, height: 520, component: ProjectsBrowser },
		{ key: 'notesOpen',    title: 'Notes.txt', x: 240, y: 100, width: 360, height: 320, component: Notes },
		{ key: 'mailOpen',     title: 'Mail',      x: 180, y: 90,  width: 420, height: 460, component: MailApp },
		{ key: 'terminalOpen', title: 'Terminal',  x: 300, y: 120, width: 520, height: 380, component: Terminal }
	];

	const KONAMI = [
		'ArrowUp',
		'ArrowUp',
		'ArrowDown',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowLeft',
		'ArrowRight',
		'b',
		'a'
	];
	let konamiProgress = 0;
	let showConfetti = $state(false);
	let showMatrix = $state(false);
	let matrixBuffer = '';

	function onkeydown(e: KeyboardEvent) {
		// Konami code
		if (e.key === KONAMI[konamiProgress]) {
			konamiProgress++;
			if (konamiProgress === KONAMI.length) {
				konamiProgress = 0;
				showConfetti = true;
				easterEggState.konamiFound = true;
				setTimeout(() => (showConfetti = false), 4000);
			}
		} else {
			konamiProgress = e.key === KONAMI[0] ? 1 : 0;
		}

		// Matrix rain: type "matrix"
		if (e.key.length === 1) {
			matrixBuffer = (matrixBuffer + e.key.toLowerCase()).slice(-6);
			if (matrixBuffer === 'matrix') {
				matrixBuffer = '';
				showMatrix = true;
				setTimeout(() => (showMatrix = false), 9000);
			}
		}
	}

	type IconType = typeof Folder;
	type Item = { id: number; label: string; icon: IconType; x: number; y: number };

	const ICON_START_Y = 40;
	const ICON_SPACING_Y = 120;

	let items = $state<Item[]>(
		[
			{ label: 'Documents', icon: Folder },
			{ label: 'Projects',  icon: Folder },
			{ label: 'Notes.txt', icon: FileText },
			{ label: 'Photo.png', icon: Image },
			{ label: 'Music',     icon: Music },
			{ label: 'System',    icon: Monitor },
			{ label: 'Mail',      icon: Mail },
			{ label: 'Terminal',  icon: TerminalSquare }
		].map((item, i) => ({ ...item, id: i + 1, x: 40, y: ICON_START_Y + i * ICON_SPACING_Y }))
	);

	let dragging: { id: number; offsetX: number; offsetY: number } | null = $state(null);
	let selected: number | null = $state(null);
	let container: HTMLDivElement;

	const iconConfigMap = new Map([
		[Folder,         { gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', filled: true }],
		[FileText,       { gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', filled: false }],
		[Image,          { gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)', filled: false }],
		[Music,          { gradient: 'linear-gradient(135deg, #EC4899, #BE185D)', filled: false }],
		[Monitor,        { gradient: 'linear-gradient(135deg, #10B981, #059669)', filled: false }],
		[Mail,           { gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)', filled: false }],
		[TerminalSquare, { gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)', filled: false }]
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

<svelte:window {onkeydown} />

{#if showConfetti}
	<div
		style="position: fixed; top: -50px; left: 0; height: 100vh; width: 100vw; display: flex; justify-content: center; overflow: hidden; pointer-events: none;"
	>
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[500, 2000]}
			duration={5000}
			amount={500}
			fallDistance="100vh"
		/>
	</div>
{/if}

<MatrixRain active={showMatrix} />

<ContextMenu>
	<ContextMenuTrigger class="block h-full w-full">
		<div
			bind:this={container}
			role="application"
			aria-label="Desktop"
			class="relative h-full overflow-hidden"
			{onpointermove}
			{onpointerup}
			onpointerdown={oncanvasdown}
		>
			{#each windows as w (w.key)}
				{#if windowsState[w.key]}
					{@const Comp = w.component}
					<Window title={w.title} x={w.x} y={w.y} width={w.width} height={w.height} onclose={() => (windowsState[w.key] = false)}>
						<Comp />
					</Window>
				{/if}
			{/each}

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
					ondblclick={() => {
						if (item.id === 5) windowsState.musicOpen = true;
						if (item.id === 2) windowsState.projectsOpen = true;
						if (item.id === 3) windowsState.notesOpen = true;
						if (item.id === 6) windowsState.systemOpen = true;
						if (item.id === 7) windowsState.mailOpen = true;
						if (item.id === 8) windowsState.terminalOpen = true;
					}}
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
	</ContextMenuTrigger>

	<ContextMenuContent class="w-52">
		<ContextMenuLabel class="text-xs opacity-60">Desktop</ContextMenuLabel>
		<ContextMenuSeparator />
		<ContextMenuItem disabled>New Sticky Note</ContextMenuItem>
		<ContextMenuItem disabled>Change Wallpaper</ContextMenuItem>
		<ContextMenuSeparator />
		<ContextMenuItem disabled>About This Portfolio</ContextMenuItem>
		<ContextMenuItem disabled>View Source</ContextMenuItem>
	</ContextMenuContent>
</ContextMenu>
