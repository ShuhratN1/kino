import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieDetails from "./MovieDetails.jsx";
import { Heart, Trash2 } from "lucide-react";
import { useAuth } from "../AuthContext.jsx";

const API_KEY = "c331e966af5c9e27ef3b804f938f6db3";

export default function Multfilms() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const usernameKey = user?.username || "guest";

  useEffect(() => {
    const storedFavs =
      JSON.parse(localStorage.getItem(`favorites_${usernameKey}`)) || [];
    setFavorites(storedFavs);
  }, [usernameKey]);

  useEffect(() => {
    localStorage.setItem(
      `favorites_${usernameKey}`,
      JSON.stringify(favorites)
    );
  }, [favorites, usernameKey]);

  const fetchMultfilms = async (page = 1, query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&with_genres=16&language=en-US&page=${page}`
        : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16&language=en-US&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();

      if (page === 1) setMovies(data.results || []);
      else setMovies((prev) => [...prev, ...(data.results || [])]);

      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMultfilms(1, searchQuery);
  }, [searchQuery]);

  const toggleFavorite = (movie) => {
    if (!user) return alert("You must be logged in");

    const updated = favorites.some((fav) => fav.id === movie.id)
      ? favorites.filter((fav) => fav.id !== movie.id)
      : [...favorites, movie];

    setFavorites(updated);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMultfilms(nextPage, searchQuery);
    }
  };

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  if (selectedMovie) {
    return (
      <MovieDetails
        movieId={selectedMovie.id}
        onBack={() => setSelectedMovie(null)}
      />
    );
  }

  if (showFavorites) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-pink-900 to-gray-900 text-white p-6">
        <div className="max-w-[1200px] mx-auto px-4">
          <button
            onClick={() => setShowFavorites(false)}
            className="mb-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            ⬅ Back
          </button>

          <h1 className="text-3xl font-bold mb-6 text-center">
            ❤️ Favourite Cartoons
          </h1>

          {favorites.length === 0 ? (
            <p className="text-gray-400 text-center">No favorite cartoons 😢</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {favorites.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition relative cursor-pointer"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = favorites.filter((f) => f.id !== movie.id);
                      setFavorites(updated);
                    }}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-center truncate">
                      {movie.title}
                    </h3>
                    <p className="text-center text-yellow-400 mt-1">
                      ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-pink-800 to-gray-900 text-white p-8">
      {/* CONTAINER */}
      <div className="max-w-[1200px] mx-auto px-4">

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            ⬅ Back
          </button>

          <h2 className="text-3xl font-bold text-yellow-400 text-center flex-1">
            🎞 Cartoons
          </h2>

          <button
            onClick={() => setShowFavorites(true)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition"
          >
            ❤️ Favourite
          </button>
        </div>

        <div className="flex justify-center mb-8 relative w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="🔍 Search cartoons..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={() => setSearchQuery(searchInput)}
            className="w-full px-5 py-3 rounded-full bg-gray-800 text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white text-lg"
            >
              ×
            </button>
          )}
        </div>

        {movies.length === 0 ? (
          <p className="text-center text-gray-300 mt-10 animate-pulse">
            ⏳ Loading cartoons...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => {
                const isFavorite = favorites.some((fav) => fav.id === movie.id);
                return (
                  <div
                    key={movie.id}
                    className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer 
                               hover:scale-105 hover:shadow-yellow-400/30 transition-transform duration-300 relative"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "https://via.placeholder.com/500x750?text=No+Image"
                      }
                      alt={movie.title}
                      className="w-full h-80 object-cover"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(movie);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        isFavorite ? "bg-pink-600" : "bg-gray-700"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={isFavorite ? "red" : "none"}
                        className="text-white"
                      />
                    </button>

                    <div className="p-3 text-center">
                      <h3 className="text-lg font-semibold truncate">
                        {movie.title}
                      </h3>
                      <p className="text-yellow-400 mt-1">
                        ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentPage < totalPages && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                >
                  Load More
                </button>
              </div>
            )}

            {loading && (
              <p className="text-center text-yellow-400 mt-4 animate-pulse">
                Loading...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
