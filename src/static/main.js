window.addEventListener('load', async () => {
    const collections = await loadCollections();
    console.log(collections);
});

async function loadCollections () {
    try {
        // fetch collections
        let collections = [];
        const res = await fetch('/api/collections');
        const data = await res.json();
        collections = data;

        collections.map(async (collection) => {
            // fetch photos for this collection
            const res = await fetch(`/api/collections/${collection.id}/photos`);
            const data = await res.json();
            return { ...collection, photos: data };
        });

        return collections;
    } catch (e) {
        console.log(`Error fetching data from server: ${e}`);
        // TODO: do some error handling in the UI.
    }
}
