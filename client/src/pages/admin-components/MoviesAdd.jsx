import React, { useState } from "react";

const movieGenres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Sci-Fi",
  "Romance",
  "Historical",
  "Crime",
  "Adventure",
  "Animation",
];

const MoviesAdd = ({ onMovieAdded }) => {
  const [movieFormData, setMovieFormData] = useState({
    title: "",
    poster: "",
    genres: [],
    actors: [],
    writer: "",
    director: "",
    duration: 0,
    releaseYear: new Date().getFullYear(),
    description: "",
  });
  const [genreInput, setGenreInput] = useState("");
  const [actorInput, setActorInput] = useState("");

  const handleMovieInputChange = (e) => {
    const { name, value } = e.target;
    setMovieFormData({ ...movieFormData, [name]: value });
  };

  const handleAddGenre = () => {
    if (
      genreInput.trim() !== "" &&
      !movieFormData.genres.includes(genreInput) &&
      movieFormData.genres.length < 3
    ) {
      setMovieFormData({
        ...movieFormData,
        genres: [...movieFormData.genres, genreInput.trim()],
      });
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (index) => {
    const updatedGenres = [...movieFormData.genres];
    updatedGenres.splice(index, 1);
    setMovieFormData({ ...movieFormData, genres: updatedGenres });
  };

  const handleAddActor = () => {
    if (actorInput.trim() !== "") {
      setMovieFormData({
        ...movieFormData,
        actors: [...movieFormData.actors, actorInput.trim()],
      });
      setActorInput("");
    }
  };
  
  const handleRemoveActor = (index) => {
    const updatedActors = [...movieFormData.actors];
    updatedActors.splice(index, 1);
    setMovieFormData({ ...movieFormData, actors: updatedActors });
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...movieFormData,
          duration: Number(movieFormData.duration),
          releaseYear: Number(movieFormData.releaseYear),
        }),
      });
      if (response.ok) {
        alert(
          "Movie '" + movieFormData.title + "' has been added successfully!"
        );
        setMovieFormData({
          title: "",
          poster: "",
          genres: [],
          actors: [],
          writer: "",
          director: "",
          duration: 0,
          releaseYear: new Date().getFullYear(),
          description: "",
        });
        if (onMovieAdded) onMovieAdded();
      } else {
        alert("Failed to add movie.");
      }
    } catch {
      alert("Failed to add movie.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        Add New Movie
      </h2>
      <form onSubmit={handleMovieSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Movie Title</label>
            <input
              type="text"
              name="title"
              value={movieFormData.title}
              onChange={handleMovieInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Enter movie title"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Poster URL</label>
            <input
              type="url"
              name="poster"
              value={movieFormData.poster}
              onChange={handleMovieInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Enter poster URL"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={movieFormData.duration}
              onChange={handleMovieInputChange}
              required
              min="1"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Duration"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Release Year</label>
            <input
              type="number"
              name="releaseYear"
              value={movieFormData.releaseYear}
              onChange={handleMovieInputChange}
              required
              min="1900"
              max={new Date().getFullYear() + 5}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Release Year"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Director</label>
            <input
              type="text"
              name="director"
              value={movieFormData.director}
              onChange={handleMovieInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Director"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-blue-700">Writer</label>
            <input
              type="text"
              name="writer"
              value={movieFormData.writer}
              onChange={handleMovieInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
              placeholder="Writer"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-blue-700">
            Movie Genres (Select up to 3)
          </label>
          <div className="flex items-center mb-2">
            <select
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              disabled={movieFormData.genres.length >= 3}
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l border border-gray-700 placeholder-blue-300">
              <option value="">Select genre</option>
              {movieGenres
                .filter((g) => !movieFormData.genres.includes(g))
                .map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={handleAddGenre}
              disabled={!genreInput || movieFormData.genres.length >= 3}
              className="px-4 py-2 bg-blue-600 rounded-r disabled:opacity-50">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {movieFormData.genres.map((genre, index) => (
              <span
                key={index}
                className="bg-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                {genre}
                <button
                  type="button"
                  className="ml-1 text-red-400"
                  onClick={() => handleRemoveGenre(index)}>
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="text-sm text-black mt-1">
            {movieFormData.genres.length}/3 selected
          </p>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-blue-700">Actors</label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={actorInput}
              onChange={(e) => setActorInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-l border border-gray-700 placeholder-blue-300"
              placeholder="Enter actor name and click Add"
            />
            <button
              type="button"
              onClick={handleAddActor}
              className="px-4 py-2 bg-blue-600 rounded-r">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {movieFormData.actors.map((actor, index) => (
              <span
                key={index}
                className="bg-purple-800 px-2 py-1 rounded-full text-sm flex items-center">
                {actor}
                <button
                  type="button"
                  className="ml-1 text-red-400"
                  onClick={() => handleRemoveActor(index)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-blue-700">Movie Description</label>
          <textarea
            name="description"
            value={movieFormData.description}
            onChange={handleMovieInputChange}
            required
            rows="4"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 placeholder-blue-300"
            placeholder="Enter movie description"></textarea>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              if (onMovieAdded) onMovieAdded();
            }}
            className="px-5 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white">
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-green-600 rounded hover:bg-green-700 text-white">
            Add Movie
          </button>
        </div>
      </form>
    </div>
  );
};

export default MoviesAdd;
