import React, { Component } from "react";
import classes from "./Notes.module.css";
import Loader from "../../components/UI/Loader/Loader";
import { isEqual } from "../../lib/isEqual";
import { FilterTypes } from "./FilterTypes";
import NoteTable from "./NoteTable";
import { INote, NoteStore } from "../../store/NoteStore";
import { inject, observer } from "mobx-react";

// interface State {
//   newNoteText: string;
// }
/*
interface DispatchProps {
  fetchNotes: () => void;
  saveNotes: () => void;
  addNote: (note: INote) => void;
  setFilter: (filter: string) => void;
}

interface StateProps {
  notes: Array<INote>;
  updatedNotes: Array<INote>;
  loading: boolean;
  errorMessage: string;
  filter: string;
}

type Props = StateProps & DispatchProps;

function mapStateToProps(state: ApplicationState): StateProps {
  return {
    notes: state.note.notes,
    updatedNotes: state.note.updatedNotes,
    loading: state.note.loading,
    errorMessage: state.note.errorMessage,
    filter: state.note.filter,
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<ApplicationState, unknown, NoteAction>
): DispatchProps {
  return {
    fetchNotes: () => dispatch(fetchNotes()),
    saveNotes: () => dispatch(saveNotes()),
    addNote: (note: INote) => dispatch(addNote(note)),
    setFilter: (filter: string) => dispatch(setFilter(filter)),
  };
}*/

type StoreProps = {
  noteStore: NoteStore;
};

@inject("noteStore")
@observer
class Notes extends Component<StoreProps> {
  noteCounter = 0; //This counter uses to make unique id when we are creating new note.
  static defaultProps = {} as StoreProps;

  getFilteredNotes = (filter: string): Array<INote> => {
    return this.props.noteStore.updatedNotes.filter((value) => {
      if (filter === FilterTypes.COMPLETED) {
        return value.done;
      } else if (filter === FilterTypes.WAITING) {
        return !value.done;
      }
      return true;
    });
  };

  onAddNoteHandler = () => {
    const note: INote = {
      id: "id" + (this.props.noteStore.notes.length + this.noteCounter),
      text: this.props.noteStore.newNoteText,
      done: false,
    };
    this.props.noteStore.addNote(note);
    this.props.noteStore.updateNewNoteText("");
    this.noteCounter++;
  };

  componentDidMount() {
    return this.props.noteStore.fetchNotes();
  }

  render() {
    const completedNotesCount = this.getFilteredNotes("completed").length;

    return (
      <div className="d-flex justify-content-center flex-grow-1 pt-4 pt-sm-5">
        <div className="w-100 px-sm-5">
          <h2 className="text-center mb-3">Notes</h2>

          <div className="container d-flex justify-content-center">
            <div className="form-check mx-2">
              <input
                className="form-check-input"
                type="radio"
                name="filterRadio"
                id="filterRadio1"
                onChange={this.props.noteStore.setFilter.bind(
                  this,
                  FilterTypes.All
                )}
                checked={this.props.noteStore.filter === FilterTypes.All}
              />
              <label className="form-check-label" htmlFor="filterRadio1">
                All ({this.props.noteStore.updatedNotes.length})
              </label>
            </div>
            <br />
            <div className="form-check mx-2">
              <input
                className="form-check-input"
                type="radio"
                name="filterRadio"
                id="filterRadio2"
                onChange={this.props.noteStore.setFilter.bind(
                  this,
                  FilterTypes.COMPLETED
                )}
                checked={this.props.noteStore.filter === FilterTypes.COMPLETED}
              />
              <label className="form-check-label" htmlFor="filterRadio2">
                Completed ({completedNotesCount})
              </label>
            </div>

            <div className="form-check mx-2">
              <input
                className="form-check-input"
                type="radio"
                name="filterRadio"
                id="filterRadio3"
                onChange={this.props.noteStore.setFilter.bind(
                  this,
                  FilterTypes.WAITING
                )}
                checked={this.props.noteStore.filter === FilterTypes.WAITING}
              />
              <label className="form-check-label" htmlFor="filterRadio3">
                Waiting (
                {this.props.noteStore.updatedNotes.length - completedNotesCount}
                )
              </label>
            </div>
          </div>

          <br />
          {this.props.noteStore.errorMessage ? (
            <h4 className="text-danger d-flex justify-content-center mb-4">
              {this.props.noteStore.errorMessage}
            </h4>
          ) : null}

          {this.props.noteStore.loading ? (
            <Loader />
          ) : (
            <NoteTable getFilteredNotes={this.getFilteredNotes} />
          )}

          <br />
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Text of note"
              aria-label="Text of note"
              aria-describedby="button-addon2"
              maxLength={200}
              value={this.props.noteStore.newNoteText}
              onChange={(e) =>
                this.props.noteStore.updateNewNoteText(e.target.value)
              }
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                id="button-addon2"
                onClick={this.onAddNoteHandler}
                disabled={this.props.noteStore.newNoteText.trim().length === 0}
              >
                Add note
              </button>
            </div>
          </div>
          <br />
          <div className="d-flex justify-content-center">
            <button
              type="button"
              onClick={this.props.noteStore.saveNotes.bind(this)}
              className={"btn btn-primary " + classes.saveButton}
              disabled={isEqual(
                this.props.noteStore.notes,
                this.props.noteStore.updatedNotes
              )}
            >
              Save notes
            </button>
          </div>
          <br />
        </div>
      </div>
    );
  }
}

export default Notes;
