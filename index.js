
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;


// MiddleWare
app.use(cors())
app.use(express.json())


// connect to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtipi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

async function run() {
    try {
        await client.connect()
        const database = client.db('chorabali_delivery')
        const serviceCollection = database.collection('services')
        const restaurantCollection = database.collection('restaurants')
        const groceryCollection = database.collection('grocery')
        const ordersCollection = database.collection('orders')
        // Services post api
        app.post('/services', async (req, res) => {
            console.log(req.body)
            const result = await serviceCollection.insertOne(req.body)
            res.send(result)

        })

        // Services api
        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find({}).toArray()
            res.send(result)
        })

        // Services Delete Api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })

        // single Services api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.find(query).toArray()
            res.json(result)
        })

        // orders Store
        app.post('/orders', async (req, res) => {
            const result = await ordersCollection.insertOne(req.body)
            res.send(result)
        })


        //  GEt all orders of users
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray()
            res.json(result)
        })


        // get SingleUsers orders
        app.get('/orders/:email', async (req, res) => {
            const result = await ordersCollection.find({ email: req.params.email }).toArray()
            res.send(result)
        })

        //  Delete services through user
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.send(result)
            console.log(result)
        })


        // Restaurant api
        app.get('/restaurant', async (req, res) => {
            const result = await restaurantCollection.find({}).toArray()
            res.send(result)
        })


        // Grocery api
        app.get('/grocery', async (req, res) => {
            const result = await groceryCollection.find({}).toArray()
            res.send(result)
        })
    }
    finally {
        //  await client.close()
    }
}

run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Chorabali server is running ')
})

app.listen(port, () => {
    console.log('port is running on', port)
})