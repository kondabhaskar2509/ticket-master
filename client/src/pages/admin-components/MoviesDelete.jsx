import React, { useEffect, useState } from "react";

const MoviesDelete = () => {
  const [moviedata, setMoviedata] = useState([]);

  useEffect(() => {
    fetch(process.env.BACKEND + "/movies")
      .then((res) => res.json())
      .then((data) => setMoviedata(data))
      .catch(() => setMoviedata([]));
  }, []);

  const handleDeleteMovie = async (index) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      const movieId = moviedata[index].id;
      try {
        const response = await fetch(
          `${process.env.BACKEND}/movies/${movieId}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          const updatedMovies = moviedata.filter((_, i) => i !== index);
          setMoviedata(updatedMovies);
          alert("Movie deleted.");
        } else {
          alert("Failed to delete movie.");
        }
      } catch {
        alert("Failed to delete movie.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-8">
      <h2 className="text-xl font-bold mb-2 text-black">Movies</h2>
      <ul>
        {moviedata.map((movie, idx) => (
          <li
            key={movie.id}
            className="flex justify-between items-center border-b py-2">
            <span className="text-black">{movie.title}</span>
            <button
              onClick={() => handleDeleteMovie(idx)}
              className="bg-red-500 text-white px-3 py-1 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoviesDelete;
