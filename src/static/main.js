window.addEventListener('load', async () => {
    const collections = await loadCollections();
    setupListeners();
    paintCollections(collections);
});

function setupListeners () {
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

// GENERATE UI

async function paintCollections (collections) {
    collections.forEach((collection) => {
        paintCollection(collection);
    });
}

function paintCollection (collection) {
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

function paintPhoto (photo, imageContainer) {
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

// function showViewModal ()

// COMMUNICATE WITH SERVER

async function loadCollections () {
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

async function createCollection (name) {
    try {
        const res = await fetch('/api/collections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });

        paintCollection(await res.json());
    } catch {
        showError();
    }
}

async function createPhoto (collectionId, url, imageContainer) {
    fetch(`/api/collections/${collectionId}/photos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) }).then(async (res) => {
        paintPhoto(await res.json(), imageContainer);
    }).catch(() => {
        showError();
    });
}

async function deleteCollection (collectionId, collectionContainer, collectionWrapper) {
    fetch(`/api/collections/${collectionId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }).then((res) => {
        collectionContainer.removeChild(collectionWrapper);
    }).catch(() => {
        showError();
    });
}

// COMMUNICATE WITH USER

function showError (message) {
    const errorToast = document.getElementById('error-toast');
    errorToast.classList.remove('invisible');

    setTimeout(() => {
        errorToast.classList.add('invisible');
    }, 2000);
}
