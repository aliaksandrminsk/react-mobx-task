import React, { useRef } from "react";
import { INote, NoteStore } from "../../store/NoteStore";
import { observer, useLocalObservable } from "mobx-react-lite";

export const AddNewNote: React.FC<{ noteStore: NoteStore }> = (props) => {
  const noteCounter = useRef(0); //This counter uses to make unique id when we are creating new note.
  const appUI = useLocalObservable(() => ({
    text: "",
    setText(value: string) {
      this.text = value;
    },
  }));

  const addNote = () => {
    const note: INote = {
      id: "id" + (props.noteStore.notes.length + noteCounter.current),
      text: appUI.text,
      done: false,
    };
    props.noteStore.addNote(note);
    appUI.setText("");
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
        value={appUI.text}
        onChange={(e) => appUI.setText(e.target.value)}
      />
      <div className="input-group-append">
        <button
          className="btn btn-primary"
          type="button"
          id="button-addon2"
          onClick={addNote}
          disabled={appUI.text.trim().length === 0}
        >
          Add note
        </button>
      </div>
    </div>
  );
};
export default observer(AddNewNote);
