<script lang="ts">
	import { onMount } from 'svelte';
	import { easterEggState } from '$lib/stores/easterEggs.svelte';

	let { active = false }: { active: boolean } = $props();

	let canvas: HTMLCanvasElement;
	let visible = $state(false);
	let animFrameId: number;
	let stopTimeout: ReturnType<typeof setTimeout>;

	const CHARS =
		'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const FONT_SIZE = 14;
	const COLOR = '#00ff41';
	const DIM_COLOR = 'rgba(0, 0, 0, 0.05)';

	let drops: number[] = [];

	function initDrops() {
		const cols = Math.floor(canvas.width / FONT_SIZE);
		drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -50));
	}

	function draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = DIM_COLOR;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = COLOR;
		ctx.font = `${FONT_SIZE}px monospace`;

		for (let i = 0; i < drops.length; i++) {
			const char = CHARS[Math.floor(Math.random() * CHARS.length)];
			ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

			if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
				drops[i] = 0;
			}
			drops[i]++;
		}
	}

	function start() {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx.fillStyle = 'rgba(0,0,0,0.9)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		initDrops();

		visible = true;
		easterEggState.matrixFound = true;

		clearTimeout(stopTimeout);
		cancelAnimationFrame(animFrameId);

		let lastFrame = 0;
		function loop(ts: number) {
			if (ts - lastFrame > 40) {
				draw(ctx!);
				lastFrame = ts;
			}
			animFrameId = requestAnimationFrame(loop);
		}
		animFrameId = requestAnimationFrame(loop);

		stopTimeout = setTimeout(() => {
			visible = false;
			setTimeout(() => {
				cancelAnimationFrame(animFrameId);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}, 800);
		}, 5000);
	}

	$effect(() => {
		if (active && canvas) {
			start();
		}
	});

	onMount(() => {
		return () => {
			cancelAnimationFrame(animFrameId);
			clearTimeout(stopTimeout);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 z-9000 transition-opacity duration-700"
	style="opacity: {visible ? 1 : 0};"
></canvas>
