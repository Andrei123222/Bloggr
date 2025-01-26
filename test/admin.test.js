const request = require('supertest');
const chai = require('chai');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = require('../Server/Routes/admin');
const User = require('../Server/Models/User');

const { expect } = chai;
const app = express();
app.use(express.json());
app.use('/', router);

// Mock the database
const sandbox = require('sinon').createSandbox();
const jwt = require('jsonwebtoken');


describe('Checking admin login: POST /admin', () => {
  beforeEach(() => {
    sandbox.stub(User, 'findOne');
    sandbox.stub(bcrypt, 'compare');
    sandbox.stub(jwt, 'sign').returns('mockToken');
  });
  
  afterEach(() => {
    sandbox.restore();
  });
  
  it('should return 401 if username is not found', async () => {
    User.findOne.resolves(null);

    const res = await request(app)
      .post('/admin')
      .send({ username: 'nonexistent', password: 'password' });

    expect(res.status).to.equal(401);
    expect(res.body.message).to.equal('Could not find username');
  });

  it('should return 401 for invalid password', async () => {
    User.findOne.resolves({
      username: 'Ade',
      password: 'hashedPassword',
    });
    
    bcrypt.compare.resolves(false);
    
    const res = await request(app)
    .post('/admin')
    .send({ username: 'Ade', password: 'wrongpassword' });
    
    expect(res.status).to.equal(402);
    expect(res.body.message).to.equal('Invalid password');
  });
  
  it('should return 302 and set a cookie for valid credentials', async () => {
    hashedPassword = bcrypt.hash('deidei',10);
    User.findOne.resolves({
      username: 'Ade',
      password: hashedPassword,
    });

    bcrypt.compare.resolves(true);

    const res = await request(app)
    .post('/admin')
    .send({ username: 'Ade', password: hashedPassword });

    expect(res.status).to.equal(302);
    expect(res.headers['set-cookie']).to.not.be.empty;
  });
});

describe('POST /register', function() {
  let createStub;

  beforeEach(() => {
    createStub = sandbox.stub(User, 'create');
  });

  afterEach(() => {
    createStub.restore();
  });

  it('should create a new user and return a 201 response', async function() {
    const requestBody = {
      username: 'newuser',
      password: 'password123'
    };

    createStub.resolves({
      username: requestBody.username,
      password: 'hashedPassword' 
    });

    sandbox.stub(bcrypt, 'hash').resolves('hashedPassword');

    const res = await request(app)
      .post('/register')
      .send(requestBody);

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('User Created');
    expect(res.body.user.username).to.equal(requestBody.username);

    expect(bcrypt.hash.calledOnce).to.be.true;

  });

  it('should return a 409 if the user already exists', async function() {
    const requestBody = {
      username: 'existinguser',
      password: 'password123'
    };

    // Simulate the scenario where the user already exists
    createStub.rejects({ code: 11000 });

    const res = await request(app)
      .post('/register')
      .send(requestBody);


    expect(res.status).to.equal(409);
    expect(res.body.message).to.equal('User already in use');
  });

  it('should return a 500 if an internal server error occurs', async function() {
    const requestBody = {
      username: 'newuser',
      password: 'password123'
    };

    // Simulate a generic error during user creation
    createStub.rejects(new Error('Internal server error'));

    const res = await request(app)
      .post('/register')
      .send(requestBody);


    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal('Internal server error');
  });
});