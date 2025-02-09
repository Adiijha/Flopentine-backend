import Story from "../models/story.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import mongoose from "mongoose";

// Get all stories
export const getStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, stories, "Stories fetched successfully"));
});

// Create a new story
export const createStory = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content cannot be empty");
  }

  const story = await Story.create({ content });
  console.log("✅ New Story Created:", story); // Debugging Log

  res.status(201).json({ data: story }); // Wrap story in { data: story }
});



// Upvote/Downvote a story
export const voteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Story ID is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid story ID." });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: "Story not found." });
    }

    if (type === "upvote") {
      story.upvotes += 1;
    } else if (type === "downvote") {
      story.downvotes += 1;
    }

    await story.save();
    res.json(story);
  } catch (error) {
    console.error("Error voting on story:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


// Delete a story (Optional for moderation)
export const deleteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const story = await Story.findByIdAndDelete(id);

  if (!story) {
    throw new ApiError(404, "Story not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Story deleted successfully"));
});
