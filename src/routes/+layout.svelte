<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import wallpaper from '$lib/assets/wallpaper.jpg';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import NavMenu from '$lib/components/NavMenu.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="flex h-screen flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
	style="background-image: url({wallpaper})"
>
	<MenuBar />

	<div class="flex-1 overflow-hidden pt-7">
		{@render children()}
	</div>

	<NavMenu />
</div>
