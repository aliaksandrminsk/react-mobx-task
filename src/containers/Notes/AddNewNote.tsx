import React, { useRef, useState } from "react";
import { INote, NoteStore } from "../../store/NoteStore";

export const AddNewNote: React.FC<{ noteStore: NoteStore }> = (props) => {
  const noteCounter = useRef(0); //This counter uses to make unique id when we are creating new note.
  const [text, setText] = useState("");

  const addNote = () => {
    const note: INote = {
      id: "id" + (props.noteStore.notes.length + noteCounter.current),
      text,
      done: false,
    };
    props.noteStore.addNote(note);
    setText("");
    noteCounter.current++;
  };

  return (
    <div className="input-group">
      <input
        name="todo-input"
        type="text"
        className="form-control"
        placeholder="Text of note"
        aria-label="Text of note"
        aria-describedby="button-addon2"
        maxLength={200}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="input-group-append">
        <button
          className="btn btn-primary"
          type="button"
          id="button-addon2"
          onClick={addNote}
          disabled={text.trim().length === 0}
        >
          Add note
        </button>
      </div>
    </div>
  );
};
export default AddNewNote;
