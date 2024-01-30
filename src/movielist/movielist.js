import React, { useEffect, useState } from 'react';
import Loader from '../common/loader';
import './movielist.css';


const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOverviewId, setExpandedOverviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = '3ec8857d52eac340e379a24001cbe35f';

  useEffect(() => {

    const fetchMovies = async () => {
      try {
        setLoading(true);

        let url;

        if (searchTerm) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}&page=${currentPage}`;
        } else {
          url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${currentPage}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const debouncedFetch = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(debouncedFetch);
  }, [apiKey, currentPage, searchTerm]);

  const handleNextPage = () => {

    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleReadMoreClick = (movieId) => {
    if(movieId != expandedOverviewId){
        setExpandedOverviewId(movieId)
    }else{
        setExpandedOverviewId(null)
    }
    
  };

  return (
    <div>
      <h1 className='text'>Movie Zilla</h1>
      <form onSubmit={handleSearchSubmit}>
        
        <input className='inputsearch'
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for movies..."
        />
        <button type="submit">Search</button>
      </form>
      {loading  && <Loader />}
      <div className="movie-cards">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <h2>{movie.title}</h2>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            )}
           <p>
              {expandedOverviewId === movie.id
                ? movie.overview
                : `${movie.overview.slice(0, 150)}...`}
            </p>
            {movie.overview.length > 150 && (
              <button onClick={() => handleReadMoreClick(movie.id  )}>
                {expandedOverviewId === movie.id ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
        ))}
      </div>
     { movies.length > 0 && <div   className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous Page
        </button>
        <span className='pageNo'> Page {currentPage} </span>
        <button onClick={handleNextPage}>Next Page</button>
      </div>}
      { movies.length== 0 &&
        <div className='container found'>
        <span className='nofound' >No Movie Found</span> 
        </div>
      }
    </div>
  );
};

export default MovieList;
