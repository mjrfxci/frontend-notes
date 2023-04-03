import React, { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes'
import Notification from './components/Notification';
import './App.css';

function App(props) {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("Add a note...")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      id: notes.length +1,
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      }

      noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const notesToShow = showAll 
  ? notes
  : notes.filter(n => n.important === true)

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })

      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

   return (
    <div className="App">
     <h1>Notes</h1>
     <Notification message={errorMessage} />
      <ul>
      {notesToShow.map(note => (
          <Note 
          key={note.id} 
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input 
        value={newNote}
        onChange={handleNoteChange}
        />
        <button type='submit'>
          Save
        </button>
      </form>
      <div>
      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'Important' : 'All'}
      </button>
     </div>
    </div>
  );
}

export default App;
