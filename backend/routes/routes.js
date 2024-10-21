import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { register } from './schema.js'; // Assuming schema.js contains your Mongoose schema
import bcrypt from 'bcrypt';

// Initialize Express app
const app = express();
const router = express.Router();

// For file path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for parsing incoming requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MongoDB Connection Setup
const uri = "mongodb+srv://raghavmittal26113:BJihQ5ogfkMlpy3C@cluster0.upddy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// MongoDB connection and ping test
async function connectMongoDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
}

// Run MongoDB connection function
connectMongoDB();

// Routes
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/LandingPage.html')); // Homepage
});

router.post('/submit', async (req, res) => {  // Fetch of signup page
  const userData = req.body;
  console.log(userData);
  const verifyemail = userData.email;

  // Check if email already exists in the database
  const existing_user = await register.findOne({ email: verifyemail });

  if (existing_user) {
    console.log('Email already exists');
    res.send("Email already exists, Signin");
    return;
  }

  // Save new user to the database
  const newuserdata = new register({
    name: userData.name,
    email: userData.email,
    password: userData.password // Ensure password hashing is done if needed
  });

  await newuserdata.save()
    .then(() => console.log('User registered'))
    .catch((error) => console.log("Error registering: ", error));

  res.send('Data received and user registered');
});

router.post('/authenticateuser', async (req, res) => { // Fetch of signin page
  const authenticate = req.body;
  const check_email = authenticate.email;
  const verify_password = authenticate.password;

  // Check if the email exists in the database
  const verify_email = await register.findOne({ email: check_email });

  if (!verify_email) {
    res.status(400).send("Wrong E-mail or Password");
    return;
  }

  // Check password
  if (verify_password === verify_email.password) {
    res.status(200).send('Successful User');
    return;
  } else {
    console.log("Wrong e-mail or password");
    res.status(400).send("Wrong e-mail or password");
    return;
  }
});

// Initialize Express to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
