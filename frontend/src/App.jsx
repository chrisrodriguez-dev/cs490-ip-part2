import { useState, useEffect } from 'react'
import './App.css'
import Popup from './components/popup'

function App() {
  const [movies, setMovies] = useState([]) 
  const [actorMovies, setActorMovies] = useState([])
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/landing-page')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies) // 2. Assuming Flask returns { "movies": ["Movie1", ...] }
        setActorMovies(data.actorMovies) // 2. Assuming Flask returns { "actorMovies": ["ActorMovie1", ...] }
      })
      .catch(err => console.error("Fetch error:", err))
  }, [])

  function handleClick(id) {    
    fetch(`/api/film/${id}`) // Call a specific API for one film
      .then(res => res.json())
      .then(data => {
        setSelectedDetail(data);
        setOpen(true);
      });
  }

  function handleActorClick(actorId) {
    fetch(`/api/actor/${actorId}`) // New endpoint for actor details
      .then(res => res.json())
      .then(data => {
        setSelectedDetail({ ...data, type: 'actor' }); // Add a 'type' flag
        setOpen(true);
    });
  }

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
          Top 5 Movies <p className="text-sm text-zinc-500">Click on a title to see more!</p>
        </h2>
        <ul className="text-center space-y-4">
          {movies.map((movie) => (
            <li key={movie.film_id} className="text-xl text-zinc-400 hover:text-white transition-colors">
                <button onClick={() => {handleClick(movie.film_id); setOpen(true);}}>
                  {movie.title}
                </button> 
            </li>

          ))}
        </ul>
      </div>

      {}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold font-mono mb-6 border-b-2 pb-2">
          Top 5 Actors <p className="text-sm text-zinc-500">Click on an actor to see more!</p>
        </h2>
        <ul className="text-center space-y-4">
          {actorMovies.map((actor) => (
            <li key={actor.actor_id} className="text-xl text-zinc-400 hover:text-white transition-colors">
              <button onClick={() => handleActorClick(actor.actor_id)}>
                {actor.first_name} {actor.last_name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    {}

    <Popup open={open} onClose={() => setOpen(false)}>
        {selectedDetail && (
          <div>
            <h3 className="text-2xl text-black">{selectedDetail.title}</h3>
            <br></br>
            <p className="text-black">{selectedDetail.description}</p>
            <p className="text-black font-mono italic">Released in {selectedDetail.release_year}</p>
            <p className="text-black font-mono italic">Rating: {selectedDetail.rating}</p>
            <p className="text-black font-mono italic">Special Features: {selectedDetail.special_features}</p>
            <p className="text-black font-mono italic">Length: {selectedDetail.length} minutes</p>
          </div>
        )}
    </Popup>

  </div>

);
}

export default App