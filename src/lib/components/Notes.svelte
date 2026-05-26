<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';

	const KONAMI = '↑ ↑ ↓ ↓ ← → ← → B A';

	let content = $state(KONAMI);
</script>

<div class="flex h-full flex-col bg-[#1e1e1e]">
	<div class="border-b border-white/10 px-3 py-1.5">
		<span class="text-xs text-white/40">Notes.txt</span>
	</div>
	<Textarea
		bind:value={content}
		class="flex-1 resize-none rounded-none border-0 bg-transparent p-3 font-mono text-sm text-white/85 shadow-none outline-none focus-visible:ring-0 placeholder:text-white/30"
		spellcheck={false}
	/>
</div>
