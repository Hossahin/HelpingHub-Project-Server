require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwhgf1c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const VolunteerDB = client.db("VolunteerDB");
    const userData = VolunteerDB.collection("userData");
    const VolunteerNeedPost = VolunteerDB.collection("VolunteerNeedPost");

    app.post("/signup", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await userData.insertOne(data);
      res.send({ message: "Data Insert Success", data: result });
    });

    app.post("/AddVolunteerNeedPost", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await VolunteerNeedPost.insertOne(data);
      res.send({ message: "Data Insert Success", data: result });
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server");
});

app.listen(port, () => {
  console.log(`Sever is runing on port : ${port}`);
});
