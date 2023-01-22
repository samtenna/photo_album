window.addEventListener('load', async () => {
    const collections = await loadCollections();
    paintCollections(collections);
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

async function paintCollections (collections) {
    // const collectionContainer = document.getElementById('collection-container');

    collections.forEach((collection) => {
        const collectionWrapper = document.createElement('div');
        collectionWrapper.className = 'flex flex-col gap-3';
        const title = document.createElement('h3');
        title.className = 'text-3xl';
    });
}
