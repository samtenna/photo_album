import { paintCollection, showError } from './ui.js';

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
            return { ...collection, photos: data };
        }));

        return collections;
    } catch (e) {
        console.log(`Error fetching data from server: ${e}`);
        // TODO: do some error handling in the UI.
    }
}

export function createCollection (name) {
    fetch('/api/collections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
        .then(async (res) => paintCollection(await res.json()))
        .catch(() => showError());
}

export async function loadPhoto (photoId) {
    const res = await fetch(`/api/photos/${photoId}`)
        .catch(() => showError());
    const photo = await res.json();
    return photo;
}

export function createPhoto (collectionId, description, file, imageContainer) {
    fetch(`/api/collections/${collectionId}/photos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description }) })
    .then(async (res) => {
            const photo = await res.json();
            const formData = new window.FormData();
            formData.append('image', file);
            fetch(`/api/photos/${photo.id}/upload`, { method: 'POST', body: formData }).catch(() => showError());
        }).catch(() => showError());
}

export function deleteCollection (collectionId, collectionContainer, collectionWrapper) {
    fetch(`/api/collections/${collectionId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }).then((res) => {
        collectionContainer.removeChild(collectionWrapper);
    }).catch(() => {
        showError();
    });
}
