import React from "react";
import { FilterTypes } from "./FilterTypes";
import { observer } from "mobx-react-lite";
import { INote } from "../../store/NoteStore";
import { useStore } from "../../store";
import classes from "./NoteTable.module.css";

interface OwnProps {
  getFilteredNotes: (filter: string) => Array<INote>;
}

const NoteTable = (props: OwnProps) => {
  const { noteStore } = useStore();

  const renderNotes = () => {
    return props.getFilteredNotes(noteStore.filter).map((note) => {
      return (
        <tr key={"note-" + note.id}>
          <td>
            <span
              style={{ wordBreak: "break-word" }}
              className={note.done ? classes.task_done : ""}
            >
              {note.text}{" "}
            </span>
          </td>
          <td>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id={"flexCheckChecked" + note.id}
                checked={!note.done}
                onChange={() => noteStore.changeNote(note.id)}
              />
              <label
                className="form-check-label"
                htmlFor={"flexCheckChecked" + note.id}
              >
                {note.done ? FilterTypes.COMPLETED : FilterTypes.WAITING}
              </label>
            </div>
          </td>
          <td>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => noteStore.removeNote(note.id)}
            >
              Remove
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th style={{ width: "80%" }} scope="col">
            Note
          </th>
          <th style={{ width: "110px" }} scope="col">
            Status
          </th>
          <th style={{ width: "10%" }} scope="col">
            Action
          </th>
        </tr>
      </thead>
      <tbody>{renderNotes()}</tbody>
    </table>
  );
};

export default observer(NoteTable);
