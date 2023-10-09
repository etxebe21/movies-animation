import { API_KEY, GENRES } from "./config";

const API_URL = 'https://api.themoviedb.org/3/movie/550?api_key=535a38d0574b48558fc561528c721bd8';

export const getMovies = async () = => {
    try{
        let response = await fetch(API_URL)
        let json = await response.json();
        const movies = json.results.map(
            ({
                id, original_title,
                poster_path,
                backdrop_path,
                vote_average,
                overview,
                release_date,
                genre_ids,
            }) => ({
                key: String(id),
                originalTitle: original_title,
                posterPath: `https://image.tmdb.org/t/p/w500${poster_path}`,
                backdropPath: `https://image.tmdb.org/t/p/w500${backdrop_path}`,
                voteAverage: vote_average,
                description: overview,
                releaseDate: release_date,
                genres: genre_ids.map(id => GENRES[id])

            })
        )
        return movies 
    } catch (error){
        console.log(error);
    }
    
}