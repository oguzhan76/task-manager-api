const request = require('supertest');
const { app, mongooseConnection } = require('../src/app');
const Task = require('../src/models/task');
const { taskOne, userOneId, userOne, userTwo, setupDatabase } = require('./fixtures/db');



beforeEach(setupDatabase);

afterAll(() => {
    mongooseConnection.connection.close();
})

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'from the test',
        })
        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should get all tasks for user', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    expect(response.body.length).toEqual(2);
});

test('Should not delete another users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);
    //be sure that the task is in db
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});