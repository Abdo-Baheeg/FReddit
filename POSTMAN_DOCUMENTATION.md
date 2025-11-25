# FReddit API - Postman Documentation

## Overview
This document provides instructions for using the FReddit API Postman collection to test and interact with the API endpoints.

## Table of Contents
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Common Workflows](#common-workflows)

## Getting Started

### Importing the Collection

1. Open Postman
2. Click on **Import** button (top left)
3. Select the `FReddit_Postman_Collection.json` file
4. The collection will be imported with all endpoints organized by category

### Collection Structure

The collection is organized into the following folders:
- **Users** - User registration, login, and profile management
- **Posts** - Post creation, retrieval, voting, and AI summary generation
- **Comments** - Comment management and voting
- **Communities** - Community creation and membership management
- **Health Check** - API health status

## Environment Setup

### Using Collection Variables

The collection includes two variables:
- `baseUrl`: The base URL of your API (default: `http://localhost:5000`)
- `authToken`: Automatically set after successful login

### Setting Up Environment (Optional)

For better organization, you can create a Postman environment:

1. Click on **Environments** in the left sidebar
2. Create a new environment called "FReddit Local"
3. Add the following variables:
   - `baseUrl`: `http://localhost:5000`
   - `authToken`: (leave empty - auto-filled on login)

### Server Configuration

Ensure your backend server is running:
```bash
cd backend
npm install
npm start
```

The server should be running on `http://localhost:5000` by default.

## Authentication

### How Authentication Works

Most endpoints require authentication using JWT (JSON Web Token) bearer tokens.

### Getting an Auth Token

1. **Register a new user** using the "Register User" endpoint
   - OR use the "Login User" endpoint with existing credentials
2. The response will include a `token` field
3. The token is **automatically saved** to the `authToken` variable (thanks to the test script)

### Using the Auth Token

- The collection is configured to use `{{authToken}}` automatically for protected endpoints
- You can manually set it in the Authorization tab if needed

### Protected Endpoints

Endpoints marked with 🔒 require authentication:
- Create Post
- Vote on Post/Comment
- Delete Post/Comment
- Create Comment
- Create Community
- Join/Leave Community
- Get Current User
- Generate Post Summary

## API Endpoints

### Health Check
**GET** `/api/health`
- Check if the API and database are running
- No authentication required

### Users

#### Register User
**POST** `/api/users/register`
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- Creates a new user account
- Returns JWT token and user info

#### Login User
**POST** `/api/users/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Authenticates existing user
- Returns JWT token and user info
- **Auto-saves token** for subsequent requests

#### Get Current User 🔒
**GET** `/api/users/me`
- Returns the authenticated user's profile

### Posts

#### Get All Posts
**GET** `/api/posts`
- Returns up to 50 most recent posts
- Includes author information
- No authentication required

#### Get Post By ID
**GET** `/api/posts/:id`
- Returns a specific post with all details
- No authentication required

#### Create Post 🔒
**POST** `/api/posts/create`
```json
{
  "title": "My First Post",
  "content": "This is the content of my first post!",
  "subreddit": "general"
}
```
- Creates a new post
- Requires authentication

#### Vote on Post 🔒
**PUT** `/api/posts/:id/vote`
```json
{
  "voteType": "upvote"
}
```
- Vote types: `"upvote"` or `"downvote"`
- Removes previous vote if exists

#### Generate Post Summary 🔒
**PUT** `/api/posts/:id/summary`
- Uses Google Gemini AI to generate a 2-3 sentence summary
- Requires `GEMINI_API_KEY` environment variable on server
- Requires authentication

#### Delete Post 🔒
**DELETE** `/api/posts/:id`
- Only the post author can delete
- Returns success message

### Comments

#### Get Comments for Post
**GET** `/api/comments/post/:postId`
- Returns all comments for a specific post
- Sorted by newest first
- No authentication required

#### Create Comment 🔒
**POST** `/api/comments`
```json
{
  "content": "This is my comment",
  "postId": "post_id_here",
  "parentCommentId": null
}
```
- Create a comment or reply to another comment
- Set `parentCommentId` for nested replies

#### Vote on Comment 🔒
**PUT** `/api/comments/:id/vote`
```json
{
  "voteType": "upvote"
}
```
- Vote types: `"upvote"` or `"downvote"`

#### Delete Comment 🔒
**DELETE** `/api/comments/:id`
- Only the comment author can delete

### Communities

#### Get All Communities
**GET** `/api/communities/communities`
- Returns all communities
- No authentication required

#### Get Community By ID
**GET** `/api/communities/:id`
- Returns a specific community with member list

#### Create Community 🔒
**POST** `/api/communities/create`
```json
{
  "name": "tech_enthusiasts",
  "description": "A community for technology enthusiasts"
}
```
- Community name must be unique

#### Join Community 🔒
**POST** `/api/communities/:id/join`
- Adds user to community members
- Adds community to user's joined communities

#### Leave Community 🔒
**POST** `/api/communities/:id/leave`
- Removes user from community members

## Common Workflows

### Workflow 1: Register and Create a Post

1. **Register a new user** → "Register User"
   - Token is auto-saved
2. **Create a post** → "Create Post"
   - Uses the saved token automatically
3. **View your post** → "Get All Posts"

### Workflow 2: Interact with Posts

1. **Login** → "Login User"
2. **Get all posts** → "Get All Posts"
3. **Copy a post ID** from the response
4. **Upvote the post** → "Vote on Post"
   - Replace `:id` with the copied post ID
5. **Generate AI summary** → "Generate Post Summary"

### Workflow 3: Comment Thread

1. **Get a post** → "Get Post By ID"
2. **Create a comment** → "Create Comment"
   - Use the post ID, leave `parentCommentId` as `null`
3. **Copy the comment ID** from the response
4. **Reply to the comment** → "Create Comment"
   - Use the same post ID
   - Set `parentCommentId` to the copied comment ID
5. **View all comments** → "Get Comments for Post"

### Workflow 4: Community Management

1. **Create a community** → "Create Community"
2. **Join the community** → "Join Community"
3. **Create a post** in that community → "Create Post"
   - Set the `subreddit` field to your community name
4. **Leave the community** → "Leave Community"

## Error Handling

Common HTTP status codes:
- **200**: Success
- **201**: Created successfully
- **400**: Bad request (validation error or resource already exists)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (not authorized to perform action)
- **404**: Resource not found
- **500**: Server error

## Tips

1. **Use the Test Scripts**: The "Login User" request automatically saves the auth token
2. **Check Variables**: View current values in the collection variables tab
3. **Copy IDs**: Use the response JSON to copy IDs for subsequent requests
4. **Environment Variables**: For production testing, create a separate environment with production URLs
5. **Request History**: Postman saves your request history for easy re-testing

## Testing AI Features

To test the AI summary generation:
1. Ensure `GEMINI_API_KEY` is set in your backend `.env` file
2. Create a post with substantial content
3. Use "Generate Post Summary" endpoint
4. The summary will be saved to the post and returned in the response

## Troubleshooting

### "401 Unauthorized" errors
- Make sure you've logged in first
- Check that the `authToken` variable is set
- Token expires after 7 days - login again if needed

### "Cannot connect to server"
- Verify the backend server is running
- Check that `baseUrl` matches your server URL
- Ensure MongoDB is connected

### "404 Not Found"
- Double-check the ID in the URL parameter
- Make sure you're using the correct endpoint path

## Support

For issues or questions:
- Check the inline documentation in each request
- Review the backend code in `/backend/routes/`
- Ensure all dependencies are installed: `npm install`

---

**Happy Testing! 🚀**
