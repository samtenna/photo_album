// Uses snippets from documentation at: https://github.com/ladjs/supertest

const request = require('supertest');
const app = require('./server');
const { describe, test } = require('@jest/globals');

describe('Test the main page', () => {
    test('GET / succeeds', () => {
        return request(app).get('/').expect(200);
    });
});

describe('Test collections', () => {
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

    test('DELETE /collections succeeds in deleting a collection', async () => {
        return request(app)
            .delete('/api/collections/test')
            .expect(200);
    });
});
