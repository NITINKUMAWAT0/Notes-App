import { useState, useEffect, useRef } from "react";
import "./Home.scss";
import { FaTrash } from "react-icons/fa";

const Home = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [{ id: 1, content: "" }];
  });
  const [activeNoteId, setActiveNoteId] = useState(() => {
    const savedActiveNoteId = localStorage.getItem("activeNoteId");
    return savedActiveNoteId ? JSON.parse(savedActiveNoteId) : 1;
  });
  const textareaRefs = useRef([]);

  // To keep the text field active...
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

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("activeNoteId", JSON.stringify(activeNoteId));
  }, [notes, activeNoteId]);

  const handleCreateNote = () => {
    const newNote = { id: notes.length + 1, content: "" };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setActiveNoteId(newNote.id);
  };

  const handleNoteChange = (id, value) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, content: value } : note
    );
    setNotes(updatedNotes);
  };

  const handleNoteClick = (id) => {
    setActiveNoteId(id);
  };

  //To delete the existing notes
  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (activeNoteId === id && updatedNotes.length > 0) {
      setActiveNoteId(updatedNotes[0].id);
    } else {
      setActiveNoteId(null);
    }
  };

  return (
    <div className="home">
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
      <div className="notes">
        {notes.map((note, index) => (
          <textarea
            key={note.id}
            data-id={note.id}
            ref={(el) => (textareaRefs.current[index] = el)}
            className={`input field ${
              note.id === activeNoteId ? "active" : ""
            }`}
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
