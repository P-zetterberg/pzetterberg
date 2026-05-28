<script lang="ts">
	import { NotebookPen } from '@lucide/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { page } from '$app/stores';

	const isGuestbook = $derived($page.url.pathname === '/guestbook');

	const navItems = [
		{
			name: 'Guestbook',
			href: '/guestbook',
			icon: NotebookPen,
			gradient: 'linear-gradient(135deg, #2dd4bf, #0d9488)'
		}
	];

	let hoveredIndex = $state<number | null>(null);
	let hoveredLogo = $state(false);

	function getScale(index: number): number {
		if (hoveredIndex === null) return 1.0;
		if (index === hoveredIndex) return 1.2;
		return 1.0;
	}

	function getLogoScale(): number {
		return hoveredLogo ? 1.2 : 1.0;
	}
</script>

<Tooltip.Provider>
	<div class="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3">
		<div
			class="flex items-end gap-1 rounded-[22px] border border-white/12 bg-black/40 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[20px]"
			onmouseleave={() => {
				hoveredIndex = null;
				hoveredLogo = false;
			}}
			role="navigation"
		>
			<!-- PZ logo button -->
			<Tooltip.Root>
				<Tooltip.Trigger>
					<div
						class="relative flex flex-col items-center"
						style="transform: scale({getLogoScale()}); transform-origin: bottom center; transition: transform 200ms cubic-bezier(0.34,1.56,0.64,1);"
						role="button"
						tabindex="0"
						onmouseenter={() => {
							hoveredLogo = true;
							hoveredIndex = null;
						}}
						onmouseleave={() => (hoveredLogo = false)}
					>
						<a
							href="/"
							class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-sm font-extrabold tracking-tight text-white/90 transition-colors hover:bg-white/10"
						>
							PZ
						</a>
					</div>
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={8}>Home</Tooltip.Content>
			</Tooltip.Root>

			<!-- Separator -->
			<div class="mx-1 h-8 w-px self-center bg-white/15"></div>

			<!-- Nav items -->
			{#each navItems.filter(item => !isGuestbook || item.href === '/guestbook') as item, i}
				{@const Icon = item.icon}
				<Tooltip.Root>
					<Tooltip.Trigger>
						<div
							class="relative mx-1 flex flex-col items-center"
							style="transform: scale({getScale(
								i
							)}); transform-origin: bottom center; transition: transform 200ms cubic-bezier(0.34,1.56,0.64,1);"
							role="none"
							onmouseenter={() => (hoveredIndex = i)}
						>
							<a
								href={item.href}
								class="flex items-center justify-center rounded-xl p-2"
								style="background: {item.gradient}; box-shadow: 0 4px 16px rgba(0,0,0,0.3);"
							>
								<Icon class="h-6 w-6 text-white" />
							</a>
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content sideOffset={8}>{item.name}</Tooltip.Content>
				</Tooltip.Root>
			{/each}
		</div>
	</div>
</Tooltip.Provider>
