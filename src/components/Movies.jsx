import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import MovieDetails from "./MovieDetails.jsx";
import { Heart, Trash2 } from "lucide-react";

const API_KEY = "c331e966af5c9e27ef3b804f938f6db3";

export default function Movies({ searchQuery }) {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const usernameKey = user?.username || "guest";

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem(`favorites_${usernameKey}`)) || [];
    setFavorites(storedFavs);
  }, [usernameKey]);

  useEffect(() => {
    localStorage.setItem(`favorites_${usernameKey}`, JSON.stringify(favorites));
  }, [favorites, usernameKey]);


  useEffect(() => {
    if (!searchQuery) return;
    setMovies([]);
    setCurrentPage(1);

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=1`
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Xato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [searchQuery]);


  useEffect(() => {
    if (!searchQuery || currentPage === 1) return;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${currentPage}`
        );
        const data = await res.json();
        setMovies(prev => [...prev, ...(data.results || [])]);
      } catch (err) {
        console.error("Xato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [currentPage, searchQuery]);

  const toggleFavorite = (movie) => {
    if (favorites.some(fav => fav.id === movie.id)) {
      setFavorites(favorites.filter(fav => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

 
  if (selectedMovie) {
    return <MovieDetails movieId={selectedMovie.id} onBack={() => setSelectedMovie(null)} />;
  }

  if (showFavorites) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
        <button
          onClick={() => setShowFavorites(false)}
          className="mb-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
        >
          ⬅ Back
        </button>
        <h1 className="text-3xl font-bold mb-6">❤️ Favourite Movies</h1>
        {favorites.length === 0 ? (
          <p className="text-gray-400">No favorite movies..</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {favorites.map(movie => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition relative cursor-pointer"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setFavorites(favorites.filter(f => f.id !== movie.id));
                  }}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
                <div className="p-3">
                  <h3 className="text-lg font-semibold text-center truncate">{movie.title}</h3>
                  <p className="text-center text-yellow-400 mt-1">⭐ {movie.vote_average?.toFixed(1) || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-400 text-center">🎥 Found movies</h2>
        <button
          onClick={() => setShowFavorites(true)}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold transition"
        >
          ❤️ Favorite movies
        </button>
      </div>

      {movies.length === 0 ? (
        <p className="text-center text-gray-400">Nothing found😕</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(movie => {
              const isFavorite = favorites.some(fav => fav.id === movie.id);
              return (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 hover:shadow-yellow-500/30 transition-transform duration-300 relative"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(movie);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full ${isFavorite ? "bg-pink-600" : "bg-gray-700"}`}
                  >
                    <Heart size={20} fill={isFavorite ? "red" : "none"} className="text-white" />
                  </button>
                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-white truncate text-center">{movie.title}</h3>
                    <p className="text-sm text-yellow-400 mt-1 text-center">⭐ {movie.vote_average?.toFixed(1) || "N/A"}</p>
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

          {loading && <p className="text-center text-yellow-400 mt-4 animate-pulse">Loading movies...</p>}
        </>
      )}
    </div>
  );
}
