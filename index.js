const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middlewares
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.otpes5b.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const serviceCollection = client.db('Pic&Poetry').collection('services');
        const reviewCollection = client.db('Pic&Poetry').collection('reviews');

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })
        app.get('/home', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        //review api;
        //amra ekhon review er data tare create korte chaitesi
        //so, as jhankar bhai said, eikhane post method use korte hobe
        //also reviews name ekta alada component create korar por form nite hobe, and then oita details e import korte hobe
        //jehetu review ta details button e click korle dewa jaitese already amdr details button ta ekta uniqueID, so amdr eine compare korar kichu nai duita collection er data re;(idea which i had was good but it needs too much work, and too lazy to do that)

        app.post('/reviews', async(req, res) => {
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const message = req.body.message
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set:{
                    message: message
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        }) 

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{}
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send(`Pic & Poetry is running`);
})

app.listen(port, () => {
    console.log(`Pic & Poetry is running on ${port}`);
})