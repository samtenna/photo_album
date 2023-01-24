import { paintCollection, paintPhoto, showError } from './ui.js';

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
            fetch(`/api/photos/${photo.id}/upload`, { method: 'POST', body: formData }).then(() => {
                paintPhoto(photo, imageContainer);
            }).catch(() => showError());
        }).catch(() => showError());
}

export function deleteCollection (collectionId, collectionContainer, collectionWrapper) {
    fetch(`/api/collections/${collectionId}`, { method: 'DELETE' })
        .then((res) => {
        collectionContainer.removeChild(collectionWrapper);
    }).catch(() => showError());
}

export function deletePhoto (photoId) {
    fetch(`/api/photos/${photoId}`, { method: 'DELETE' })
        .then(() => {
            // remove image from collection in ui
            const img = document.getElementById(photoId);
            const imgDiv = img.parentElement;
            imgDiv.parentElement.removeChild(imgDiv);
        })
        .catch(() => showError());
}

export function editPhoto (photoId, newDescription, label) {
    fetch(`/api/photos/${photoId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: newDescription }) })
        .then(() => {
            // update label
            label.textContent = newDescription;
        })
        .catch(() => {
            showError();
        });
}

export function editCollection (collectionId, newName, label) {
    fetch(`/api/collections/${collectionId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName }) })
    .then(() => {
        label.textContent = newName;
    })
    .catch(() => showError());
}
