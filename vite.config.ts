import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Server } from 'socket.io';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import type { ViteDevServer } from 'vite';

const COLORS = [
	'#f87171',
	'#fb923c',
	'#fbbf24',
	'#a3e635',
	'#34d399',
	'#38bdf8',
	'#818cf8',
	'#a78bfa',
	'#f472b6',
	'#fb7185',
	'#2dd4bf',
	'#facc15',
	'#60a5fa',
	'#c084fc',
	'#f97316',
	'#4ade80',
	'#e879f9',
	'#67e8f9',
	'#fde68a',
	'#a5f3fc'
];

const socketPlugin = {
	name: 'socket-io',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;
		const io = new Server(server.httpServer);
		io.on('connection', (socket) => {
			const color = COLORS[Math.floor(Math.random() * COLORS.length)];
			const name = uniqueNamesGenerator({
				dictionaries: [adjectives, animals],
				length: 2,
				separator: ' '
			});

			socket.emit('welcome', { name, color });

			socket.on('cursor', ({ x, y }: { x: number; y: number }) => {
				socket.broadcast.emit('cursor', { id: socket.id, x, y, color, name });
			});
			socket.on('disconnect', () => {
				socket.broadcast.emit('cursor:leave', { id: socket.id });
			});
		});
	}
};

export default defineConfig({ plugins: [tailwindcss(), sveltekit(), socketPlugin] });
