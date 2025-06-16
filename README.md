# HelpingHub Server

## Overview

This backend server supports HelpingHub, a volunteer management platform. It provides RESTful APIs for managing volunteer posts, user details, and authentication, enabling full CRUD operations with secure access.

## Tech Stack

- Node.js with Express  
- MongoDB  
- Firebase Admin SDK  
- CORS  
- dotenv  

## API Endpoints

### Volunteer Posts

- `GET /AllVolunteerNeedposts`  
  Retrieve all volunteer need posts.

- `GET /AllVolunteerNeedposts/Search`  
  Search volunteer posts by query.

- `GET /AllVolunteerNeedposts/volunteerneedpostdetailspage/:id`  
  Get details of a volunteer post by ID.

- `GET /AddVolunteerNeedPost/featuresdete`  
  Get featured data related to volunteer posts.

- `GET /ManageMyPosts/:email`  
  Get all posts created by a user (by email).

- `POST /AddVolunteerNeedPost`  
  Create a new volunteer need post.

- `PUT /Myvolunteerneedposts/:id`  
  Full update of a volunteer post by ID.

- `PATCH /AllVolunteerNeedposts/:id`  
  Partial update of a volunteer post by ID.

- `DELETE /Myvolunteerneedpost/:id`  
  Delete a volunteer post by ID.

### Volunteer User Details

- `GET /VolunteerDetails/:email`  
  Get volunteer details by user email.

- `POST /VolunteerDetails`  
  Add volunteer details.

- `DELETE /VolunteerDetails/:id`  
  Delete volunteer detail by ID.

### Authentication

- `POST /signup`  
  Register a new user.
