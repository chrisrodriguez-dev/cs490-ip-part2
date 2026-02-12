import './App.css'
import { useState, useEffect } from 'react'


function FilmDetails(){
    useEffect(() => {
    fetch('/api/landing-page')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies || [])
        setActorMovies(data.actorMovies || [])
      })
      .catch(err => console.error("Fetch error:", err))
  }, [])
  return(
        <h1>This will be the films detail page!!!</h1>
  )
}
  export default FilmDetails;