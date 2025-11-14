import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieDetails from "./MovieDetails.jsx";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "../AuthContext.jsx";

const API_KEY = "c331e966af5c9e27ef3b804f938f6db3";

export default function PopularMovies() {
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
    if (user) {
      const storedFavs =
        JSON.parse(localStorage.getItem(`favorites_${usernameKey}`)) || [];
      setFavorites(storedFavs);
    }
  }, [usernameKey, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `favorites_${usernameKey}`,
        JSON.stringify(favorites)
      );
    }
  }, [favorites, usernameKey, user]);

  const fetchMovies = async (page = 1, query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=${page}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
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
    fetchMovies(1, searchQuery);
  }, [searchQuery]);

  const toggleFavorite = (movie) => {
    if (!user) return alert("You must be logged in");
    let updated;
    if (favorites.some((fav) => fav.id === movie.id)) {
      updated = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      updated = [...favorites, movie];
    }
    setFavorites(updated);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMovies(nextPage, searchQuery);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
        <button
          onClick={() => setShowFavorites(false)}
          className="mb-6 flex items-center gap-2 px-5 py-2 bg-purple-700 hover:bg-purple-800 rounded-xl transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-4xl font-bold mb-6 text-center text-pink-500">
          ❤️ Favourite Movies
        </h1>
        {favorites.length === 0 ? (
          <p className="text-gray-400 text-center">No favorite movies 😢</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-pink-500/30 transition transform hover:scale-105 cursor-pointer relative"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = favorites.filter(
                      (f) => f.id !== movie.id
                    );
                    setFavorites(updated);
                  }}
                  className="absolute top-3 right-3 bg-gray-700 hover:bg-red-600 text-white rounded-full p-2"
                >
                  <Trash2 size={18} />
                </button>
                <div className="p-3 text-center">
                  <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                  <p className="text-yellow-400 mt-1">
                    ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg transition"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h2 className="text-3xl font-bold text-yellow-400 text-center flex-1">
          {searchQuery ? `🎯 Search Results for "${searchQuery}"` : "🔥 Popular Movies"}
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
          placeholder="🔍 Search movies..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyUp={() => setSearchQuery(searchInput)}
          className="w-full px-5 py-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
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

      {loading ? (
        <p className="text-center text-gray-400 mt-10">⏳ Loading...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">No movies found 😕</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => {
              const isFavorite = favorites.some((fav) => fav.id === movie.id);
              return (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/20 cursor-pointer transform hover:scale-105 transition duration-300 relative"
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
                    <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
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
        </>
      )}
    </div>
  );
}
