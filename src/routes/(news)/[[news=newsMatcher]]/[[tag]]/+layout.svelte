<script lang="ts">
	import '$lib/css/main.css';
	import { page } from '$app/state';
	import { MediaQuery } from 'svelte/reactivity';
	import type { NewsItem } from '$lib/types/NewsItem.js';
	import { isDetailRoute } from '$lib/functions';
	import {
		getNewsListNextPageEndpoint,
		getNewsListWithItemNextPageEndpoint
	} from '$lib/endpoints/backend';
	import { getNewsDetailEndpoint, getNewsListEndpoint } from '$lib/endpoints/frontend.js';
	import { goto } from '$app/navigation';
	import type { NewsFilter } from '$lib/types/NewsFilter.js';

	const large = new MediaQuery('min-width: 800px');
	const { children, data } = $props();
	const hasNoDetailSelected = $derived.by(() => {
		return (
			page.url.pathname === '/' ||
			page.url.pathname === '/news' ||
			page.url.pathname === `/news/${page.params.tag}`
		);
	});

	const filter = $derived(data.filter);
	const id = $derived(data.id);
	const search = $derived(data.search);
	const title = $derived(data.title);

	let newSearch = $state('');

	const newsItems: NewsItem[] = $state([]);
	const mapNewsItemIdToTrue = new Map<string, boolean>();
	const cursor: { lastFeedItemId: string | undefined; lastPubdate: string | undefined } = {
		lastFeedItemId: undefined,
		lastPubdate: undefined
	};

	$effect(() => {
		data.latestNewsPromise.then((items) => {
			appendNewsItems(items.data, mapNewsItemIdToTrue);
			updateCursor();
		});
		return () => {
			// If I don't clear the items they keep accumulating and changing filters doesn't work
			clear();
		};
	});

	function appendNewsItems(items: NewsItem[], mapNewsItemIdToTrue: Map<string, boolean>) {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (!mapNewsItemIdToTrue.get(item.id)) {
				newsItems.push(item);
				mapNewsItemIdToTrue.set(item.id, true);
			}
		}
	}

	function clear() {
		newsItems.splice(0, newsItems.length);
		cursor.lastFeedItemId = undefined;
		cursor.lastPubdate = undefined;
		mapNewsItemIdToTrue.clear();
	}

	function updateCursor() {
		const lastItem = newsItems[newsItems.length - 1];
		if (lastItem) {
			cursor.lastFeedItemId = lastItem.id;
			cursor.lastPubdate = lastItem.pubdate;
		}
	}

	async function showMore() {
		try {
			const { lastFeedItemId, lastPubdate } = cursor;

			let endpoint;
			if (isDetailRoute(page.params.id, page.params.title)) {
				endpoint = getNewsListWithItemNextPageEndpoint(cursor, filter, id, search);
			} else {
				endpoint = getNewsListNextPageEndpoint(cursor, filter, search);
			}

			const response = await fetch(endpoint);
			const { data: items }: { data: NewsItem[] } = await response.json();
			appendNewsItems(items, mapNewsItemIdToTrue);
			updateCursor();
		} catch (error) {
			console.log(error);
		}
	}

	function onFilterChange(e: Event) {
		const newFilterValue = (e.target as HTMLSelectElement).value;
		let to;
		if (isDetailRoute(page.params.id, page.params.title)) {
			to = getNewsDetailEndpoint(newFilterValue as NewsFilter, id, search, title);
		} else {
			to = getNewsListEndpoint(newFilterValue as NewsFilter, search);
		}
		return goto(to);
	}

	function onSearchChange(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			let to;
			if (isDetailRoute(page.params.id, page.params.title)) {
				to = getNewsDetailEndpoint(filter as NewsFilter, id, newSearch, title);
			} else {
				to = getNewsListEndpoint(filter as NewsFilter, newSearch);
			}
			return goto(to);
		}
	}
</script>

<header>
	<div>
		<a href="/">TestNewsApp</a>
	</div>
	<div>
		On desktop, list + detail are shown side by side, on mobile you'll see either the list or the
		detail depending on the url
	</div>
</header>

{#if large.current}
	<main style="flex-direction:row;">
		<div class="list">
			<section class="panel">
				<span>Filter: {filter}</span>
				<span>Search: {search}</span>
			</section>
			<br />
			<div class="panel">
				<section class="list-filter" onchange={onFilterChange}>
					<select>
						{#each ['latest', 'likes', 'dislikes', 'trending'] as filterValue}
							<option selected={filter === filterValue}>{filterValue}</option>
						{/each}
					</select>
				</section>
				<section>
					<input
						placeholder="Search for 'china'"
						type="search"
						name="search"
						value={search}
						oninput={(e: Event) => {
							newSearch = (e.target as HTMLInputElement).value;
						}}
						onkeydown={onSearchChange}
					/>
				</section>
			</div>

			<nav>
				{#await data.latestNewsPromise}
					<span>Loading items...</span>
				{:then}
					{#each newsItems as newsItem, index (newsItem.id)}
						<div class="list-item" class:selected={page.params.id === newsItem.id}>
							<a
								data-sveltekit-preload-data="off"
								href={getNewsDetailEndpoint(filter, newsItem.id, search, newsItem.title)}
								>{index + 1} {newsItem.title}</a
							>
						</div>
					{:else}
						<div>
							No items to display under the current {filter}
							{search} Maybe try changing them?
						</div>
					{/each}
				{/await}
				<footer>
					<button onclick={showMore}>Show More</button>
				</footer>
			</nav>
		</div>
		<div class="detail">
			{@render children()}
		</div>
	</main>
{:else if !large.current && hasNoDetailSelected}
	<main style="flex-direction:column;">
		<div class="list">
			<section class="panel">
				<span>Filter: {filter}</span>
				<span>Search: {search}</span>
			</section>
			<br />
			<div class="panel">
				<section class="list-filter" onchange={onFilterChange}>
					<select>
						{#each ['latest', 'likes', 'dislikes', 'trending'] as filterValue}
							<option selected={filter === filterValue}>{filterValue}</option>
						{/each}
					</select>
				</section>
				<section>
					<input
						placeholder="Search for 'china'"
						type="search"
						name="search"
						value={search}
						oninput={(e: Event) => {
							newSearch = (e.target as HTMLInputElement).value;
						}}
						onkeydown={onSearchChange}
					/>
				</section>
			</div>
			<nav>
				{#await data.latestNewsPromise}
					<span>Loading items...</span>
				{:then}
					{#each newsItems as newsItem, index (newsItem.id)}
						<div class="list-item" class:selected={page.params.id === newsItem.id}>
							<a
								data-sveltekit-preload-data="off"
								href={getNewsDetailEndpoint(filter, newsItem.id, search, newsItem.title)}
								>{index + 1} {newsItem.title}</a
							>
						</div>
					{:else}
						<div>
							No items to display under the current {filter}
							{search} Maybe try changing them?
						</div>
					{/each}
				{/await}
				<footer>
					<button onclick={showMore}>Show More</button>
				</footer>
			</nav>
		</div>
	</main>
{:else}
	<div class="detail">
		{@render children()}
	</div>
{/if}

<style>
	main {
		background-color: lightgoldenrodyellow;
		display: flex;
		flex: 1;
		overflow: hidden;
	}
	.list {
		background-color: lightyellow;
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}
	.list-item {
		border-bottom: 1px dotted lightgray;
		padding: 0.5rem 0;
	}
	.detail {
		background-color: lightcyan;
		flex: 1;
	}
	.panel {
		display: flex;
		font-size: x-small;
		justify-content: space-between;
	}
	.selected { 
		background-color: yellow;
	}
</style>
