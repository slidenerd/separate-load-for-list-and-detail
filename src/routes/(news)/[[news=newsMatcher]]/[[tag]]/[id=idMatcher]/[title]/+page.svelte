<script>
	import { page } from '$app/state';

	const { data } = $props();

	const item = $derived(data.item)
</script>

<main>
	<h1>Detail Page</h1>
	<h3>{item?.id}</h3>
	<h3>{item?.title}</h3>
	<div>How to get newsItems array here? to call newsItems[id]</div>
	<br />
	<div>
		<h4>How it works currently</h4>
		<ul>
			<li>You click on any link or change filter or search</li>
			<li>It clears out newsItems from the $effect return statement</li>
			<li>It calls +layout.ts</li>
			<ul>
				<li>If you are headed to the list route</li>
				<ul>
					<li>It fetches items from the list endpoint</li>
				</ul>
				<li>If you are headed to the detail route</li>
				<ul>
					<li>
						It fetches items from the list + item endpoint where item is pinned at the top of the
						list
					</li>
				</ul>
			</ul>
			<li>It sends a fetch request to the backend</li>
			<li>Loads new items and triggers +layout.svelte</li>
			<li>Page jumps because we wiped out news items and replaced new data</li>
		</ul>
		<h4>How it should work in my opinion</h4>
		<ul>
			<li>newsItems should <b>NOT</b> be cleared out every single time</li>
			<li>Changing filter or search should clear out news items</li>
			<li>Navigating to detail does't clear them out every time</li>
			<li>
				Sometimes, users would scroll 5 pages down, click on the 101st item, copy its URL and paste
				it in a new tab
			</li>
			<li>If id is present in existing list of news items, it should be returned as it is</li>
			<li>
				If it is not present, then a fetch request to news list + item endpoint would return fresh
				data wih the item pinned at index 0
			</li>
		</ul>
		<div>
			If you know better ways to make this work, be my guest. We still haven't used +page.ts from
			detail
		</div>
		<div>I know how to do this in Nuxt 2 but not in Svelte 😢</div>
		<div>Thanks for the help in advance 🙏🙏🙏</div>
	</div>
</main>

<style>
	main {
		padding: 1rem;
	}
</style>
