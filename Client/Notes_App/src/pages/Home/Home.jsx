import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.scss";
import { FaTrash } from "react-icons/fa";

const Home = () => {
  // State for managing notes and active note
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Ref for managing text area focus
  const textareaRefs = useRef([]);

  // Fetch notes from backend on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notes");
        setNotes(response.data);
        if (response.data.length > 0) {
          setActiveNoteId(response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  // Effect to focus on active textarea
  useEffect(() => {
    const activeTextarea = textareaRefs.current.find(
      (ref) => ref && ref.dataset.id === activeNoteId?.toString()
    );
    if (activeTextarea) {
      activeTextarea.focus();
    }
  }, [activeNoteId]);

  // Function to create a new note
  const handleCreateNote = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/notes", { content: "" });
      const newNote = response.data;
      setNotes([...notes, newNote]);
      setActiveNoteId(newNote.id);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Function to handle note content change
  const handleNoteChange = async (id, value) => {
    try {
      await axios.put(`http://localhost:5000/api/notes/${id}`, { content: value });
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, content: value } : note
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Function to handle click on a note to make it active
  const handleNoteClick = (id) => {
    setActiveNoteId(id);
  };

  // Function to delete a note
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      if (updatedNotes.length > 0) {
        setActiveNoteId(updatedNotes[0].id);
      } else {
        setActiveNoteId(null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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
