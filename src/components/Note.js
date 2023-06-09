import React from 'react'

const Note = ({ note, toggleImportance }) => {

  const label = note.important
    ? 'Not important' 
    : 'Make important'

  return (
  <li>
    {note.content}
    <button onClick={toggleImportance}>
      {label}
    </button>
    </li>
  )
}

export default Note