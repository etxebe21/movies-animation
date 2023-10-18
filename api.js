import { API_KEY, GENRES } from "./config";

const API_URL = `https://api.themoviedb.org/3/movie/550?api_key=${API_KEY}`;

export const getMovies = async () => {
    try {
        let response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Error al cargar datos desde la API');
        }

        let json = await response.json();

        // Verifica si la propiedad 'genres' está presente en la respuesta
        if (!json.genres || !Array.isArray(json.genres)) {
            throw new Error('Los datos de la API no contienen la información de géneros esperada');
        }

        // Mapea los datos según la estructura esperada
        const movie = {
            key: String(json.id),
            originalTitle: json.original_title,
            posterPath: `https://image.tmdb.org/t/p/w500${json.poster_path}`,
            backdropPath: `https://image.tmdb.org/t/p/w500${json.backdrop_path}`,
            voteAverage: json.vote_average,
            description: json.overview,
            releaseDate: json.release_date,
            genres: json.genres.map(({ id }) => GENRES[id] || 'Unknown Genre'),
        };

        return [movie]; // Devuelve un array con la película para que coincida con la estructura de datos esperada
    } catch (error) {
        console.error("Error al obtener película:", error);
        throw error; // Re-lanza el error para que el código que llama a esta función pueda manejarlo
    }
};
