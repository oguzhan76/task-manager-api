const request = require('supertest');
const { app, mongooseConnection } = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');



beforeEach(setupDatabase);

afterAll(() => {
    mongooseConnection.connection.close();
})

test('Should sign up a new user', async () => {
    const response = await request(app)
        .post('/users/signup')
        .send({
            name: "oguzhan",
            email: "oguzhan@example.com",
            password: 'myPass777!'
        }).expect(201);

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "oguzhan",
            email: "oguzhan@example.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('myPass777!');
});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(response.body.user._id);
    expect(user.tokens[1].token).toBe(response.body.token);
});

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'someemail@anan.com',
        password: 'asdoij'
    }).expect(400);
});

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
});

test('Should not delete unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/altima.jpg')
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'Oguzhan' })
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toBe('Oguzhan');
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'EBEN'})
        .expect(400);
});