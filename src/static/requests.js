import { paintPhoto, paintCollection, showError } from './ui.js';

export async function loadCollections () {
    try {
        // fetch collections
        let collections = [];
        const res = await fetch('/api/collections');
        const data = await res.json();
        collections = data;

        collections = Promise.all(collections.map(async (collection) => {
            // fetch photos for this collection
            const res = await fetch(`/api/collections/${collection.id}/photos`);
            const data = await res.json();
            console.log(data);
            return { ...collection, photos: data };
        }));

        return collections;
    } catch (e) {
        console.log(`Error fetching data from server: ${e}`);
        // TODO: do some error handling in the UI.
    }
}

export async function createCollection (name) {
    try {
        const res = await fetch('/api/collections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });

        paintCollection(await res.json());
    } catch {
        showError();
    }
}

export async function createPhoto (collectionId, url, imageContainer) {
    fetch(`/api/collections/${collectionId}/photos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) }).then(async (res) => {
        paintPhoto(await res.json(), imageContainer);
    }).catch(() => {
        showError();
    });
}

export async function deleteCollection (collectionId, collectionContainer, collectionWrapper) {
    fetch(`/api/collections/${collectionId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }).then((res) => {
        collectionContainer.removeChild(collectionWrapper);
    }).catch(() => {
        showError();
    });
}
