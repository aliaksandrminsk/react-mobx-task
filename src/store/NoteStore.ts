import { observable, action, makeObservable } from "mobx";
import { RootStore } from "./index";
import axios from "axios";
import { encodeEmail } from "../lib/encodeEmail";

export interface INote {
  id: string;
  text: string;
  done: boolean;
}

export class NoteStore {
  private rootStore: RootStore;

  notes = new Array<INote>();
  updatedNotes = new Array<INote>();
  loading = false;
  errorMessage = "";
  filter = "all";
  newNoteText = "";

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      notes: observable,
      updatedNotes: observable,
      loading: observable,
      errorMessage: observable,
      filter: observable,
      newNoteText: observable,
      saveNotes: action,
      updateNewNoteText: action,
      changeNote: action,
      addNote: action,
      setFilter: action,
      removeNote: action,
      fetchNotesStart: action,
      fetchNotesSuccess: action,
      fetchNotesError: action,
      saveNotesSuccess: action,
      saveNotesError: action,
    });
    this.rootStore = rootStore;
  }

  fetchNotes = async () => {
    const { email } = this.rootStore.authStore;
    this.fetchNotesStart();

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
      this.fetchNotesSuccess(notes);
    } catch (error) {
      this.fetchNotesError("Error occurred. It appears something is broken.");
      console.error("An unexpected error happened:", error);
    }
  };

  saveNotes = async () => {
    const { email } = this.rootStore.authStore;
    const notes: Array<INote> = this.updatedNotes;

    try {
      const data: any = {};
      let counter = 0;
      for (const item of notes) {
        item.id = "id" + counter; //update old item because new item can have a bug with id
        data[item.id] = { text: item.text, done: item.done };
        counter++;
      }
      await axios.put(
        `${process.env.AXIOS_BASE_URL}/users/${encodeEmail(email)}/data.json/`,
        data
      );

      this.saveNotesSuccess(notes);
    } catch (error) {
      this.saveNotesError("Something went wrong. Try again!");
      console.error("An unexpected error happened:", error);
    }
  };

  updateNewNoteText = (value: string) => {
    this.newNoteText = value;
  };

  changeNote = (id: string) => {
    this.updatedNotes.forEach((item, index) => {
      if (item.id === id) {
        this.updatedNotes[index] = {
          id: item.id,
          text: item.text,
          done: !item.done,
        };
      }
    });
    this.errorMessage = "";
  };

  addNote = (note: INote) => {
    this.errorMessage = "";
    this.updatedNotes.push(note);
  };

  setFilter = (filter: string) => {
    this.errorMessage = "";
    this.filter = filter;
  };

  removeNote = (id: string) => {
    for (const item of this.updatedNotes) {
      if (item.id === id) {
        const index = this.updatedNotes.indexOf(item);
        this.updatedNotes.splice(index, 1);
        break;
      }
    }
    this.errorMessage = "";
  };

  fetchNotesStart = () => {
    this.loading = true;
  };

  fetchNotesSuccess = (notes: Array<INote>) => {
    this.loading = false;
    this.errorMessage = "";
    this.notes = notes;
    this.updatedNotes = notes;
    this.filter = "all";
  };

  fetchNotesError = (errorMessage: string) => {
    this.loading = false;
    this.errorMessage = errorMessage;
  };

  saveNotesSuccess = (updatedNotes: Array<INote>) => {
    this.notes = [...updatedNotes];
    this.errorMessage = "";
  };

  saveNotesError = (errorMessage: string) => {
    this.errorMessage = errorMessage;
  };
}
