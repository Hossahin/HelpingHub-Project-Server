require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 3000;

const decoded = Buffer.from(
  process.env.FIREBASE_SERVICE_KEY,
  "base64"
).toString("utf-8");
var serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://assignment-11-category-10.web.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwhgf1c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];

  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized Access!" });
  }
};

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

    app.get("/VolunteerDetails/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { volunteeremail: email };
      const result = await VolunteerDetails.find(query).toArray();
      res.send(result);
    });

    app.get(
      "/AllVolunteerNeedposts/volunteerneedpostdetailspage/:id",
      verifyJWT,
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

    app.get("/ManageMyPosts/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { organizeremail: email };
      const result = await VolunteerNeedPost.find(query).toArray();
      res.send(result);
    });

    app.post("/signup", async (req, res) => {
      const data = req.body;
      const result = await userData.insertOne(data);
      res.send({ message: "Data Insert Success", data: result });
    });

    app.post("/AddVolunteerNeedPost", verifyJWT, async (req, res) => {
      const data = req.body;
      const result = await VolunteerNeedPost.insertOne(data);
      res.send({ message: "Data Insert Success", data: result });
    });

    app.post("/VolunteerDetails", verifyJWT, async (req, res) => {
      const data = req.body;
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

    app.patch("/AllVolunteerNeedposts/:id", verifyJWT, async (req, res) => {
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

    app.delete("/VolunteerDetails/:id", verifyJWT, async (req, res) => {
      const id = req?.params?.id;
      const query = { _id: new ObjectId(id) };
      const result = await VolunteerDetails.deleteOne(query);
      res.send(result);
    });

    app.delete("/Myvolunteerneedpost/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await VolunteerNeedPost.deleteOne(query);
      res.send(result);
    });

  
  } finally {
  
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HelpingHub Server");
});

app.listen(port, () => {
  console.log(`Sever is runing on port : ${port}`);
});
