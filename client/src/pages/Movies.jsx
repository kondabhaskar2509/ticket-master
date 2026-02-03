import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const genres = [
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

const Movies = () => {
  const navigate = useNavigate();
  const [moviedata, setMoviedata] = useState([]);

  useEffect(() => {
    fetch(process.env.BACKEND + "/movies")
      .then((res) => res.json())
      .then((data) => setMoviedata(data))
      .catch(() => setMoviedata([]));
  }, []);

  return (
    <>
      <h1 className="text-6xl font-extrabold text-center text-blue-700 pt-6 tracking-tight">
        Movie Booking
      </h1>

      {genres.map((genre, index) => (
        <div key={index}>
          <h1 className="headingmovies">-----------{genre}------------</h1>
          <div className="flex overflow-auto">
            <div className="flex justify-center">
              {moviedata
                .filter((movie) => movie.genres.includes(genre))
                .map((movie, index) => (
                  <div
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    key={index}
                    className="w-60  m-2  bg-white rounded-xl cursor-pointer">
                    <img
                      className="h-90 w-60 px-2 pt-1 rounded-2xl"
                      src={movie.poster}
                      alt=""
                    />
                    <p className="text-black font-semibold p-2 text-center  ">
                      {movie.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Movies;
