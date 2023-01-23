import { deleteCollection, createCollection, createPhoto, loadPhoto } from './requests.js';

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

    const newPhotoForm = document.createElement('form');
    newPhotoForm.action = `/api/collections/${collection.id}`;
    newPhotoForm.method = 'POST';
    newPhotoForm.enctype = 'multipart/form-data';
    collectionWrapper.appendChild(newPhotoForm);

    const newPhotoFileInput = document.createElement('input');
    newPhotoFileInput.type = 'file';
    newPhotoFileInput.name = 'image';
    newPhotoForm.appendChild(newPhotoFileInput);

    const newPhotoDescriptionInput = document.createElement('input');
    newPhotoDescriptionInput.className = 'text-xl border-2 border-green-200 rounded px-4 py-2';
    newPhotoDescriptionInput.placeholder = 'Description';
    newPhotoForm.appendChild(newPhotoDescriptionInput);

    const newPhotoButton = document.createElement('button');
    newPhotoButton.className = 'bg-green-500 text-white text-xl px-4 py-2 rounded';
    newPhotoButton.textContent = 'Upload Photo';
    newPhotoButton.type = 'submit';
    newPhotoForm.appendChild(newPhotoButton);

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

        createPhoto(collection.id, newPhotoDescriptionInput.value, newPhotoFileInput.files[0], imageContainer);
        newPhotoDescriptionInput.value = '';
        newPhotoFileInput.value = '';
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
    image.src = `/static/images/${photo.id}.jpg`;
    image.id = photo.id;
    imageDiv.appendChild(image);

    image.addEventListener('click', async () => {
        await showViewModal(photo.id);
    });
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
        viewModal.classList.add('hidden');
    });
}

export function showViewModal (photoId) {
    loadPhoto(photoId).then(({ description }) => {
        const viewModal = document.getElementById('view-modal');
        const viewModalImage = document.getElementById('view-modal-image');
        const viewModalLabel = document.getElementById('view-modal-label');

        viewModalLabel.textContent = description;
        viewModalImage.src = `/static/images/${photoId}.jpg`;
        viewModal.classList.remove('hidden');
    });
}
