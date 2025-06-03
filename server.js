import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import boardgames from "./data/boardgames.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/boardgames"
mongoose.connect(mongoUrl)

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// create schema and model for database
const boardgameSchema = new mongoose.Schema({
  name: String,
  id: Number,
  category: {
    type: String,
    "category": "Dice",
    enum: ["Strategy", "Family", "Cooperative", "Engine Building", "Card Drafting", "Tile Placement", "Dungeon Crawl", "Deck Building", "Party", "Horror", "Social Deduction", "Dice", "Abstract", "Asymmetrical", "Set Collection", "Mystery", "Worker Placement", "Card Game", "Cooperative"]
  },
  minPlayers: Number,
  maxPlayers: Number,
  averagePlaytime: Number,
  description: String
})

const Boardgame = mongoose.model("Boardgame", boardgameSchema)

// seed database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Boardgame.deleteMany({})
    boardgames.forEach(boardgame => {
      new Boardgame(boardgame).save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/boardgames", async (req, res) => {
  try {
    const boardgames = await Boardgame.find()
    res.json(boardgames)
  } catch (error) {
    res.status(404).json({ error: "page not found" })
  }
})

app.get("/boardgames/:id", async (req, res) => {
  // const { id } = req.params
  try {
    const boardgame = await Boardgame.findById(req.params.id)
    if (!boardgame) {
      res.status(404).json({ error: "Boardgame not found." })
    }
    res.json(boardgame)
  } catch (error) {
    res.status(400).json({ error: "Invalid id." })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
