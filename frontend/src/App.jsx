import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
    <>
      <div>
        <p>The top 5 movies are:</p>
        <ul>
          {movies.map((movie, index) => (
            // Access the 'title' property from your SQL results
            <li key={movie.film_id}>{movie.title}</li> 
          ))}
        </ul>
      </div>

      <div>
        <p>The top 5 actor are:</p>
        <ul>
          {actorMovies.map((actorMovie, index) => (
            // Access the 'title' property from your SQL results
            <li key={actorMovie.actor_id}>{actorMovie.first_name} {actorMovie.last_name}</li> 
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
