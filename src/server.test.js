// Uses snippets from documentation at: https://github.com/ladjs/supertest

const request = require('supertest');
const app = require('./server');
const { describe, test, expect } = require('@jest/globals');

describe('Test the main page', () => {
    test('GET / succeeds', () => {
        return request(app).get('/').expect(200);
    });
});

describe('Test collections and photos', () => {
    test('GET /collections succeeds', async () => {
        return request(app)
            .get('/api/collections')
            .expect(200)
            .expect('Content-Type', /json/);
    });

    test('POST /collections succeeds creating a new collection', async () => {
        return request(app)
            .post('/api/collections')
            .send({ name: 'Test', id: 'test' })
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('POST /collections fails with bad input', async () => {
        return request(app)
            .post('/api/collections')
            .expect(400);
    });

    test('POST /collections/id/photos succeeds in creating a photo', async () => {
        return request(app)
            .post('/api/collections/test/photos')
            .send({ id: 'test', description: 'test' })
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('POST /collections/id/photos fails with bad id', async () => {
        return request(app)
            .post('/api/collections/blahblahblah/photos')
            .send({ id: 'test', description: 'test' })
            .expect(404);
    });

    test('POST /collections/id/photos fails with bad input', async () => {
        return request(app)
            .post('/api/collections/test/photos')
            .expect(400);
    });

    test('GET /collections/id/photos succeeds in fetching all photos', async () => {
        return request(app)
            .get('/api/collections/test/photos')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(1);
            });
    });

    test('GET /collections/id/photos fails with bad id', async () => {
        return request(app)
            .get('/api/collections/blahblahblah/photos')
            .expect(404);
    });

    test('GET /photos/id succeeds in fetching a single photo', async () => {
        return request(app)
            .get('/api/photos/test')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.id).toBe('test');
            });
    });

    test('GET /photos/id fails with a bad id', async () => {
        return request(app)
            .get('/api/photos/blahblahblah')
            .expect(404);
    });

    test('PUT /photos/id succeeds in updating a photo', async () => {
        return request(app)
            .put('/api/photos/test')
            .send({ description: 'newdescription', collectionId: 'test' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.description).toBe('newdescription');
                expect(res.body.collectionId).toBe('test');
            });
    });

    test('PUT /photos/id fails with bad id', async () => {
        return request(app)
            .put('/api/photos/blahblahblah')
            .send({ description: 'newdescription', collectionId: 'test' })
            .expect(404);
    });

    test('PUT /photos/id fails with bad input', async () => {
        return request(app)
            .put('/api/photos/test')
            .expect(400);
    });

    test('DELETE /photos/id succeeds in deleting a photo', async () => {
        return request(app)
            .delete('/api/photos/test')
            .expect(200);
    });

    test('DELETE /photos/id fails with bad id', async () => {
        return request(app)
            .delete('/api/photos/blahblahblah')
            .expect(404);
    });

    test('GET /collections/id succeeds in selecting a single collection', async () => {
        return request(app)
            .get('/api/collections/test')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.name).toBe('Test');
                expect(res.body.id).toBe('test');
            });
    });

    test('GET /collections/id fails with bad id', async () => {
        return request(app)
            .get('/api/collections/blahblahblah')
            .expect(404);
    });

    test('PUT /collections/id succeeds in updating a collection', async () => {
        return request(app)
            .put('/api/collections/test')
            .send({ name: 'jest' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.id).toBe('test');
                expect(res.body.name).toBe('jest');
            });
    });

    test('PUT /collections/id fails with bad id', async () => {
        return request(app)
            .put('/api/collections/blahblahblah')
            .send({ name: 'jest' })
            .expect(404);
    });

    test('PUT /collections/id fails with bad input', async () => {
        return request(app)
            .put('/api/collections/test')
            .expect(400);
    });

    test('DELETE /collections/id succeeds in deleting a collection', async () => {
        return request(app)
            .delete('/api/collections/test')
            .expect(200);
    });

    test('DELETE /collections/id fails with bad id', async () => {
        return request(app)
            .delete('/api/collections/blahblahblah')
            .expect(404);
    });
});
