<script lang="ts">
	import { ExternalLink, GitBranch, Globe } from '@lucide/svelte';

	type Project = {
		id: number;
		name: string;
		description: string;
		tags: string[];
		gradient: string;
		github?: string;
		live?: string;
		status: 'completed' | 'wip' | 'archived';
	};

	const projects: Project[] = [
		{
			id: 1,
			name: 'Web OS Portfolio',
			description: 'A macOS-inspired personal portfolio built as a fully interactive web desktop.',
			tags: ['Svelte', 'TypeScript', 'Tailwind'],
			gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
			github: '#',
			live: '#',
			status: 'wip'
		},
		{
			id: 2,
			name: 'Commerce Dashboard',
			description: 'Full-stack e-commerce admin panel with real-time analytics and inventory management.',
			tags: ['Next.js', 'Prisma', 'PostgreSQL'],
			gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
			github: '#',
			status: 'completed'
		},
		{
			id: 3,
			name: 'AI Chat Interface',
			description: 'Streaming chat UI with multi-model support, conversation history, and tool use.',
			tags: ['Python', 'FastAPI', 'React'],
			gradient: 'linear-gradient(135deg, #10B981, #059669)',
			github: '#',
			live: '#',
			status: 'completed'
		},
		{
			id: 4,
			name: 'Fitness Tracker',
			description: 'Cross-platform mobile app for workout logging, progress charts, and goal setting.',
			tags: ['React Native', 'Expo', 'Firebase'],
			gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
			github: '#',
			status: 'archived'
		},
		{
			id: 5,
			name: 'devctl CLI',
			description: 'A developer productivity tool for managing local services, env vars, and project scaffolding.',
			tags: ['Rust', 'Clap', 'Tokio'],
			gradient: 'linear-gradient(135deg, #EF4444, #B91C1C)',
			github: '#',
			status: 'wip'
		},
		{
			id: 6,
			name: 'Pebble UI',
			description: 'Open-source design system with accessible components, tokens, and Figma integration.',
			tags: ['Svelte', 'Storybook', 'Figma'],
			gradient: 'linear-gradient(135deg, #EC4899, #BE185D)',
			github: '#',
			live: '#',
			status: 'completed'
		}
	];

	const statusLabel: Record<Project['status'], string> = {
		completed: 'Completed',
		wip: 'In Progress',
		archived: 'Archived'
	};

	const statusColor: Record<Project['status'], string> = {
		completed: 'rgba(16, 185, 129, 0.18)',
		wip: 'rgba(99, 102, 241, 0.18)',
		archived: 'rgba(255, 255, 255, 0.07)'
	};

	const statusDot: Record<Project['status'], string> = {
		completed: '#10B981',
		wip: '#818CF8',
		archived: 'rgba(255,255,255,0.3)'
	};
</script>

<div class="flex h-full flex-col gap-4 text-white/80">
	<!-- Toolbar -->
	<div class="flex items-center justify-between border-b border-white/8 pb-3">
		<div>
			<p class="text-sm font-semibold text-white/90">Projects</p>
			<p class="text-[11px] text-white/35">{projects.length} items</p>
		</div>
		<div class="flex gap-1.5">
			{#each ['All', 'Svelte', 'React', 'Rust'] as filter}
				<button
					class="rounded-md px-2.5 py-1 text-[11px] font-medium text-white/50 transition-colors"
					style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);"
				>
					{filter}
				</button>
			{/each}
		</div>
	</div>

	<!-- Grid -->
	<div class="grid grid-cols-2 gap-3 pb-1">
		{#each projects as project (project.id)}
			<div
				class="group flex flex-col gap-3 rounded-xl p-3 transition-all duration-150"
				style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);"
			>
				<!-- Thumbnail -->
				<div
					class="h-24 w-full rounded-lg"
					style="background: {project.gradient}; opacity: 0.85;"
				></div>

				<!-- Info -->
				<div class="flex flex-col gap-1.5">
					<div class="flex items-start justify-between gap-2">
						<p class="text-xs font-semibold leading-tight text-white/90">{project.name}</p>
						<span
							class="flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
							style="background: {statusColor[project.status]}; color: rgba(255,255,255,0.6);"
						>
							<span
								class="h-1.5 w-1.5 rounded-full"
								style="background: {statusDot[project.status]};"
							></span>
							{statusLabel[project.status]}
						</span>
					</div>

					<p class="text-[11px] leading-relaxed text-white/40">{project.description}</p>

					<!-- Tags -->
					<div class="flex flex-wrap gap-1">
						{#each project.tags as tag}
							<span
								class="rounded px-1.5 py-0.5 text-[10px] font-medium text-white/50"
								style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.07);"
							>
								{tag}
							</span>
						{/each}
					</div>
				</div>

				<!-- Links -->
				<div class="mt-auto flex gap-2 border-t border-white/6 pt-2">
					{#if project.github}
						<a
							href={project.github}
							class="flex items-center gap-1 text-[11px] text-white/35 transition-colors hover:text-white/70"
							onclick={(e) => e.stopPropagation()}
						>
							<GitBranch class="h-3 w-3" />
							GitHub
						</a>
					{/if}
					{#if project.live}
						<a
							href={project.live}
							class="flex items-center gap-1 text-[11px] text-white/35 transition-colors hover:text-white/70"
							onclick={(e) => e.stopPropagation()}
						>
							<Globe class="h-3 w-3" />
							Live
						</a>
					{/if}
					<span class="ml-auto">
						<ExternalLink class="h-3 w-3 text-white/15 transition-colors group-hover:text-white/35" />
					</span>
				</div>
			</div>
		{/each}
	</div>
</div>
