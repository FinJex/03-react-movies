import { useState } from "react";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import MovieModal from "../MovieModal/MovieModal";
import axios from "axios";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
   const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
     const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const handleSearch = async (query: string) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        {
          params: { query },
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        }
      );
setIsLoading(false);
if (response.data.results.length === 0) {
  setIsError(true);
  setMovies([]);
  return;
}
      setMovies(response.data.results);
    } catch {
      setIsError(true);
    } finally {
    setIsLoading(false);
  }
    
  };

 const handleSelect = (movie: Movie) => {
  setSelectedMovie(movie);
  setIsModalOpen(true);
};


  const closeModal = () => {
  setIsModalOpen(false);
  setSelectedMovie(null);
};

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid movies={movies} onSelect={handleSelect} />
      <Toaster />

{isModalOpen && selectedMovie && (
  <MovieModal movie={selectedMovie} onClose={closeModal} />
)}
      
    </div>
  );
}