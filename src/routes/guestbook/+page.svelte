<script lang="ts">
	import { convexClient } from '$lib/stores/convex.svelte';
	import { api } from '$convex/_generated/api';
	import GuestNote from '$lib/components/GuestNote.svelte';
	import { NotebookPen, ChevronRight, House } from '@lucide/svelte';
	import type { Id } from '$convex/_generated/dataModel';

	type ColorKey = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

	const COLORS = ['yellow', 'blue', 'green', 'pink', 'purple'] as const;

	// Real-time subscription to all guestbook notes
	let notes = $state<
		Array<{
			_id: Id<'guestbookNotes'>;
			x: number;
			y: number;
			color: ColorKey;
			content: string;
		}>
	>([]);

	$effect(() => {
		return convexClient.onUpdate(api.notes.list, {}, (result) => {
			notes = result ?? [];
		});
	});

	function addNote() {
		const color = COLORS[Math.floor(Math.random() * COLORS.length)];
		convexClient.mutation(api.notes.add, {
			x: 100 + Math.random() * (window.innerWidth - 350),
			y: 80 + Math.random() * (window.innerHeight - 300),
			color
		});
	}

	function removeNote(id: Id<'guestbookNotes'>) {
		convexClient.mutation(api.notes.remove, { id });
	}
</script>

<div class="relative flex h-full w-full flex-col overflow-hidden">
	<!-- Header bar -->
	<div class="relative z-50 flex items-center gap-2 px-6 py-3">
		<div
			class="flex items-center gap-1.5 rounded-xl border border-white/12 bg-black/40 px-3 py-1.5 text-sm shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-[20px]"
		>
			<a
				href="/"
				class="flex items-center gap-1 text-white/40 transition-colors hover:text-white/70"
			>
				<House class="h-3.5 w-3.5" />
				<span>Home</span>
			</a>
			<ChevronRight class="h-3.5 w-3.5 text-white/25" />
			<span class="flex items-center gap-1.5 text-white/80">
				<NotebookPen class="h-3.5 w-3.5" />
				Guestbook
			</span>
		</div>
		<button
			onclick={addNote}
			class="flex items-center gap-1.5 rounded-xl border border-white/12 bg-black/40 px-3 py-1.5 text-sm text-white/50 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-[20px] transition-colors hover:text-white/80 active:scale-95"
		>
			<NotebookPen class="h-3.5 w-3.5" />
			Leave a note
		</button>
	</div>

	<!-- Corkboard -->
	<div class="relative flex-1">
		<!-- Pinned info note — not draggable or closable -->
		<div
			class="absolute"
			style="left: 40px; top: 24px; width: 220px; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15); overflow: hidden;"
		>
			<div style="background: #FDE68A; padding: 6px 10px;">
				<span
					style="font-size: 0.7rem; font-weight: 600; color: #78350F; opacity: 0.7; letter-spacing: 0.05em; text-transform: uppercase;"
					>Guestbook</span
				>
			</div>
			<div
				style="padding: 10px; background: #FFFBEB; color: #78350F; font-size: 0.8125rem; line-height: 1.55;"
			>
				Leave a sticky note - say hi, share a thought, or just drop your name.
			</div>
		</div>

		{#each notes as note (note._id)}
			<GuestNote
				id={note._id}
				x={note.x}
				y={note.y}
				color={note.color}
				content={note.content}
				onclose={() => removeNote(note._id)}
			/>
		{/each}
	</div>
</div>
