import { API_KEY, GENRES } from "./config";

export const getMovies = async () => {
    try {
        const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
        let response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Error al cargar datos desde la API');
        }

        let json = await response.json();

        // Verifica si la propiedad 'results' está presente en la respuesta
        if (!json.results || !Array.isArray(json.results)) {
            throw new Error('Los datos de la API no contienen la información de películas esperada');
        }

        
        const movies = json.results.map(movie => ({
            key: String(movie.id),
            originalTitle: movie.original_title,
            posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            backdropPath: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            voteAverage: movie.vote_average,
            description: movie.overview,
            releaseDate: movie.release_date,
            genres: movie.genre_ids.map(id => GENRES[id] || 'Unknown Genre'),
        }));

        //console.log(movies);
        return movies; 
    } catch (error) {
        console.error("Error al obtener películas:", error);
        throw error;
    }
};
