const request = require('supertest');
const app = require('../index.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const mongoose = require( 'mongoose');
const dotenv = require("dotenv");
dotenv.config();

jest.mock('../models/book.model.js');


let adminToken;
let userToken;

beforeAll(async () => {
  // Create a test admin user
  const hashpasswordadmin = bcryptjs.hashSync("admin", 12);
  const adminUser = new User({
    username: 'admin',
    email: 'admin@gmail.com',
    password: hashpasswordadmin
  });
  await adminUser.save();

  // Create a test regular user
  const hashpassworduser = bcryptjs.hashSync("regularuser", 12);
  const regularUser = new User({
    username: 'regularuser',
    email: "regularuser@gmail.com",
    password: hashpassworduser
  });
  await regularUser.save();

  // Generate JWT tokens for admin and regular users
  const adminPayload = { id: adminUser._id, username: adminUser.username };
  adminToken = jwt.sign(adminPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

  const userPayload = { id: regularUser._id, username: regularUser.username };
  userToken = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
});

describe('Book Controller Tests', () => {
  it('should create a new book (admin)', async () => {
    const response = await request(app)
      .post('/book/createBook')
      .set('Cookie', [`access_Token=${adminToken}`])
      .send({ isbn: '1234567890', title: 'Test Book', author: 'Test Author', price: 20, quantity: 5 });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual("Book created successfully");
  });

  it('should not create a new book (regular user)', async () => {
    const response = await request(app)
      .post('/book/createBook')
      .set('Cookie', [`access_Token=${userToken}`])
      .send({ isbn: '1234567890', title: 'Test Book', author: 'Test Author', price: 20, quantity: 5 });

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toEqual("Admin access Required!!!");
  });

  it('should get all books (regular user)', async () => {
    const response = await request(app)
      .get('/book/all')
      .set('Cookie', [`access_Token=${userToken}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get one book by ISBN (regular user)', async () => {
    const response = await request(app)
      .get('/book/one')
      .set('Cookie', [`access_Token=${userToken}`])
      .send({ isbn: '1234567890' });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe('Test Book');
  });

  it('should update a book by ISBN (admin)', async () => {
    const response = await request(app)
      .put('/book/updateBook/1234567890')
      .set('Cookie', [`access_Token=${adminToken}`])
      .send({ title: 'Updated Book', author: 'Updated Author', price: 25, quantity: 10 });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Book Updated successfully');
  });

  it('should not update a book by ISBN (regular user)', async () => {
    const response = await request(app)
      .put('/book/updateBook/1234567890')
      .set('Cookie', [`access_Token=${userToken}`])
      .send({ title: 'Updated Book', author: 'Updated Author', price: 25, quantity: 10 });

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('Admin access Required!!!');
  });

  it('should delete a book by ISBN (admin)', async () => {
    const response = await request(app)
      .delete('/book/deleteBook')
      .set('Cookie', [`access_Token=${adminToken}`])
      .send({ isbn: '1234567890' });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Book Deleted successfully');
  });

  it('should not delete a book by ISBN (regular user)', async () => {
    const response = await request(app)
      .delete('/book/deleteBook')
      .set('Cookie', [`access_Token=${userToken}`])
      .send({ isbn: '1234567890' });

    expect(response.statusCode).toBe(403);
    expect(response.body.error).toBe('Admin access Required!!!');
  });

  afterEach(async () => {
    // Clean up test users after each test
    await User.deleteMany();
  });
});
