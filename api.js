import { API_KEY, GENRES } from "./config";

export const getMovies = async () => {
    try {
        const API_URL = `https://rickandmortyapi.com/api/character/?page=19`;
        let response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Error al cargar datos desde la API');
        }

        let json = await response.json();

        // Verifica si la propiedad 'results' está presente en la respuesta
        if (!json.results || !Array.isArray(json.results)) {
            throw new Error('Los datos de la API no contienen la información de películas esperada');
        }

        
        const movies = json.results.map((movie, index) => ({
            key: `${movie.name}-${index}`, // Usamos el nombre del pokémon y su índice como clave única
            name: movie.name,
            image: movie.image,
            type: movie.type,
            status: movie.status,
            species: movie.species
          }));

        //console.log(movies);
        return movies; 
    } catch (error) {
        console.error("Error al obtener películas:", error);
        throw error;
    }
};
