import { useState, useEffect, useRef } from "react";
import "./Home.scss";
import { FaTrash } from "react-icons/fa";

const Home = () => {
  // State for managing notes and active note
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [{ id: 1, content: "" }];
  });
  const [activeNoteId, setActiveNoteId] = useState(() => {
    const savedActiveNoteId = localStorage.getItem("activeNoteId");
    return savedActiveNoteId ? JSON.parse(savedActiveNoteId) : 1;
  });

  // Ref for managing text area focus
  const textareaRefs = useRef([]);

  // Effect to focus on active textarea and handle click outside
  useEffect(() => {
    const activeTextarea = textareaRefs.current.find(
      (ref) => ref && ref.dataset.id === activeNoteId.toString()
    );
    if (activeTextarea) {
      activeTextarea.focus();
    }

    const handleClickOutside = (event) => {
      textareaRefs.current.forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          ref.focus();
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeNoteId]);

  // Effect to save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("activeNoteId", JSON.stringify(activeNoteId));
  }, [notes, activeNoteId]);

  // Function to create a new note
  const handleCreateNote = () => {
    const newNote = { id: notes.length + 1, content: "" };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setActiveNoteId(newNote.id);
  };

  // Function to handle note content change
  const handleNoteChange = (id, value) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, content: value } : note
    );
    setNotes(updatedNotes);
  };

  // Function to handle click on a note to make it active
  const handleNoteClick = (id) => {
    setActiveNoteId(id);
  };

  // Function to delete a note
  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (activeNoteId === id && updatedNotes.length > 0) {
      setActiveNoteId(updatedNotes[0].id);
    } else {
      setActiveNoteId(null);
    }
  };

  // Rendering component
  return (
    <div className="home">
      {/* Sidebar with create button and list of notes */}
      <div className="sidebar">
        <button onClick={handleCreateNote}>Create</button>
        <ul>
          {notes.map((note) => (
            <li
              key={note.id}
              onClick={() => handleNoteClick(note.id)}
              className={note.id === activeNoteId ? "active" : ""}
            >
              <span>{note.content.substring(0, 10) || "New Note"}</span>
              <FaTrash
                className="delete-icon"
                onClick={() => handleDeleteNote(note.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Display area for notes */}
      <div className="notes">
        {notes.map((note, index) => (
          <textarea
            key={note.id}
            data-id={note.id}
            ref={(el) => (textareaRefs.current[index] = el)}
            className={`input field ${note.id === activeNoteId ? "active" : ""}`}
            value={note.content}
            onChange={(e) => handleNoteChange(note.id, e.target.value)}
            style={{ display: note.id === activeNoteId ? "block" : "none" }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
