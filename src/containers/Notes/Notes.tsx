import React, { useEffect, useMemo } from "react";
import classes from "./Notes.module.css";
import Loader from "../../components/UI/Loader/Loader";
import { isEqual } from "../../lib/isEqual";
import { FilterTypes } from "./FilterTypes";
import NoteTable from "./NoteTable";
import { INote } from "../../store/NoteStore";
import { observer } from "mobx-react-lite";
import AddNewNote from "./AddNewNote";
import { IStore, useStore } from "../../store";
import axios from "axios";
import { encodeEmail } from "../../lib/encodeEmail";

type voidFunc = () => void;

const Notes = observer((props: { store: IStore }) => {
  const { authStore, noteStore } = props.store;

  const getFilteredNotes = (filter: string): Array<INote> => {
    return noteStore.updatedNotes.filter((value) => {
      if (filter === FilterTypes.COMPLETED) {
        return value.done;
      } else if (filter === FilterTypes.WAITING) {
        return !value.done;
      }
      return true;
    });
  };

  const fetchNotes: voidFunc = async () => {
    const { email } = authStore;
    noteStore.fetchNotesStart();

    try {
      const response = await axios.get(
        `${process.env.AXIOS_BASE_URL}/users/${encodeEmail(email)}/data.json`
      );

      const notes: Array<INote> = [];
      let counter = 0;
      if (response.data != null) {
        for (const value of Object.values(response.data)) {
          notes.push({
            id: "id" + counter++,
            text: (value as INote).text,
            done: (value as INote).done,
          });
        }
      }
      noteStore.fetchNotesSuccess(notes);
    } catch (error) {
      noteStore.fetchNotesError(
        "Error occurred. It appears something is broken."
      );
      console.error("An unexpected error happened:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const completedNotesCount = useMemo<number>(
    () => getFilteredNotes("completed").length,
    [noteStore.updatedNotes]
  );

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
              onChange={noteStore.setFilter.bind(this, FilterTypes.All)}
              checked={noteStore.filter === FilterTypes.All}
            />
            <label className="form-check-label" htmlFor="filterRadio1">
              All ({noteStore.updatedNotes.length})
            </label>
          </div>
          <br />
          <div className="form-check mx-2">
            <input
              className="form-check-input"
              type="radio"
              name="filterRadio"
              id="filterRadio2"
              onChange={noteStore.setFilter.bind(this, FilterTypes.COMPLETED)}
              checked={noteStore.filter === FilterTypes.COMPLETED}
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
              onChange={noteStore.setFilter.bind(this, FilterTypes.WAITING)}
              checked={noteStore.filter === FilterTypes.WAITING}
            />
            <label className="form-check-label" htmlFor="filterRadio3">
              Waiting ({noteStore.updatedNotes.length - completedNotesCount})
            </label>
          </div>
        </div>

        <br />
        {noteStore.errorMessage ? (
          <h4 className="text-danger d-flex justify-content-center mb-4">
            {noteStore.errorMessage}
          </h4>
        ) : null}

        {noteStore.loading ? (
          <Loader />
        ) : (
          <NoteTable
            getFilteredNotes={getFilteredNotes}
            noteStore={noteStore}
          />
        )}

        <br />

        <AddNewNote noteStore={noteStore} />

        <br />
        <div className="d-flex justify-content-center">
          <button
            type="button"
            onClick={() => noteStore.saveNotes()}
            className={"btn btn-primary " + classes.saveButton}
            disabled={isEqual(noteStore.notes, noteStore.updatedNotes)}
          >
            Save notes
          </button>
        </div>
        <br />
      </div>
    </div>
  );
});

const NotesWrapper = () => {
  return <Notes store={useStore()} />;
};

export { Notes };
export default NotesWrapper;
