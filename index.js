
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// https://git.heroku.com/serene-island-93451.g
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
        // Services api
        app.get('/services', async (req, res) => {
            const result = await serviceCollection.find({}).toArray()
            res.send(result)
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