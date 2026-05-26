<script lang="ts">
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import { MousePointer2 } from '@lucide/svelte';

	type RemoteCursor = { x: number; y: number; color: string; name: string };
	let cursors = $state<Record<string, RemoteCursor>>({});
	let myName = $state('');
	let myColor = $state('');

	onMount(() => {
		const socket = io();
		let lastEmit = 0;

		function onPointermove(e: PointerEvent) {
			const now = Date.now();
			if (now - lastEmit < 33) return;
			lastEmit = now;
			socket.emit('cursor', {
				x: e.clientX / window.innerWidth,
				y: e.clientY / window.innerHeight
			});
		}

		window.addEventListener('pointermove', onPointermove);

		socket.on('welcome', ({ name, color }: { name: string; color: string }) => {
			myName = name;
			myColor = color;
		});

		socket.on('cursor', ({ id, x, y, color, name }: RemoteCursor & { id: string }) => {
			cursors[id] = { x, y, color, name };
		});

		socket.on('cursor:leave', ({ id }: { id: string }) => {
			delete cursors[id];
		});

		return () => {
			window.removeEventListener('pointermove', onPointermove);
			socket.disconnect();
		};
	});
</script>

{#each Object.entries(cursors) as [, cursor]}
	<div
		class="pointer-events-none fixed z-9999 transition-[left,top] duration-75 ease-linear"
		style="left: {cursor.x * 100}vw; top: {cursor.y * 100}vh;"
	>
		<MousePointer2
			class="h-5 w-5 drop-shadow-md"
			style="color: {cursor.color};"
			fill={cursor.color}
		/>
		<span
			class="absolute top-3 left-4 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-white"
			style="background: {cursor.color}; opacity: 0.9; box-shadow: 0 1px 4px rgba(0,0,0,0.4); text-shadow: 0 1px 3px rgba(0,0,0,0.5);"
		>
			{cursor.name}
		</span>
	</div>
{/each}

{#if myName}
	{@const onlineCount = Object.keys(cursors).length + 1}
	<div
		class="fixed top-10 left-1/2 z-9998 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm"
	>
		<span class="h-2 w-2 rounded-full" style="background: {myColor};"></span>
		<span class="text-xs text-white/70"
			>You are <span class="font-medium text-white">{myName}</span></span
		>
		<span class="h-3 w-px bg-white/20"></span>
		<span class="flex items-center gap-1 text-xs text-white/70">
			<span class="relative flex h-1.5 w-1.5">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
				<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400"></span>
			</span>
			{onlineCount} online
		</span>
	</div>
{/if}
