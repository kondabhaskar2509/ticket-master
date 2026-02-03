import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BACKEND } from "../config/env";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const { status } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${BACKEND}/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch(() => setMovie(null));
  }, [id]);

  if (!movie) {
    return (
      <div className="text-center text-black p-8">Loading movie details...</div>
    );
  }

  const handleBookMyTicket = () => {
    if (status != "success") {
      alert("Login to book the ticket");
      navigate("/login");
      return;
    }
    navigate("/movie-theatres", {
      state: { movieDetails: movie, bookingType: "movie" },
    });
  };

  return (
    <div className="h-[90vh]  flex flex-col items-center justify-center p-8">
      <div className="w-350 flex flex-col md:flex-row items-center  rounded-3xl  p-8 gap-12 ">
        <img
          className="w-120 h-180  object-cover rounded-2xl shadow-lg border-4 border-blue-700"
          src={movie.poster}
          alt=""
        />

        <div className="flex flex-col gap-10 w-full">
          <h1 className="text-5xl h-20  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600  via-pink-500 to-yellow-400  mb-4">
            {movie.title}
          </h1>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Genres :
            </span>
            {movie.genres &&
              Array.isArray(movie.genres) &&
              movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="ml-4 text-2xl text-gray-200 bg-blue-900/40 px-3 py-1 rounded-full">
                  {genre}
                </span>
              ))}
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Writer :
            </span>
            <span className="ml-4 text-2xl text-gray-200">{movie.writer}</span>
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Director :
            </span>
            <span className="ml-4 text-2xl text-gray-200">
              {movie.director}
            </span>
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Movie Duration :
            </span>
            <span className="ml-4 text-2xl text-gray-200">
              {movie.duration} Minutes
            </span>
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Release Year :
            </span>
            <span className="ml-4 text-2xl text-gray-200">
              {movie.releaseYear}
            </span>
          </div>

          <div>
            <span className="text-3xl font-semibold text-blue-500">
              Description :
            </span>
            <span className="ml-4 text-2xl text-gray-200">
              {movie.description}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={handleBookMyTicket}
        className="mt-12 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-2xl font-bold rounded-full shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200">
        Show Movie Theatres
      </button>
    </div>
  );
};

export default MovieDetails;
