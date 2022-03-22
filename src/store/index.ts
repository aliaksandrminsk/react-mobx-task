import { NoteStore } from "./NoteStore";
import { AuthStore } from "./AuthStore";

export class RootStore {
  public noteStore: NoteStore;
  public authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore();
    this.noteStore = new NoteStore(this);
  }
}

export default new RootStore();
