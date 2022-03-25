import { observable, action, makeObservable, flow } from "mobx";
import axios from "axios";
import { encodeEmail } from "../lib/encodeEmail";
import { AuthStore } from "./AuthStore";

export interface INote {
  id: string;
  text: string;
  done: boolean;
}

export class NoteStore {
  authStore: { email: string };

  notes = new Array<INote>();
  updatedNotes = new Array<INote>();
  loading = false;
  errorMessage = "";
  filter = "all";

  constructor(authStore: AuthStore) {
    makeObservable(this, {
      notes: observable,
      updatedNotes: observable,
      loading: observable,
      errorMessage: observable,
      filter: observable,
      saveNotes: flow,
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
    this.authStore = authStore;
  }

  *saveNotes() {
    const { email } = this.authStore;
    const notes: Array<INote> = this.updatedNotes;

    try {
      const data: any = {};
      let counter = 0;
      for (const item of notes) {
        item.id = "id" + counter; //update old item because new item can have a bug with id
        data[item.id] = { text: item.text, done: item.done };
        counter++;
      }
      yield axios.put(
        `${process.env.AXIOS_BASE_URL}/users/${encodeEmail(email)}/data.json/`,
        data
      );

      this.saveNotesSuccess(notes);
    } catch (error) {
      this.saveNotesError("Something went wrong. Try again!");
      console.error("An unexpected error happened:", error);
    }
  }

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
