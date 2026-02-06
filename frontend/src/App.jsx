import { useState, useEffect } from 'react'
import './App.css'
import Popup from './components/popup'

function App() {
  const [movies, setMovies] = useState([])  // This state is used for storing the top 5 movies
  const [actorMovies, setActorMovies] = useState([]) // This state is used for storing the top 5 actors
  const [selectedDetail, setSelectedDetail] = useState(null); // This state is for storing details of selected movie
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
    fetch(`/api/film/${id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedDetail(data); // Set the object directly
        setOpen(true);
      });
  }

  function handleActorClick(actorId) {
    fetch(`/api/actor/${actorId}`)
      .then(res => res.json())
      .then(data => {
        setSelectedDetail(data); // Set the array directly
        setOpen(true);
    });
  }

  return (

  <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center text-white p-10">
    <h1 className="text-5xl font-mono mb-16 text-amber-500 tracking-normal">SAKILA DASHBOARD</h1>
      <div className="grid md:grid-cols-2 gap-20 w-full max-w-6xl">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold font-mono mb-6 border-b-2 pb-2">
            Top 5 Movies <p className="text-sm text-zinc-500">Click on a title to see more!</p>
          </h2>
          <ul className="text-center space-y-4">
            {movies.map((movie) => (
              <li key={movie.film_id} className="text-xl text-zinc-400 hover:text-white transition-colors">
                <button onClick={() => {handleClick(movie.film_id); }}>
                  {movie.title}
                </button> 
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold font-mono mb-6 border-b-2 pb-2">
            Top 5 Actors <p className="text-sm text-zinc-500">Click on an actor to see more!</p>
          </h2>
          <ul className="text-center space-y-4">
            {actorMovies.map((actor) => (
              <li key={actor.actor_id} className="text-xl text-zinc-400 hover:text-white transition-colors">
                <button onClick={() => {handleActorClick(actor.actor_id);}}>
                  {actor.first_name} {actor.last_name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>


      <Popup open={open} onClose={() => setOpen(false)}>
        {selectedDetail && (
          <div className="text-black p-4 relative">
            {Array.isArray(selectedDetail) ? (
              /* Actor Movie List */
              <>
              <p className="text-xl font-bold mb-4">{selectedDetail[0].first_name} {selectedDetail[0].last_name} APPEARED IN: </p>
                <ul className="mt-4 space-y-2 list-disc list-inside">
                {selectedDetail.map((movie, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-bold">{movie.title}</span>{' '}({movie.release_year})
                    <span className="text-zinc-600 ml-2">- {movie.total_rentals} rentals</span>
                  </li>
                ))}
              </ul>
              </>

            ) : (
              /* Single Movie Details */
              <div>
                <h3 className="text-2xl font-bold mb-2">{selectedDetail.title}</h3>

                <p className="mb-4">{selectedDetail.description}</p>

                <div className="text-sm font-mono space-y-1 italic">
                  <p>Released: {selectedDetail.release_year}</p>
                  <p>Special Features: {selectedDetail.special_features}</p>
                  <p>Rating: {selectedDetail.rating}</p>
                  <p>Length: {selectedDetail.length} mins</p>
                  <p>Category: {selectedDetail.category}</p>
                </div>
              </div>
            )}

            {/* Close button */}
            <button onClick={() => setOpen(false)}className="mt-6 bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 block ml-auto">Close</button>
          </div>
        )}
      </Popup>
    </div>
  );
}

export default App