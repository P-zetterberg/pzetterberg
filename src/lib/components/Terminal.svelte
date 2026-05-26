<script lang="ts">
	import { tick } from 'svelte';
	import { windowsState } from '$lib/stores/windows.svelte';

	type Line = { type: 'input' | 'output' | 'system'; text: string };

	const PROMPT = 'visitor@pzetterberg:~$';

	let lines = $state<Line[]>([
		{ type: 'system', text: 'PZ Terminal v1.0.0 — Type `help` for available commands.' },
		{ type: 'system', text: '─────────────────────────────────────────────' }
	]);
	let inputValue = $state('');
	let cmdHistory = $state<string[]>([]);
	let historyIndex = $state(-1);
	let outputEl: HTMLDivElement;
	let inputEl: HTMLInputElement;
	let shake = $state(false);

	async function scrollToBottom() {
		await tick();
		if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
	}

	function pushOutput(text: string | string[]) {
		const texts = Array.isArray(text) ? text : [text];
		for (const t of texts) {
			lines.push({ type: 'output', text: t });
		}
	}

	function runCommand(raw: string) {
		const cmd = raw.trim();
		if (!cmd) return;

		lines.push({ type: 'input', text: `${PROMPT} ${cmd}` });
		cmdHistory.unshift(cmd);
		historyIndex = -1;

		const [base, ...args] = cmd.toLowerCase().split(/\s+/);

		switch (base) {
			case 'help':
				pushOutput([
					'Available commands:',
					'  help          — show this message',
					'  about         — who is P Zetterberg',
					'  whoami        — same as about',
					'  ls            — list directory',
					'  ls projects   — list projects',
					'  cat <file>    — read a file (try skills.txt, about.txt)',
					'  open <app>    — open an app window (music, projects, notes, mail, system)',
					'  ping <host>   — ping a host',
					'  date          — current date & time',
					'  uname -a      — system info',
					'  neofetch      — system info with ASCII art',
					'  clear         — clear terminal',
					'  sudo ...      — please no rm -rf /'
				]);
				break;

			case 'about':
			case 'whoami':
				pushOutput([
					'P Zetterberg — Frontend developer & designer.',
					'Passionate about interactive UIs, Svelte, and building',
					'things that feel like they should not exist on the web.',
					'Currently making this very portfolio look like an OS.',
					'',
					'  GitHub   → github.com/P-zetterberg',
					'  Stack    → Svelte, TypeScript, Rust, Python'
				]);
				break;

			case 'ls':
				if (args[0] === 'projects') {
					pushOutput([
						'projects/',
						'  web-os-portfolio   [WIP]       Svelte',
						'  commerce-dashboard [Completed] Next.js',
						'  ai-chat-interface  [Completed] Python/FastAPI',
						'  fitness-tracker    [Archived]  React Native',
						'  devctl             [WIP]       Rust',
						'  pebble-ui          [Completed] Svelte/Storybook'
					]);
				} else {
					pushOutput(['about.txt', 'skills.txt', 'projects/', 'wallpaper.jpg', '.secret']);
				}
				break;

			case 'cat': {
				const file = args[0];
				if (file === 'skills.txt') {
					pushOutput([
						'# skills.txt',
						'',
						'Languages:    TypeScript, Rust, Python, HTML/CSS',
						'Frameworks:   SvelteKit, Next.js, React, FastAPI',
						'Styling:      Tailwind CSS, shadcn, CSS-in-JS',
						'Tools:        Vite, Git, Docker, Figma',
						'Databases:    PostgreSQL, SQLite, Redis',
						'Other:        WebSockets, REST, CLI tools'
					]);
				} else if (file === 'about.txt') {
					pushOutput([
						'# about.txt',
						'',
						'Name:    P Zetterberg',
						'Role:    Frontend Developer & Designer',
						'Based:   Sweden',
						'Focus:   Building interactive, polished web UIs',
						'',
						'This portfolio is built as a desktop OS using SvelteKit.',
						'Real-time multiplayer cursors? Yes. Matrix rain? Also yes.'
					]);
				} else if (file === '.secret') {
					pushOutput([
						'👀 You found it.',
						'',
						'Hint: Try typing a certain movie title on the desktop... 🔴🔵'
					]);
				} else if (!file) {
					pushOutput('cat: missing operand');
				} else {
					pushOutput(`cat: ${file}: No such file or directory`);
				}
				break;
			}

			case 'open': {
				const app = args[0];
				const appMap: Record<string, () => void> = {
					music: () => (windowsState.musicOpen = true),
					projects: () => (windowsState.projectsOpen = true),
					notes: () => (windowsState.notesOpen = true),
					mail: () => (windowsState.mailOpen = true),
					system: () => (windowsState.systemOpen = true),
					terminal: () => (windowsState.terminalOpen = true)
				};
				if (app && appMap[app]) {
					appMap[app]();
					pushOutput(`Opening ${app}...`);
				} else if (!app) {
					pushOutput(
						'open: missing argument. Try: open music, open projects, open notes, open mail, open system'
					);
				} else {
					pushOutput(`open: ${app}: application not found`);
				}
				break;
			}

			case 'ping': {
				const host = args[0] || 'pzetterberg.com';
				pushOutput([
					`PING ${host}: 56 data bytes`,
					`64 bytes from ${host}: icmp_seq=0 ttl=56 time=${(Math.random() * 10 + 8).toFixed(3)} ms`,
					`64 bytes from ${host}: icmp_seq=1 ttl=56 time=${(Math.random() * 10 + 8).toFixed(3)} ms`,
					`64 bytes from ${host}: icmp_seq=2 ttl=56 time=${(Math.random() * 10 + 8).toFixed(3)} ms`,
					`64 bytes from ${host}: icmp_seq=3 ttl=56 time=${(Math.random() * 10 + 8).toFixed(3)} ms`,
					`--- ${host} ping statistics ---`,
					`4 packets transmitted, 4 received, 0% packet loss`
				]);
				break;
			}

			case 'date':
				pushOutput(new Date().toString());
				break;

			case 'uname':
				pushOutput(
					'PZ-OS 2.0.0 WebOS Kernel Darwin 24.6.0; SvelteKit/2.57.0; arch: wasm64; TypeScript/6.0.2'
				);
				break;

			case 'neofetch':
				pushOutput([
					'          ██████           visitor@pzetterberg',
					'        ████████           ─────────────────────',
					'      ██████████           OS: PZ-OS 2.0.0 WebOS',
					'    ████  ██  ████         Host: Browser',
					'   ████  ████  ████        Kernel: SvelteKit 2.57.0',
					'   ████  ████  ████        Shell: pzterminal 1.0.0',
					'    ████  ██  ████         Resolution: ' + window.innerWidth + 'x' + window.innerHeight,
					'      ██████████           Theme: Glassmorphism Dark',
					'        ████████           Font: JetBrains Mono',
					'          ██████           Stack: Svelte · TypeScript · Tailwind'
				]);
				break;

			case 'clear':
				lines = [];
				break;

			case 'sudo':
				shake = true;
				pushOutput('Password: ••••••••');
				setTimeout(() => {
					pushOutput(['sudo: Permission denied. Nice try.', 'This incident will be reported.']);
					shake = false;
					scrollToBottom();
				}, 800);
				break;

			case '':
				break;

			default:
				pushOutput(`bash: ${cmd}: command not found`);
		}

		scrollToBottom();
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			runCommand(inputValue);
			inputValue = '';
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyIndex < cmdHistory.length - 1) {
				historyIndex++;
				inputValue = cmdHistory[historyIndex];
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				inputValue = cmdHistory[historyIndex];
			} else {
				historyIndex = -1;
				inputValue = '';
			}
		}
	}
</script>

<div
	class="flex h-full flex-col overflow-hidden font-mono text-sm"
	style="background: #0d0d0d; color: #4ec97a;"
	onclick={() => inputEl?.focus()}
>
	<!-- Output area -->
	<div
		bind:this={outputEl}
		class="flex-1 overflow-y-auto p-3"
		style="scrollbar-width: thin; scrollbar-color: #4ec97a40 transparent;"
	>
		{#each lines as line}
			<div
				class="leading-relaxed break-all whitespace-pre-wrap"
				style="color: {line.type === 'input'
					? '#ffffff'
					: line.type === 'system'
						? '#4ec97a80'
						: '#4ec97a'};"
			>
				{line.text}
			</div>
		{/each}
	</div>

	<!-- Input line -->
	<div
		class="flex items-center gap-2 border-t px-3 py-2"
		style="border-color: #4ec97a20;"
		class:animate-shake={shake}
	>
		<span style="color: #4ec97a; opacity: 0.7;" class="shrink-0 text-xs">{PROMPT}</span>
		<input
			bind:this={inputEl}
			bind:value={inputValue}
			{onkeydown}
			autofocus
			spellcheck="false"
			autocomplete="off"
			class="flex-1 border-none bg-transparent text-sm outline-none"
			style="color: #4ec97a; caret-color: #4ec97a;"
		/>
	</div>
</div>

<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-4px);
		}
		40% {
			transform: translateX(4px);
		}
		60% {
			transform: translateX(-4px);
		}
		80% {
			transform: translateX(4px);
		}
	}
	.animate-shake {
		animation: shake 0.4s ease-in-out;
	}
</style>
