import React, { Component } from "react";
import { FilterTypes } from "./FilterTypes";
import { inject, observer } from "mobx-react";
import { INote, NoteStore } from "../../store/NoteStore";

type StoreProps = {
  noteStore: NoteStore;
};

interface Props extends StoreProps {
  getFilteredNotes: (filter: string) => Array<INote>;
}

@inject("noteStore")
@observer
class NoteTable extends Component<Props> {
  static defaultProps = {} as Props;
  renderNotes() {
    return this.props
      .getFilteredNotes(this.props.noteStore.filter)
      .map((note) => {
        return (
          <tr key={"note-" + note.id}>
            <td>
              <span style={{ wordBreak: "break-word" }}>{note.text} </span>
            </td>
            <td>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id={"flexCheckChecked" + note.id}
                  checked={!note.done}
                  onChange={() => this.props.noteStore.changeNote(note.id)}
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
                onClick={() => this.props.noteStore.removeNote(note.id)}
              >
                Remove
              </button>
            </td>
          </tr>
        );
      });
  }

  render() {
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
        <tbody>{this.renderNotes()}</tbody>
      </table>
    );
  }
}

export default NoteTable;
