import express, { application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


// connect database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.szyjjk8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // making database and collection under cluster0

        const database = client.db("cafeTerrace");
        const coffeeCollection = database.collection("coffeeCollection");
        const messageCollection = database.collection("messageCollection");
        const imageCollection = database.collection("imageCollection");
        const userCollection = database.collection("userCollection");

        // Coffe Collection

        app.get('/coffees', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/coffees', async (req, res) => {
            const coffee = req.body;
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result);
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(filter);
            res.send(result);
        })

        app.delete('/coffee/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(filter);
            res.send(result);
        })

        app.put('/coffee/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const coffee = req.body;
            const updateCoffee = {
                $set: {
                    coffeeName: coffee.coffeeName,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category,
                    details: coffee.details,
                    photo: coffee.photo,
                    price: coffee.price
                }
            }
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
            res.send(result)
        })

        // Images Collection

        app.post('/images', async (req, res) => {
            const coffee = req.body;
            const result = await imageCollection.insertOne(coffee);
            res.send(result);
        })

        // Message Collection

        app.get('/messages', async (req, res) => {
            const cursor = messageCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/messages', async (req, res) => {
            const msg = req.body;
            const result = await messageCollection.insertOne(msg);
            res.send(result);
        })

        // User Collection

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.put('/users', async (req, res)=>{
            const user = req.body;
            const options = { upsert : true};
            const filter = { email : user.email }
            const updateUser = {
                $set : {
                    displayName : user.displayName,
                    email : user.email,
                    photo : user.photo,
                    createdAt : user.createdAt,
                    lastLoggeddAt : user.lastLoggeddAt,
                    verified : user.verified,
                    role : user.role
                }
            }
            const result = await userCollection.updateOne(filter, updateUser, options);
            res.send(result);
        })

        // get user by _id (it seems server crash if u have diffrent query for same url structure, maybe some other method would do the job)
        // app.get('/user/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id : new ObjectId(id)};
        //     const result = await userCollection.findOne(filter);
        //     res.send(result);
        // })

        // get user by uid
        app.get('/user/:uid', async (req, res) => {
            const uid = req.params.uid;
            const filter = { uid : uid };
            const result = await userCollection.findOne(filter);
            res.send(result);
        })

        app.patch('/users', async (req, res)=>{
            const user = req.body;
            const filter = { email : user.email };
            const updateUser = {
                $set : {
                    lastLoggeddAt : user.lastLoggeddAt
                }
            }
            const result = await userCollection.updateOne(filter, updateUser);
            res.send(result)
        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// basic code

app.get('/', (req, res) => {
    res.send("C a f e  T e r r a c e  S e r v e r")
})

app.listen(port, () => console.log(`Server running on ${port}`))
