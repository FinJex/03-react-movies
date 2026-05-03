import { useState } from "react";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";


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
    const movies = await fetchMovies(query); 

    if (movies.length === 0) {
      toast.error("No movies found for your request.");
      setMovies([]);
      return;
    }

    setMovies(movies);
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