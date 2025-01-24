export async function load({ params, parent }) {
	const response = await parent();
	const newsItems = await response.latestNewsPromise;
	return {
		item: newsItems.data.find((item) => item.id === params.id)
	};
}
