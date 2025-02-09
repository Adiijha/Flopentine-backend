import express from "express";
import { getStories, createStory, voteStory, deleteStory } from "../controllers/story.controller.js";

const router = express.Router();

router.get("/", getStories);
router.post("/", createStory);
router.post("/:id/vote", voteStory);
router.delete("/:id", deleteStory); 

export default router;
