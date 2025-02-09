import Story from "../models/story.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";

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
  res.status(201).json(new ApiResponse(201, story, "Story created successfully"));
});

// Upvote/Downvote a story
export const voteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // type = "upvote" or "downvote"

  if (!["upvote", "downvote"].includes(type)) {
    throw new ApiError(400, "Invalid vote type");
  }

  const update = type === "upvote" ? { $inc: { upvotes: 1 } } : { $inc: { downvotes: 1 } };
  const story = await Story.findByIdAndUpdate(id, update, { new: true });

  if (!story) {
    throw new ApiError(404, "Story not found");
  }

  res.status(200).json(new ApiResponse(200, story, `Story ${type}d successfully`));
});

// Delete a story (Optional for moderation)
export const deleteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const story = await Story.findByIdAndDelete(id);

  if (!story) {
    throw new ApiError(404, "Story not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Story deleted successfully"));
});
