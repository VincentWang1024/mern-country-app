const request = require('supertest');
const app = require('../server'); // Import the app you want to test

const url='http://localhost:2000'

describe('API Endpoints', () => {


  // Test user data
const testUserData = {
    username: 'testuser',
    password: 'testpassword',
  };
  
  // Helper function to remove test user
  async function removeTestUser() {
    await user.deleteOne({ username: testUserData.username });
  }
  
  // Remove test user before and after each test
  beforeEach(removeTestUser);
  afterEach(removeTestUser);
  
  test('POST /register', async () => {
    const response = await request(app)
      .post('/register')
      .send(testUserData);
  
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', true);
    expect(response.body).toHaveProperty('title', 'Registered Successfully.');
  });

    // Test the login endpoint
    test('POST /login', async () => {
        // First, register the test user
        await request(app)
          .post('/register')
          .send(testUserData);
      
        // Now, try to log in with the test user
        const response = await request(app)
          .post('/login')
          .send(testUserData);
      
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('message', 'Login Successfully.');
        expect(response.body).toHaveProperty('token');
      });


  // Test the "/" endpoint
  test('GET /', async () => {
    const response = await request(url).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('title', 'Apis');
  });
});

// module.exports = app;
