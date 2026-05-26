<script lang="ts">
	import { Send, CheckCircle } from '@lucide/svelte';

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let loading = $state(false);
	let sent = $state(false);
	let error = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, subject, message })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error ?? 'Something went wrong.';
			} else {
				sent = true;
			}
		} catch {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex h-full flex-col bg-[#1e1e1e]">
	<!-- Header -->
	<div class="flex items-center gap-2 border-b border-white/10 px-4 py-3">
		<Send class="h-4 w-4 text-white/50" />
		<span class="text-sm font-medium text-white/80">New Message</span>
	</div>

	{#if sent}
		<!-- Success state -->
		<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
			<CheckCircle class="h-10 w-10 text-emerald-400" />
			<p class="text-base font-medium text-white">Message sent!</p>
			<p class="text-sm text-white/50">Thanks for reaching out. I'll get back to you soon.</p>
		</div>
	{:else}
		<!-- Form -->
		<form onsubmit={handleSubmit} class="flex flex-1 flex-col gap-0 overflow-auto">
			<!-- Name field -->
			<div class="border-b border-white/10">
				<div class="flex items-center gap-3 px-4 py-2.5">
					<span class="w-14 shrink-0 text-xs text-white/40">From</span>
					<input
						type="text"
						placeholder="Your name"
						bind:value={name}
						required
						class="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
					/>
				</div>
			</div>

			<!-- Email field -->
			<div class="border-b border-white/10">
				<div class="flex items-center gap-3 px-4 py-2.5">
					<span class="w-14 shrink-0 text-xs text-white/40">Email</span>
					<input
						type="email"
						placeholder="your@email.com"
						bind:value={email}
						required
						class="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
					/>
				</div>
			</div>

			<!-- To field (static) -->
			<div class="border-b border-white/10">
				<div class="flex items-center gap-3 px-4 py-2.5">
					<span class="w-14 shrink-0 text-xs text-white/40">To</span>
					<span class="text-sm text-white/60">P Zetterberg</span>
				</div>
			</div>

			<!-- Subject field -->
			<div class="border-b border-white/10">
				<div class="flex items-center gap-3 px-4 py-2.5">
					<span class="w-14 shrink-0 text-xs text-white/40">Subject</span>
					<input
						type="text"
						placeholder="What's this about?"
						bind:value={subject}
						class="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
					/>
				</div>
			</div>

			<!-- Message body -->
			<textarea
				placeholder="Write your message..."
				bind:value={message}
				required
				class="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-white placeholder-white/25 outline-none"
			></textarea>

			<!-- Footer -->
			<div class="flex items-center justify-between border-t border-white/10 px-4 py-3">
				{#if error}
					<span class="text-xs text-red-400">{error}</span>
				{:else}
					<span></span>
				{/if}
				<button
					type="submit"
					disabled={loading}
					class="flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-all disabled:opacity-50"
					style="background: linear-gradient(135deg, #6366F1, #4F46E5); box-shadow: 0 2px 8px rgba(99,102,241,0.4);"
				>
					{#if loading}
						<span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
						Sending…
					{:else}
						<Send class="h-3.5 w-3.5" />
						Send
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>
