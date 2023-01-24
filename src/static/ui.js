import { deleteCollection, deletePhoto, createCollection, createPhoto, loadPhoto, editPhoto, editCollection } from './requests.js';

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
    title.className = 'text-4xl font-semibold';
    title.textContent = collection.name;
    collectionWrapper.appendChild(title);

    const titleInput = document.createElement('input');
    titleInput.className = 'text-gray-50 bg-gray-800 text-4xl font-semibold hidden focus:outline-none';
    titleInput.value = collection.name;
    collectionWrapper.appendChild(titleInput);

    titleInput.addEventListener('focusout', () => {
        editCollection(collection.id, titleInput.value, title);
        title.classList.remove('hidden');
        titleInput.classList.add('hidden');
    });

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'flex flex-col lg:flex-row gap-3 justify-between';
    collectionWrapper.appendChild(actionsContainer);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'flex flex-row items-center justify-left';
    actionsContainer.appendChild(buttonsContainer);

    const editCollectionButton = document.createElement('button');
    editCollectionButton.className = 'text-gray-400 bg-transparent rounded-lg text-sm p-1.5 items-center hover:bg-gray-600 hover:text-white transition';
    // editCollectionButton.textContent = 'Rename';
    editCollectionButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
    `;
    buttonsContainer.appendChild(editCollectionButton);

    editCollectionButton.addEventListener('click', () => {
        title.classList.add('hidden');
        titleInput.classList.remove('hidden');
        titleInput.focus();
    });

    const deleteCollectionButton = document.createElement('button');
    deleteCollectionButton.className = 'text-gray-400 bg-transparent rounded-lg text-sm p-1.5 items-center hover:bg-gray-600 hover:text-red-400 transition';
    // deleteCollectionButton.textContent = 'Delete';
    deleteCollectionButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
    `;
    buttonsContainer.appendChild(deleteCollectionButton);

    deleteCollectionButton.addEventListener('click', (e) => {
        e.preventDefault();

        deleteCollection(collection.id, collectionContainer, collectionWrapper);
    });

    const newPhotoForm = document.createElement('form');
    newPhotoForm.action = `/api/collections/${collection.id}`;
    newPhotoForm.method = 'POST';
    newPhotoForm.enctype = 'multipart/form-data';
    newPhotoForm.className = 'flex flex-col items-center justify-center md:flex-row gap-3';
    actionsContainer.appendChild(newPhotoForm);

    const newPhotoLabel = document.createElement('h3');
    newPhotoLabel.textContent = 'New Photo';
    newPhotoLabel.className = 'text-2xl font-semibold';
    newPhotoForm.appendChild(newPhotoLabel);

    const newPhotoFileInput = document.createElement('input');
    newPhotoFileInput.type = 'file';
    newPhotoFileInput.name = 'image';
    newPhotoForm.appendChild(newPhotoFileInput);

    const newPhotoDescriptionInput = document.createElement('input');
    newPhotoDescriptionInput.className = 'text-xl border-2 border-gray-600 focus:outline-none transition focus:bg-gray-50 focus:text-black bg-gray-800 rounded-lg px-4 py-2';
    newPhotoDescriptionInput.placeholder = 'Photo description';
    newPhotoForm.appendChild(newPhotoDescriptionInput);

    const newPhotoButton = document.createElement('button');
    newPhotoButton.className = 'text-gray-400 bg-transparent rounded-lg text-sm p-1.5 items-center hover:bg-gray-600 hover:text-white transition';
    // newPhotoButton.textContent = 'Upload Photo';
    newPhotoButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
    `;
    newPhotoButton.type = 'submit';
    newPhotoForm.appendChild(newPhotoButton);

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
    imageDiv.className = 'transition aspect-square hover:bg-gray-200 hover:cursor-pointer hover:shadow-md p-2 rounded-xl';
    imageContainer.appendChild(imageDiv);

    const image = document.createElement('img');
    image.className = 'rounded-xl';
    image.style = 'width: 100%; height: 100%; object-fit: cover;';
    image.src = `/static/images/${photo.id}.jpg`;
    image.id = photo.id;
    image.alt = photo.description;
    imageDiv.appendChild(image);

    image.addEventListener('click', async () => {
        await showViewModal(photo.id);
    });
}

export function showError () {
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

    const viewModalCloseButton = document.getElementById('view-modal-close-button');
    viewModalCloseButton.addEventListener('click', () => {
        closeViewModal();
        document.getElementById('view-modal-label').classList.remove('hidden');
        document.getElementById('view-modal-description-input').classList.add('hidden');
    });

    const viewModalEditButton = document.getElementById('view-modal-edit-button');
    viewModalEditButton.addEventListener('click', () => {
        document.getElementById('view-modal-label').classList.add('hidden');
        const viewModalDescriptionInput = document.getElementById('view-modal-description-input');
        viewModalDescriptionInput.classList.remove('hidden');
        viewModalDescriptionInput.focus();
    });
}

export function showViewModal (photoId) {
    loadPhoto(photoId).then(({ description }) => {
        const viewModal = document.getElementById('view-modal');
        const viewModalImage = document.getElementById('view-modal-image');
        const viewModalLabel = document.getElementById('view-modal-label');

        viewModalLabel.textContent = description;
        viewModalImage.src = `/static/images/${photoId}.jpg`;
        viewModalImage.alt = description;
        viewModal.classList.remove('hidden');

        // reset event listeners for delete and edit
        // clone the node to remove all previous event listeners
        const viewModalDeleteButton = document.getElementById('view-modal-delete-button');
        const newDeleteButton = viewModalDeleteButton.cloneNode(true);
        viewModalDeleteButton.parentNode.replaceChild(newDeleteButton, viewModalDeleteButton);
        newDeleteButton.addEventListener('click', () => {
            deletePhoto(photoId);
            closeViewModal();
        });

        const viewModalDescriptionInput = document.getElementById('view-modal-description-input');
        const newDescriptionInput = viewModalDescriptionInput.cloneNode(true);
        newDescriptionInput.value = description;

        viewModalDescriptionInput.parentNode.replaceChild(newDescriptionInput, viewModalDescriptionInput);
        newDescriptionInput.addEventListener('focusout', () => {
            newDescriptionInput.classList.add('hidden');
            viewModalLabel.classList.remove('hidden');
            editPhoto(photoId, newDescriptionInput.value, viewModalLabel);
        });
    });
}

export function closeViewModal () {
    const viewModal = document.getElementById('view-modal');
    viewModal.classList.add('hidden');
}
