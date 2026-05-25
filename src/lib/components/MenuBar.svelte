<script lang="ts">
	import { onMount } from 'svelte';
	import { Power, RotateCcw } from '@lucide/svelte';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { Info } from '@lucide/svelte';
	import { windowsState } from '$lib/stores/windows.svelte';

	let timeString = $state('');
	let dateString = $state('');

	function updateClock() {
		const now = new Date();
		timeString = now.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
		dateString = now.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	onMount(() => {
		updateClock();
		const interval = setInterval(updateClock, 1000);
		return () => clearInterval(interval);
	});

	const menuItems = ['Finder', 'File', 'View', 'Go'];

	function handleShutdown() {
		window.close();
	}

	function handleRestart() {
		location.reload();
	}
</script>

<div
	class="fixed top-0 right-0 left-0 z-50 flex h-7 items-center justify-between px-4"
	style="background: rgba(0,0,0,0.35); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.08);"
>
	<!-- Left side -->
	<div class="flex items-center gap-4">
		<DropdownMenu>
			<DropdownMenuTrigger
				class="cursor-default text-sm font-extrabold tracking-tight text-white/95 select-none rounded px-1 hover:bg-white/10 transition-colors"
			>
				PZ
			</DropdownMenuTrigger>
			<DropdownMenuContent
				class="min-w-45 border border-white/10 bg-black/75 backdrop-blur-xl text-white/85"
				align="start"
				sideOffset={4}
			>
				<DropdownMenuItem class="text-xs" onclick={() => (windowsState.systemOpen = true)}>
					<Info class="h-3.5 w-3.5" />
					System
				</DropdownMenuItem>
				<DropdownMenuSeparator class="bg-white/10" />
				<DropdownMenuItem class="text-xs" onclick={handleRestart}>
					<RotateCcw class="h-3.5 w-3.5" />
					Restart
				</DropdownMenuItem>
				<DropdownMenuSeparator class="bg-white/10" />
				<DropdownMenuItem class="text-xs text-red-400 focus:bg-red-500/15 focus:text-red-400" onclick={handleShutdown}>
					<Power class="h-3.5 w-3.5" />
					Turn Off
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
		<div class="h-3.5 w-px bg-white/20"></div>
		{#each menuItems as item}
			<span
				class="cursor-default text-xs font-medium text-white/70 transition-colors select-none hover:text-white/95"
			>
				{item}
			</span>
		{/each}
	</div>

	<!-- Right side -->
	<div class="flex items-center gap-3">
		<!-- <Wifi class="h-3.5 w-3.5 text-white/70" />
		<Battery class="h-3.5 w-3.5 text-white/70" /> -->
		<span class="text-xs text-white/60">{dateString}</span>
		<span class="text-xs font-medium text-white/90" style="font-family: var(--font-mono);"
			>{timeString}</span
		>
	</div>
</div>
