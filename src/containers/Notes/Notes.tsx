import React, { Component } from "react";
import classes from "./Notes.module.css";
import Loader from "../../components/UI/Loader/Loader";
import { isEqual } from "../../lib/isEqual";
import { FilterTypes } from "./FilterTypes";
import NoteTable from "./NoteTable";
import { INote, NoteStore } from "../../store/NoteStore";
import { inject, observer } from "mobx-react";
import AddNewNote from "./AddNewNote";

type StoreProps = {
  noteStore: NoteStore;
};

@inject("noteStore")
@observer
class Notes extends Component<StoreProps> {
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

          <AddNewNote noteStore={this.props.noteStore} />

          <br />
          <div className="d-flex justify-content-center">
            <button
              type="button"
              onClick={this.props.noteStore.saveNotes}
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
