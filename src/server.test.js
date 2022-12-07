const request = require('supertest');
const app = require('./server');
const { describe, test } = require('@jest/globals');

describe('Test the home page', () => {
    test('GET / succeeds', () => {
        return request(app).get('/').expect(200);
    });
});
