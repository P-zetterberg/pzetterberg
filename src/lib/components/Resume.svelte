<div class="flex flex-col gap-6 pb-2 text-white/80">
	<!-- HEADER -->
	<div class="flex items-center gap-4 border-b border-white/8 pb-5">
		<div
			class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-black tracking-tight text-white"
			style="background: linear-gradient(135deg, #F97316, #EF4444);"
		>
			PZ
		</div>
		<div class="flex flex-col gap-0.5">
			<h1 class="text-lg leading-tight font-bold text-white/95">Pontus Zetterberg</h1>
			<p class="text-sm text-white/55">Frontend & Fullstack Developer</p>
			<div class="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-white/35">
				<span>pontus@zetterberg.dev</span>
				<span class="text-white/15">·</span>
				<span>github.com/P-zetterberg</span>
				<span class="text-white/15">·</span>
				<span>Västerås, Sweden</span>
			</div>
		</div>
	</div>

	<!-- SUMMARY -->
	<section class="flex flex-col gap-2">
		<p class="text-[10px] font-semibold tracking-widest text-white/35 uppercase">Summary</p>
		<p class="text-[13px] leading-relaxed text-white/65">
			Frontend-focused fullstack developer with 5+ years building polished, interactive web
			applications. Specialises in Svelte and TypeScript, with a passion for developer experience,
			accessible UI, and projects that push what runs in a browser.
		</p>
	</section>

	<!-- EXPERIENCE -->
	<section class="flex flex-col gap-3">
		<p class="text-[10px] font-semibold tracking-widest text-white/35 uppercase">Experience</p>

		<div
			class="flex flex-col gap-1 rounded-xl p-3"
			style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);"
		>
			<div class="flex items-start justify-between gap-2">
				<div>
					<p class="text-xs font-semibold text-white/90">Frontend Developer</p>
					<p class="text-[11px] text-white/50">Lumenara AB · Gothenburg, SE</p>
				</div>
				<span class="shrink-0 text-[10px] text-white/30">2022 - Present</span>
			</div>
			<ul class="mt-1.5 flex flex-col gap-1 pl-3">
				<li class="list-disc text-[11px] leading-relaxed text-white/55">
					Led migration of legacy React dashboard to SvelteKit, cutting bundle size by 42%.
				</li>
				<li class="list-disc text-[11px] leading-relaxed text-white/55">
					Built real-time collaboration features using WebSockets and Svelte stores.
				</li>
				<li class="list-disc text-[11px] leading-relaxed text-white/55">
					Established component library (Pebble UI) used across 3 products.
				</li>
			</ul>
		</div>

		<div
			class="flex flex-col gap-1 rounded-xl p-3"
			style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);"
		>
			<div class="flex items-start justify-between gap-2">
				<div>
					<p class="text-xs font-semibold text-white/90">Fullstack Developer</p>
					<p class="text-[11px] text-white/50">Nordvik Digital · Stockholm, SE</p>
				</div>
				<span class="shrink-0 text-[10px] text-white/30">2020 - 2022</span>
			</div>
			<ul class="mt-1.5 flex flex-col gap-1 pl-3">
				<li class="list-disc text-[11px] leading-relaxed text-white/55">
					Built e-commerce admin tools with Next.js, Prisma, and PostgreSQL for 15k+ daily users.
				</li>
				<li class="list-disc text-[11px] leading-relaxed text-white/55">
					Integrated logistics APIs and built order-tracking dashboard reducing support tickets by
					30%.
				</li>
			</ul>
		</div>

		<div
			class="flex flex-col gap-1 rounded-xl p-3"
			style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);"
		>
			<div class="flex items-start justify-between gap-2">
				<div>
					<p class="text-xs font-semibold text-white/90">Frontend Developer (Intern → Junior)</p>
					<p class="text-[11px] text-white/50">Vexo Agency · Remote</p>
				</div>
				<span class="shrink-0 text-[10px] text-white/30">2018 - 2020</span>
			</div>
			<ul class="mt-1.5 flex flex-col gap-1 pl-3">
				<li class="list-disc text-[11px] leading-relaxed text-white/55">
					Delivered responsive landing pages for clients across SaaS and fintech.
				</li>
				<li class="list-disc text-[11px] leading-relaxed text-white/55">
					Introduced component-driven workflows with Storybook, adopted across the agency.
				</li>
			</ul>
		</div>
	</section>

	<!-- EDUCATION -->
	<section class="flex flex-col gap-2">
		<p class="text-[10px] font-semibold tracking-widest text-white/35 uppercase">Education</p>
		<div
			class="flex items-start justify-between rounded-xl p-3"
			style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);"
		>
			<div>
				<p class="text-xs font-semibold text-white/90">B.Sc. Computer Science</p>
				<p class="text-[11px] text-white/50">Chalmers University of Technology · Gothenburg, SE</p>
			</div>
			<span class="shrink-0 text-[10px] text-white/30">2015 - 2018</span>
		</div>
	</section>

	<!-- SKILLS -->
	<section class="flex flex-col gap-3">
		<p class="text-[10px] font-semibold tracking-widest text-white/35 uppercase">Skills</p>
		{#each [{ label: 'Languages', items: ['TypeScript', 'JavaScript', 'Rust', 'Python', 'HTML', 'CSS'] }, { label: 'Frameworks & Libraries', items: ['SvelteKit', 'Next.js', 'React', 'FastAPI', 'Tailwind CSS', 'shadcn'] }, { label: 'Tools & Platforms', items: ['Vite', 'Git', 'Docker', 'Figma', 'PostgreSQL', 'Redis', 'Vercel'] }] as group}
			<div>
				<p class="mb-1.5 text-[10px] text-white/30">{group.label}</p>
				<div class="flex flex-wrap gap-1.5">
					{#each group.items as skill}
						<span
							class="rounded-md px-2 py-1 text-[11px] font-medium text-white/65"
							style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);"
						>
							{skill}
						</span>
					{/each}
				</div>
			</div>
		{/each}
	</section>
</div>
