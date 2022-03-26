import React from "react";
import { AuthStore } from "../store/AuthStore";
import { INote, NoteStore } from "../store/NoteStore";

let noteStore: NoteStore;

describe("Note store", () => {
  beforeEach(() => {
    const authStore = new AuthStore();
    noteStore = new NoteStore(authStore);
  });

  it("Add note", () => {
    const note: INote = {
      id: "id0",
      text: "My note",
      done: false,
    };
    noteStore.addNote(note);

    expect(noteStore.updatedNotes.length).toBe(1);
    expect(
      noteStore.updatedNotes.find((t) => t.text === "My note")
    ).toBeDefined();
  });
  it("remove a note", () => {
    const note: INote = {
      id: "id0",
      text: "My note",
      done: false,
    };
    noteStore.addNote(note);
    noteStore.removeNote(note.id);

    expect(noteStore.updatedNotes.length).toBe(0);
  });

  it("Change done status", () => {
    const note: INote = {
      id: "id0",
      text: "My note",
      done: false,
    };
    noteStore.addNote(note);
    noteStore.changeNote(note.id);

    expect(noteStore.updatedNotes[0].done).toBe(true);
  });
  it("cannot add an empty note", () => {
    const note: INote = {
      id: "id0",
      text: "",
      done: false,
    };
    noteStore.addNote(note);

    expect(noteStore.updatedNotes.length).toBe(0);
  });
});
