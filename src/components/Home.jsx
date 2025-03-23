import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [expandedMovies, setExpandedMovies] = useState({}); // Track expanded descriptions

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=af2df38e8ac07bf8497711d9112557f3`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const params = {
          api_key: "af2df38e8ac07bf8497711d9112557f3",
          sort_by: sortBy,
          page: 1,
        };
        if (selectedGenre) params.with_genres = selectedGenre;

        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie`,
          { params }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, [selectedGenre, sortBy]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: "af2df38e8ac07bf8497711d9112557f3",
            query: searchQuery,
          },
        }
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const toggleReadMore = (id) => {
    setExpandedMovies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-[#0a0935] min-h-screen w-full flex flex-col items-center p-6">
      <h1 className="text-white mt-6 font-bold text-5xl">Movies Quest</h1>

      {/* Search Bar */}
      <div className="flex gap-4 mt-6 ">
        <input
          type="text"
          className="bg-white rounded-lg outline-0 p-3 text-lg w-72"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="bg-white rounded-4xl p-4 text-md cursor-pointer hover:bg-gray-200 transition"
          onClick={handleSearchSubmit}
        >
          <IoIosSearch />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-5 mt-6 sm:flex flex-col md:flex-row">
        {/* Sort By */}
        <div className="flex gap-2 items-center">
          <label className="text-white text-lg">Sort By:</label>
          <select
            className="bg-white outline-0 p-2 text-lg rounded-lg cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity.desc">Popularity Descending</option>
            <option value="popularity.asc">Popularity Ascending</option>
            <option value="vote_average.desc">Rating Descending</option>
            <option value="vote_average.asc">Rating Ascending</option>
            <option value="release_date.desc">Release Date Descending</option>
            <option value="release_date.asc">Release Date Ascending</option>
          </select>
        </div>

        {/* Genre Filter */}
        <div className="flex gap-2 items-center">
          <label className="text-white text-lg">Genre:</label>
          <select
            className="bg-white outline-0 p-2 text-lg rounded-lg cursor-pointer"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-800 p-4 rounded-lg text-white text-center shadow-lg hover:shadow-2xl transition hover:scale-105"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              className="w-40 h-60 rounded-md mx-auto"
            />
            <h2 className="text-lg mt-2 font-semibold">{movie.title}</h2>
            <p className="text-gray-400 text-sm">
              {expandedMovies[movie.id] || !movie.overview
                ? movie.overview || "No description available."
                : movie.overview.length > 100
                ? movie.overview.slice(0, 100) + "..."
                : movie.overview}
            </p>

            {/* Read More Button */}
            {movie.overview && movie.overview.length > 100 && (
              <button
                className="mt-2 text-blue-400 hover:underline text-sm"
                onClick={() => toggleReadMore(movie.id)}
              >
                {expandedMovies[movie.id] ? "Read Less" : "Read More"}
              </button>
            )}

            <p className="text-yellow-400 font-bold mt-2">⭐ {movie.vote_average}/10</p>
          </div>
        ))}
      </div>

      <footer className=" text-white text-center p-7">
  <p>&copy; {new Date().getFullYear()} MovieQuest. Aaditya Sharma</p>
</footer>
    </div>


  );
};

export default Home;
