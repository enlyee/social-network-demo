import request from 'supertest'
import { app } from '../src/settings'
import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
dotenv.config()
const adminLogin = process.env.ADMIN_LOGIN || 'admin'
const adminPass = process.env.ADMIN_PASS || 'qwerty'

const dbName = 'back'
const mongoURI = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`

describe('/users', () => {
    const client = new MongoClient(mongoURI)

    beforeAll(async () => {
        await client.connect()
        await request(app).delete('/testing/all-data').expect(204)
    })

    afterAll(async () => {
        await client.close()
    })

    it('- Should throw 401 when not admin', async () => {
        await request(app).get('/users/').expect(401)
        await request(app).post('/users/').expect(401)
        await request(app).delete('/users/123').expect(401)
    })

    it('+ Should return clear DB with default filters ', async () =>{
        await request(app).get('/users/').auth(adminLogin, adminPass).expect(200,  {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })


    it('- Should return login, email and password errors', async ()=>{
        const wrongRegistrationData = {
            login: '',
            password: '',
            email: ''
        }
        await request(app).post('/users/').auth(adminLogin, adminPass).expect(400)
    })


    // it('- POST does not create the video with incorrect data (no title, no author)', async function () {
    //     await request(app)
    //         .post('/videos/')
    //         .send({ title: '', author: '' })
    //         .expect(400, {
    //             errorsMessages: [
    //                 { message: 'title is required', field: 'title' },
    //                 { message: 'author is required', field: 'author' },
    //             ],
    //         })
    //
    //     const res = await request(app).get('/videos/')
    //     expect(res.body).toEqual([])
    // })
    //
    // it('- GET product by ID with incorrect id', async () => {
    //     await request(app).get('/videos/helloWorld').expect(400)
    // })
    // it('+ GET product by ID with correct id', async () => {
    //     await request(app)
    //         .get('/videos/')
    //         .expect(200/*, newVideo*/)
    // })
    //
    // it('- PUT product by ID with incorrect data', async () => {
    //     await request(app)
    //         .put('/videos/' + 1223)
    //         .send({ title: 'title', author: 'title' })
    //         .expect(404)
    //
    //     const res = await request(app).get('/videos/')
    //     expect(res.body[0]).toEqual(/*newVideo*/1)
    // })
    //
    // it('+ PUT product by ID with correct data', async () => {
    //     await request(app)
    //         .put('/videos/' /*+ newVideo!.id*/)
    //         .send({
    //             title: 'hello title',
    //             author: 'hello author',
    //             publicationDate: '2023-01-12T08:12:39.261Z',
    //         })
    //         .expect(204)
    //
    //     const res = await request(app).get('/videos/')
    //     expect(res.body[0]).toEqual({
    //         // ...newVideo,
    //         title: 'hello title',
    //         author: 'hello author',
    //         publicationDate: '2023-01-12T08:12:39.261Z',
    //     })
    //     // newVideo = res.body[0]
    // })
    //
    // it('- DELETE product by incorrect ID', async () => {
    //     await request(app)
    //         .delete('/videos/876328')
    //         .expect(404)
    //
    //     const res = await request(app).get('/videos/')
    //     expect(res.body[0]).toEqual(/*newVideo*/1)
    // })
    // it('+ DELETE product by correct ID, auth', async () => {
    //     await request(app)
    //         .delete('/videos/'/* + newVideo!.id*/)
    //         .set('authorization', 'Basic YWRtaW46cXdlcnR5')
    //         .expect(204)
    //
    //     const res = await request(app).get('/videos/')
    //     expect(res.body.length).toBe(0)
    // })
})
