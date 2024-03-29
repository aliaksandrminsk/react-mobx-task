import { NoteStore } from "./NoteStore";
import { AuthStore } from "./AuthStore";
import { createContext, useContext } from "react";

const authStore = new AuthStore();
const noteStore = new NoteStore(authStore);

export interface IStore {
  authStore: AuthStore;
  noteStore: NoteStore;
}

const store: IStore = {
  authStore,
  noteStore,
};

export const StoreContext = createContext(store as typeof store);

export const useStore = () => {
  return useContext(StoreContext) as typeof store;
};

export default store;
