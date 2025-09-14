// // fetchMovies.js
// import fs from "fs";

// const API_KEY = "2d0ebd2fb435159efcf87e831b77bc55"; // 🔹 Replace with your TMDB API key
// const BASE_URL = "https://api.themoviedb.org/3";

// async function getMovies() {
//   const movies = [];

//   for (let page = 1; page <= 3; page++) {
//     const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
//     const data = await res.json();

//     for (const movie of data.results) {
//       const detailsRes = await fetch(
//         `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&append_to_response=credits,videos`
//       );
//       const detailData = await detailsRes.json();

//       // director
//       const director = detailData.credits.crew.find((p) => p.job === "Director");

//       // top 5 cast with profile image
//       const cast = detailData.credits.cast.slice(0, 5).map((actor) => ({
//         name: actor.name,
//         profileUrl: actor.profile_path
//           ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
//           : null,
//       }));

//       // first official trailer (YouTube)
//       const trailer = detailData.videos.results.find(
//         (v) => v.type === "Trailer" && v.site === "YouTube"
//       );

//       movies.push({
//         title: detailData.title,
//         description: detailData.overview || "No description available",
//         genres: detailData.genres.map((g) => g.name),
//         releaseYear: detailData.release_date ? detailData.release_date.split("-")[0] : "N/A",
//         director: director ? director.name : "Unknown",
//         cast,
//         posterUrl: detailData.poster_path
//           ? `https://image.tmdb.org/t/p/w500${detailData.poster_path}`
//           : null,
//         trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
//       });

//       if (movies.length >= 50) {
//         fs.writeFileSync("movies.json", JSON.stringify(movies, null, 2));
//         console.log("✅ Saved 50 movies to movies.json");
//         return;
//       }
//     }
//   }
// }

// getMovies().catch((err) => console.error(err));



const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Movie = require('../models/movie'); 

// Read movies.json file
const moviesData = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const seedMovies = async () => {
  try {
    await connectDB();

    // Clear existing movies (optional)
    console.log('🗑️ Clearing existing movies...');
    await Movie.deleteMany({});

    // Insert movies from JSON file
    console.log('🌱 Seeding movies...');
    await Movie.insertMany(moviesData);

    console.log(`${moviesData.length} movies seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedMovies();
}

module.exports = { seedMovies };
