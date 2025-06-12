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
    const VolunteerDetails = VolunteerDB.collection("VolunteerDetails");

    app.get("/AllVolunteerNeedposts", async (req, res) => {
      const result = await VolunteerNeedPost.find().toArray();
      res.send(result);
    });

    app.get("/AllVolunteerNeedposts/Search", async (req, res) => {
      const { searchParams } = req.query;
      let query = {};
      if (searchParams) {
        query = { posttitle: { $regex: searchParams, $options: "i" } };
      }
      const result = await VolunteerNeedPost.find(query).toArray();
      res.send(result);
    });

    app.get("/VolunteerDetails/:email", async (req, res) => {
      const email = req?.params?.email;
      console.log("VolunteerDetails", email);
      const query = { volunteeremail: email, status: "requested" };
      // const filter = { status: "requested" };
      const result = await VolunteerDetails.find(query).toArray();
      res.send(result);
    });

    // app.get("/VolunteerDetails", async (req, res) => {
    //   const result = await VolunteerDetails.find().toArray();
    //   res.send(result);
    // });

    app.get(
      "/AllVolunteerNeedposts/volunteerneedpostdetailspage/:id",
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await VolunteerNeedPost.findOne(query);
        res.send(result);
      }
    );

    app.get("/AddVolunteerNeedPost/featuresdete", async (req, res) => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const formattedToday = `${yyyy}-${mm}-${dd}`;
      const query = { startDate: { $gt: formattedToday } };
      const result = await VolunteerNeedPost.find(query)
        .sort({ startDate: 1 })
        .limit(6)
        .toArray();
      res.json(result);
    });

    app.get("/ManageMyPosts/:email", async (req, res) => {
      const email = req.params.email;
      console.log("ManageMyPosts", email);
      const query = { organizeremail: email };
      const result = await VolunteerNeedPost.find(query).toArray();
      res.send(result);
    });

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

    app.post("/VolunteerDetails", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await VolunteerDetails.insertOne(data);
      res.send({ message: "Data Insert Success", data: result });
    });

    app.put("/Myvolunteerneedposts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateMyVolunteerNeedPosts = req.body;
      const updateDoc = {
        $set: updateMyVolunteerNeedPosts,
      };
      const result = await VolunteerNeedPost.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.patch("/AllVolunteerNeedposts/:id", async (req, res) => {
      const id = req.params.id;
      const { Noofvolunteersneeded } = req.body;

      const UpdateNoofvolunteersneeded = {
        $inc: { Noofvolunteersneeded: Noofvolunteersneeded },
      };
      const filter = { _id: new ObjectId(id) };

      const result = await VolunteerNeedPost.updateOne(
        filter,
        UpdateNoofvolunteersneeded
      );
      res.send(result);
    });

    app.delete("/VolunteerDetails/:id", async (req, res) => {
      const id = req?.params?.id;
      const query = { _id: new ObjectId(id) };
      const result = await VolunteerDetails.deleteOne(query);
      res.send(result);
    });

    app.delete("/Myvolunteerneedpost/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await VolunteerNeedPost.deleteOne(query);
      res.send(result);
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
