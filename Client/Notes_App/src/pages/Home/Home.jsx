import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.scss";
import { FaTrash } from "react-icons/fa";

const Home = () => {
  const [notes, setNotes] = useState([]); // State for managing notes
  const [activeNoteId, setActiveNoteId] = useState(null); // State for managing active note
  const textareaRefs = useRef([]); // Ref for managing text area focus
  const titleRefs = useRef([]); // Ref for managing title input focus

  // Fetch notes from backend on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notes");
        setNotes(response.data);
        if (response.data.length > 0) {
          setActiveNoteId(response.data[0].id); // Set the active note to the first note if notes exist
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  // Effect to focus on active input (title or textarea) when activeNoteId changes
  useEffect(() => {
    const activeTitleInput = titleRefs.current.find(
      (ref) => ref && ref.dataset.id === activeNoteId?.toString()
    );
    if (activeTitleInput) {
      activeTitleInput.focus(); // Focus on the active title input
    }
  }, [activeNoteId]);

  // Function to create a new note
  const handleCreateNote = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/notes", {
        title: "",
        content: "",
      });
      const newNote = response.data;
      setNotes([...notes, newNote]); // Add the new note to the notes array
      setActiveNoteId(newNote.id); // Set the active note to the newly created note
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleNoteChange = async (id, key, value) => {
    try {
      console.log('Updating note:', id, key, value);
      const response = await axios.put(`http://localhost:5000/api/notes/${id}`, { [key]: value });
      console.log('Response:', response.data); // Log response data
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, [key]: value } : note
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error(`Error updating note ${key}:`, error);
    }
  };
  
  
  // Function to handle click on a note to make it active
  const handleNoteClick = (id) => {
    setActiveNoteId(id); // Set the active note to the clicked note
  };

  // Function to delete a note
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes); // Update the notes array by removing the deleted note
      if (updatedNotes.length > 0) {
        setActiveNoteId(updatedNotes[0].id); // Set the active note to the first note if notes exist
      } else {
        setActiveNoteId(null); // Set activeNoteId to null if no notes are left
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

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
              data-id={note.id}
            >
              <span>{note.title || "New Note"}</span>
              <FaTrash
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Display area for notes */}
      <div className="notes">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className={`note ${note.id === activeNoteId ? "active" : ""}`}
            style={{ display: note.id === activeNoteId ? "block" : "none" }}
          >
            <input
              type="text"
              placeholder="Title"
              value={note.title}
              onChange={(e) => handleNoteChange(note.id, "title", e.target.value)}
              className="title-input"
              ref={(el) => (titleRefs.current[index] = el)}
              data-id={note.id}
            />
            <textarea
              placeholder="Text"
              data-id={note.id}
              ref={(el) => (textareaRefs.current[index] = el)}
              className={`input field ${note.id === activeNoteId ? "active" : ""}`}
              value={note.content}
              onChange={(e) => handleNoteChange(note.id, "content", e.target.value)}
              style={{ display: note.id === activeNoteId ? "block" : "none" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
