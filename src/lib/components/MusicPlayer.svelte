<script lang="ts">
	import { Music, SkipBack, Play, SkipForward } from '@lucide/svelte';
</script>

<div class="flex flex-col items-center gap-4 p-2">
	<!-- Album art -->
	<div
		class="flex h-40 w-40 items-center justify-center rounded-2xl"
		style="background: linear-gradient(135deg, #EC4899, #BE185D); box-shadow: 0 8px 32px rgba(0,0,0,0.4);"
	>
		<Music class="h-14 w-14 text-white/80" strokeWidth={1.5} />
	</div>

	<!-- Track info -->
	<div class="flex w-full flex-col items-center gap-1">
		<span class="text-base font-semibold text-white">Never Gonna Give You Up</span>
		<span class="text-sm text-white/50">Rick Astley</span>
	</div>

	<!-- Progress bar -->
	<div class="w-full">
		<div class="h-0.75 w-full overflow-hidden rounded-full bg-white/15">
			<div class="h-full w-1/5 rounded-full bg-white/80"></div>
		</div>
	</div>

	<!-- Controls -->
	<div class="flex items-center gap-8">
		<button class="cursor-default text-white/50" aria-label="Skip back">
			<SkipBack class="h-5 w-5" strokeWidth={1.5} />
		</button>
		<button
			class="flex h-11 w-11 cursor-default items-center justify-center rounded-full bg-white"
			aria-label="Play"
		>
			<Play class="h-5 w-5 translate-x-0.5 text-black" fill="currentColor" strokeWidth={0} />
		</button>
		<button class="cursor-default text-white/50" aria-label="Skip forward">
			<SkipForward class="h-5 w-5" strokeWidth={1.5} />
		</button>
	</div>
</div>
