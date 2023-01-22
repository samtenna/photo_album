import { deleteCollection, createCollection, createPhoto } from './requests.js';

export async function paintCollections (collections) {
    collections.forEach((collection) => {
        paintCollection(collection);
    });
}

export function paintCollection (collection) {
    const collectionContainer = document.getElementById('collection-container');
    const collectionWrapper = document.createElement('div');
    collectionWrapper.className = 'flex flex-col gap-3';

    const title = document.createElement('h3');
    title.className = 'text-3xl';
    title.textContent = collection.name;
    collectionWrapper.appendChild(title);

    const newPhotoInput = document.createElement('input');
    newPhotoInput.className = 'text-xl border-2 border-green-200 rounded px-4 py-2';
    newPhotoInput.placeholder = 'https://www.example.com/image';
    collectionWrapper.appendChild(newPhotoInput);

    const newPhotoButton = document.createElement('button');
    newPhotoButton.className = 'bg-green-500 text-white text-xl px-4 py-2 rounded';
    newPhotoButton.textContent = 'New Photo';
    collectionWrapper.appendChild(newPhotoButton);

    const deleteCollectionButton = document.createElement('button');
    deleteCollectionButton.className = 'bg-red-500 text-white text-xl px-4 py-2 rounded';
    deleteCollectionButton.textContent = 'Delete Collection';

    deleteCollectionButton.addEventListener('click', (e) => {
        e.preventDefault();

        deleteCollection(collection.id, collectionContainer, collectionWrapper);
    });

    collectionWrapper.appendChild(deleteCollectionButton);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'grid sm:grid-cols-2 lg:grid-cols-3 gap-3';
    collectionWrapper.appendChild(imageContainer);

    newPhotoButton.addEventListener('click', (e) => {
        e.preventDefault();

        createPhoto(collection.id, newPhotoInput.value, imageContainer);
        newPhotoInput.value = '';
    });

    // photos
    if (collection.photos) {
        collection.photos.forEach((photo) => {
            paintPhoto(photo, imageContainer);
        });
    }

    collectionContainer.appendChild(collectionWrapper);
}

export function paintPhoto (photo, imageContainer) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'transition aspect-square hover:bg-gray-200 hover:cursor-pointer hover:shadow-md bg-gray-100 p-2 rounded';
    imageContainer.appendChild(imageDiv);

    const image = document.createElement('img');
    image.className = 'rounded';
    image.style = 'width: 100%; height: 100%; object-fit: cover;';
    image.src = photo.url;
    image.id = photo.id;
    imageDiv.appendChild(image);
}

export function showError (message) {
    const errorToast = document.getElementById('error-toast');
    errorToast.classList.remove('invisible');

    setTimeout(() => {
        errorToast.classList.add('invisible');
    }, 2000);
}

export function setupListeners () {
    const newCollectionForm = document.getElementById('new-collection-form');
    const newCollectionInput = document.getElementById('new-collection-input');

    newCollectionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        createCollection(newCollectionInput.value);
        newCollectionInput.value = '';
    });

    const viewModal = document.getElementById('view-modal');
    const viewModalCloseButton = document.getElementById('view-modal-close-button');

    viewModalCloseButton.addEventListener('click', () => {
        viewModal.classList.toggle('hidden');
    });
}
