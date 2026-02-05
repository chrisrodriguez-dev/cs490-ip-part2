import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [movies, setMovies] = useState([]) 
  const [actorMovies, setActorMovies] = useState([])

  useEffect(() => {
    fetch('/api/landing-page')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies) // 2. Assuming Flask returns { "movies": ["Movie1", ...] }
        setActorMovies(data.actorMovies) // 2. Assuming Flask returns { "actorMovies": ["ActorMovie1", ...] }
      })
      .catch(err => console.error("Fetch error:", err))
  }, [])

  return (

  <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center text-white p-10">
    
    {}
    <h1 className="text-5xl font-mono mb-16 text-amber-500 tracking-normal">
      SAKILA DASHBOARD
    </h1>

    {}
    <div className="grid md:grid-cols-2 gap-20 w-full max-w-6xl">
      
      {}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold font-mono mb-6 border-b-2 pb-2">
          Top 5 Movies
        </h2>
        <ul className="text-center space-y-4">
          {movies.map((movie) => (
            <li key={movie.film_id} className="text-xl text-zinc-400 hover:text-white transition-colors">
              {movie.title}
            </li>
          ))}
        </ul>
      </div>

      {}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold font-mono mb-6 border-b-2 pb-2">
          Top 5 Actors
        </h2>
        <ul className="text-center space-y-4">
          {actorMovies.map((actor) => (
            <li key={actor.actor_id} className="text-xl text-zinc-400 hover:text-white transition-colors">
              {actor.first_name} {actor.last_name}
            </li>
          ))}
        </ul>
      </div>

    </div>
  </div>
);
}

export default App
