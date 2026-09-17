# Wanderlust

Wanderlust is an Express and EJS web application for discovering, creating, editing, and reviewing travel listings.

## Features

- Browse and view travel listings
- Create, edit, and delete listings
- Upload listing images through Cloudinary
- User signup, login, and logout
- Add and delete reviews
- Mapbox location maps
- MongoDB-backed sessions and application data

## Tech Stack

- Node.js and Express
- MongoDB with Mongoose
- EJS with EJS Mate
- Passport Local authentication
- Cloudinary and Multer
- Mapbox

## Getting Started

### Prerequisites

- Node.js `22.16.0` or compatible version
- MongoDB Atlas database
- Cloudinary account
- Mapbox public access token

### Installation

```bash
git clone https://github.com/Harshilpatel0456/Wanderlust.git
cd Wanderlust
npm install
```

Create a `.env` file in the project root:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_public_token
```

Start the application:

```bash
node app.js
```

Open:

```text
http://localhost:8080
```

## Project Structure

```text
controllers/  Request handlers
models/       Mongoose models
routes/       Express routes
views/        EJS templates
public/       CSS and client-side JavaScript
utils/        Shared utilities
```

## License

This project is licensed under the ISC license.