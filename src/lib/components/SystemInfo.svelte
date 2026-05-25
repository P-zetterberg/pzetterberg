<script lang="ts">
	const stack = [
		{
			category: 'Framework',
			items: [
				{ name: 'SvelteKit', version: '2', description: 'Full-stack web framework' },
				{ name: 'Svelte', version: '5', description: 'Runes-based reactivity' }
			]
		},
		{
			category: 'Language',
			items: [{ name: 'TypeScript', version: '6', description: 'Typed JavaScript' }]
		},
		{
			category: 'Styling',
			items: [
				{ name: 'Tailwind CSS', version: '4', description: 'Utility-first CSS' },
				{ name: 'shadcn-svelte', version: '1', description: 'Accessible UI components' },
				{ name: 'bits-ui', version: '2', description: 'Headless primitives' }
			]
		},
		{
			category: 'Icons',
			items: [{ name: 'Lucide', version: '1', description: 'Open-source icon set' }]
		},
		{
			category: 'Build',
			items: [{ name: 'Vite', version: '8', description: 'Next-gen build tooling' }]
		}
	];
</script>

<div class="flex flex-col gap-5 text-white/80">
	<!-- Header -->
	<div class="flex items-center gap-4 border-b border-white/8 pb-4">
		<div
			class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black tracking-tight text-white"
			style="background: linear-gradient(135deg, #6366f1, #8b5cf6);"
		>
			PZ
		</div>
		<div>
			<p class="text-base font-semibold text-white/95">P Zetterberg</p>
			<p class="text-xs text-white/45">Personal web OS</p>
		</div>
	</div>

	<!-- Stack -->
	<div class="flex flex-col gap-4">
		{#each stack as section}
			<div>
				<p class="mb-1.5 text-[10px] font-semibold tracking-widest text-white/35 uppercase">
					{section.category}
				</p>
				<div class="flex flex-col gap-1">
					{#each section.items as item}
						<div class="flex items-center justify-between rounded-lg px-3 py-2" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);">
							<div class="flex items-center gap-2">
								<span class="text-xs font-medium text-white/85">{item.name}</span>
								<span class="rounded px-1.5 py-0.5 text-[10px] font-medium text-white/40" style="background: rgba(255,255,255,0.06);">
									v{item.version}
								</span>
							</div>
							<span class="text-[11px] text-white/35">{item.description}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
