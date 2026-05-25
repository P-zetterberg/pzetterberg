<script lang="ts">
	import { onMount } from 'svelte';
	import { Wifi, Battery } from '@lucide/svelte';

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
</script>

<div
	class="fixed top-0 right-0 left-0 z-50 flex h-7 items-center justify-between px-4"
	style="background: rgba(0,0,0,0.35); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.08);"
>
	<!-- Left side -->
	<div class="flex items-center gap-4">
		<span class="text-sm font-extrabold tracking-tight text-white/95 select-none">PZ</span>
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
