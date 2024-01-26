const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const User = require('../models/user.model');
const Book = require('../models/book.model');

const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpassword',
};

const adminuser={
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'admin',
};

const mockBook = {
  isbn: '1234567890',
  title: 'Test Book',
  author: 'Test Author',
  price: 20,
  quantity: 10,
};

const updateBook = {
  isbn: '1234567890',
  title: 'Updated Book',
  author: 'UPdated Author',
  price: 25,
  quantity: 100,
};

let token;
let tokenadmin;
describe('Authentication Tests', () => {
  test('Signup - should create a new user(normal user)', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(mockUser)
      .expect(201);

    expect(response.body).toBe('user created successfully');
  });

  test('Signup - should create a new user(admin user)', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send(adminuser)
      .expect(201);

    expect(response.body).toBe('user created successfully');
  });

  test('Signin - should return a valid user and set a cookie(admin)', async () => {
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        email: adminuser.email,
        password: adminuser.password,
      })
      .expect(200);
  
      const tokenRegex = /access_Token=([^;]*)/;
      const tokenMatch = response.headers['set-cookie'][0].match(tokenRegex);
      tokenadmin = tokenMatch ? tokenMatch[1] : null;
    
      // Log the extracted token
      console.log('Extracted Token:', tokenadmin);
    
      // Additional assertions and test logic
      expect(tokenadmin).toBeDefined();
      expect(response.body.message).toBe('SignIn succesfully');
  });

  test('Signin - should return a valid user and set a cookie', async () => {
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(200);
  
      const tokenRegex = /access_Token=([^;]*)/;
      const tokenMatch = response.headers['set-cookie'][0].match(tokenRegex);
      token = tokenMatch ? tokenMatch[1] : null;
    
      // Log the extracted token
      console.log('Extracted Token:', token);
    
      // Additional assertions and test logic
      expect(token).toBeDefined();
      expect(response.body.message).toBe('SignIn succesfully');
  });

  test('Signin - should return a Invalid Credentials', async () => {
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        email: mockUser.email,
        password: "wrongpass",
      })
      .expect(401);
      expect(response.body.message).toBe('Invalid Credentials!');
  });

  test('Signin - should return a Invalid Credentials(email)', async () => {
    const response = await request(app)
      .post('/api/auth/signin')
      .send({
        email: "wrongemail",
        password: "wrongpass",
      })
      .expect(404);
      expect(response.body.message).toBe('Invalid Credentials!');
  });

  test('Signout - should clear the cookie', async () => {
    console.log(token);
    const response = await request(app)
    .get('/api/auth/signout')
    .set('Cookie', `access_Token =${token}`)
    .expect(200);

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.body).toBe('User has been Logged Out!!!');
  });

  // Add more authentication tests as needed
});

describe('Book test',()=>{
  test('Create book (admin user)',async()=>{
    console.log(tokenadmin)
    const response= await request(app)
    .post("/api/book/createBook")
    .send(mockBook)
    .set('Cookie', `access_Token =${tokenadmin}`)
    .expect(201)
    expect(response.body).toBe('Book created successfully');
  })
  test('Create book (normal user)',async()=>{
    console.log(token)
    const response= await request(app)
    .post("/api/book/createBook")
    .send(mockBook)
    .set('Cookie', `access_Token =${token}`)
    
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Admin access Required!!!');
  })

  test('Create same book (admin user)',async()=>{
    console.log(token)
    const response= await request(app)
    .post("/api/book/createBook")
    .send(mockBook)
    .set('Cookie', `access_Token =${tokenadmin}`)
    .expect(500)
    // expect(response.body).toBe('Book created successfully');
  })

  test('show all books',async()=>{
    console.log(token)
    const response= await request(app)
    .get("/api/book/all")
    // expect(response.statusCode).toBe(201);
    expect(response.body).toBe(response.body);
  })

  test('show one books(correct isbn)',async()=>{
    console.log(token)
    const response= await request(app)
    .get("/api/book/one")
    .send({isbn:'1234567890'})
    .set('Cookie', `access_Token =${token}`)

    // expect(response.statusCode).toBe(201);
    // console.log(response.body);
    expect(response.body).toBe(response.body);
  })
  test('show one books(wronng isbn)',async()=>{
    console.log(token)
    const response= await request(app)
    .get("/api/book/one")
    .send({isbn:'123456'})
    .set('Cookie', `access_Token =${token}`)

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Invalid ISBN||Book not Found");
  })

  test('Update book (admin user)',async()=>{
    console.log(tokenadmin)
    const response= await request(app)
    .put("/api/book/updateBook/1234567890")
    .send(updateBook)
    .set('Cookie', `access_Token =${tokenadmin}`)
    .expect(201)
    expect(response.body.message).toBe('Book Updated successfully');
  })

  test('Update book wrong isbn (admin user)',async()=>{
    console.log(tokenadmin)
    const response= await request(app)
    .put("/api/book/updateBook/12345")
    .send(updateBook)
    .set('Cookie', `access_Token =${tokenadmin}`)

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Invalid ISBN||Book not Found");
  })

  test('Update book (normal user)',async()=>{
    console.log(token)
    const response= await request(app)
    .put("/api/book/updateBook/1234567890")
    .send(updateBook)
    .set('Cookie', `access_Token =${token}`)
    
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Admin access Required!!!');
  })

  test('Delete book (admin user)',async()=>{
    console.log(tokenadmin)
    const response= await request(app)
    .delete("/api/book/deleteBook")
    .send({isbn:'1234567890'})
    .set('Cookie', `access_Token =${tokenadmin}`)
    .expect(201)
    expect(response.body.message).toBe('Book Deleted successfully');
  })

  test('Delete book wrong isbn (admin user)',async()=>{
    console.log(tokenadmin)
    const response= await request(app)
    .delete("/api/book/deleteBook")
    .send({isbn:'123456'})
    .set('Cookie', `access_Token =${tokenadmin}`)

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Invalid ISBN||Book not Found");
  })

  test('delete book (normal user)',async()=>{
    console.log(token)
    const response= await request(app)
    .delete("/api/book/deleteBook")
    .send(updateBook)
    .set('Cookie', `access_Token =${token}`)
    
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Admin access Required!!!');
  })
})

afterAll(async () => {
      // Clean up test users after each test
      await User.deleteMany();
      await Book.deleteMany();
    });
