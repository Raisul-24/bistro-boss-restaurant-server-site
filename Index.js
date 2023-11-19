const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5007

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxdrhxr.mongodb.net/?retryWrites=true&w=majority`;

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

      const menuCollection = client.db('Bistro-Boss-Restaurant').collection('menu');
      const reviewCollection = client.db('Bistro-Boss-Restaurant').collection('review');
      const cartCollection = client.db('Bistro-Boss-Restaurant').collection('cart');


      // get all menu
      app.get('/menu', async (req, res) => {
         const cursor = menuCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      });
      // get all review
      app.get('/review', async (req, res) =>{
         const cursor = reviewCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      });
// carts items
      app.get('/carts', async(req, res) =>{
         const email = req.query.email;
         const query = { email: email}
         const cursor = cartCollection.find(query);
         const result = await cursor.toArray();
         res.send(result)
      });
      // delete
      app.delete('/card/:id', async(req, res) =>{
         const id = req.params.id;
         const query = { _id: new ObjectId(id)}
         const result = await cartCollection.deleteOne(query);
         res.send(result)
      })
      // post add to cart
      app.post('/carts', async(req,res) =>{
         const cartItem = req.body;
         const result = await cartCollection.insertOne(cartItem);
         res.send(result)
      })


      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      //  await client.close();
   }
}
run().catch(console.dir);


app.get('/', (req, res) => {
   res.send('Bistro-Boss Restaurant is running!!');
})

app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
})