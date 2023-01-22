import { setupListeners, paintCollections } from './ui.js';
import { loadCollections } from './requests.js';

window.addEventListener('load', async () => {
    const collections = await loadCollections();
    setupListeners();
    paintCollections(collections);
});
