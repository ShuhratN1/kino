import React, { useEffect, useState } from "react";

const API_KEY = "c331e966af5c9e27ef3b804f938f6db3";

export default function MovieDetails({ movieId, type = "movie", onBack }) {
  const [selectedMovieId, setSelectedMovieId] = useState(movieId);
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let url =
          type === "tv"
            ? `https://api.themoviedb.org/3/tv/${selectedMovieId}?api_key=${API_KEY}&language=ru-RU`
            : `https://api.themoviedb.org/3/movie/${selectedMovieId}?api_key=${API_KEY}&language=ru-RU`;

        const res = await fetch(url);
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCredits = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${selectedMovieId}/credits?api_key=${API_KEY}&language=ru-RU`
        );
        const data = await res.json();
        setCredits(data.cast || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${selectedMovieId}/recommendations?api_key=${API_KEY}&language=ru-RU&page=1`
        );
        const data = await res.json();
        setRecommendations(data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSimilar = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${selectedMovieId}/similar?api_key=${API_KEY}&language=ru-RU&page=1`
        );
        const data = await res.json();
        setSimilar(data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
    fetchCredits();
    fetchRecommendations();
    fetchSimilar();
  }, [selectedMovieId, type]);

  if (!details) return <p className="text-white text-center mt-10">Loading...</p>;

  
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    details.title || details.name
  )}+film`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{details.title || details.name}</h1>

      <img
        src={
          details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image"
        }
        alt={details.title || details.name}
        className="w-64 h-auto mb-4 rounded-lg shadow-lg"
      />

      <p className="text-gray-300 mb-3">{details.overview}</p>
      <p className="mt-2 text-yellow-400 font-semibold">
        ⭐ {details.vote_average?.toFixed(1)}
      </p>

      
      <a
        href={googleSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
      >
        🔍 Google search
      </a>


      <h2 className="text-2xl font-bold mt-8 mb-4">🎭 Cast</h2>
      <div className="flex overflow-x-auto gap-4 mb-6">
        {credits.map((actor) => (
          <div key={actor.id} className="w-32 flex-shrink-0 text-center">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/150x225?text=No+Image"
              }
              alt={actor.name}
              className="rounded-lg mb-2"
            />
            <p className="text-sm truncate">{actor.name}</p>
          </div>
        ))}
      </div>

      
      <h2 className="text-2xl font-bold mt-6 mb-4">🍿 Recommendations</h2>
      <div className="flex overflow-x-auto gap-4 mb-6">
        {recommendations.map((movie) => (
          <div
            key={movie.id}
            className="w-40 flex-shrink-0 cursor-pointer"
            onClick={() => setSelectedMovieId(movie.id)}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title || movie.name}
              className="rounded-lg mb-2"
            />
            <p className="text-sm text-center truncate">
              {movie.title || movie.name}
            </p>
          </div>
        ))}
      </div>


      <h2 className="text-2xl font-bold mt-6 mb-4">🎬 Similar</h2>
      <div className="flex overflow-x-auto gap-4 mb-6">
        {similar.map((movie) => (
          <div
            key={movie.id}
            className="w-40 flex-shrink-0 cursor-pointer"
            onClick={() => setSelectedMovieId(movie.id)}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title || movie.name}
              className="rounded-lg mb-2"
            />
            <p className="text-sm text-center truncate">
              {movie.title || movie.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
