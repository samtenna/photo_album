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

    test('POST /collections/id/photos succeeds in creating a new photo', async () => {
        return request(app)
            .post('/api/collections/test/photos')
            .send({ url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba', id: 'test' })
            .expect('Content-Type', /json/)
            .expect(200);
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

    test('GET /collections/id/photos/id succeeds in fetching a single photo', async () => {
        return request(app)
            .get('/api/collections/test/photos/test')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.body.id).toBe('test');
            });
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

    test('DELETE /collections succeeds in deleting a collection', async () => {
        return request(app)
            .delete('/api/collections/test')
            .expect(200);
    });
});
