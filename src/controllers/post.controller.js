import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'

import { ApiResponse } from '../utils/ApiResponse.js'
import {Post} from '../models/post.model.js'
const createPost = asyncHandler(async (req, res) => {
    const {title, description, budget, category} = req.body;
    const userId = req.user._id;
    console.log(userId)
    if(
        [title, description, budget, category].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")  
    }
    const post = await Post.create({
        title,
        description,
        budget,
        category,
        client: userId,
        tags: req.body.tags.split(',').map((tag)=> tag.trim())
    })
    if(!post){
        throw new ApiError(500, "Post not created")
    }
    return res.status(201).json(new ApiResponse(201, post, "Post created successfully"))
})
const myPost = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // console.log(userId)
    const posts = await Post.find({client: userId}).sort({createdAt: -1})
    if(!posts){
        throw new ApiError(404, "No post found")
    }
    return res.status(200).json(new ApiResponse(200, "Posts found",  posts))
})
const allPost = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('client','-password').sort({createdAt: -1})
    if(!posts){
        throw new ApiError(404, "No post found")
    }
    return res.status(200).json(new ApiResponse(200, "Posts found",  posts))
})

// const bookmarkedPost = asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const postId = req.body.postId;
    
//     const user = await User.findById(userId);

//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     if (user.bookmarkedPosts.includes(postId)) {
//         return res.status(400).json({ message: "Post already bookmarked" });
//     }

//     // Add the postId to the bookmarkedPosts array
//     user.bookmarkedPosts.push(postId);

//     // Save the updated user document
//     await user.save();

//     res.status(200).json(
//         new ApiResponse(200,{bookmarkedPosts: user.bookmarkedPosts}, "Post bookmarked")
//     );
// })

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    if(!post){
        throw new ApiError(404, "Post not found")
    }
    return res.status(200).json(new ApiResponse(200, "Post deleted",  {message: "Post deleted"}))
})
export {
    createPost,
    myPost,
    allPost,
    deletePost
}