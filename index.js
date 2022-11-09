const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

//middlewares
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.otpes5b.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const serviceCollection = client.db('Pic&Poetry').collection('services');

        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/home', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
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