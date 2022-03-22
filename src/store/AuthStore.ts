import {
  observable,
  action,
  computed,
  runInAction,
  makeObservable,
  //makeAutoObservable,
} from "mobx";
import axios from "axios";
import { encodeEmail } from "../lib/encodeEmail";

export class AuthStore {
  token: string | null = null;
  email = "";
  userName = "";

  constructor() {
    //makeAutoObservable(this);
    makeObservable(this, {
      token: observable,
      email: observable,
      userName: observable,
      isAuthenticated: computed,
      logout: action,
      authSuccess: action,
    });
  }

  auth = async (
    email: string,
    password: string,
    name?: string,
    surname?: string
  ) => {
    const isRegistration = name != null;
    const api_key = process.env.API_KEY;

    let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${api_key}`;

    if (isRegistration) {
      url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${api_key}`;
    }

    let idToken: string, localId: string, expiresIn: number;

    return await axios
      .post(url, { email, password, returnSecureToken: true })
      .then((response) => {
        idToken = response.data?.idToken;
        localId = response.data?.localId;
        expiresIn = response.data?.expiresIn;

        if (isRegistration) {
          return axios.put(
            `${process.env.AXIOS_BASE_URL}/users/${encodeEmail(email)}.json`,
            {
              name: name,
              surname: surname,
            }
          );
        } else {
          return axios.get(
            `${process.env.AXIOS_BASE_URL}/users/${encodeEmail(email)}.json`
          );
        }
      })
      .then((response) => {
        if (!isRegistration) {
          name = response.data.name;
          surname = response.data.surname;
        }
        const expirationDate = new Date(
          new Date().getTime() + expiresIn * 1000
        );

        let userName = name ? name : "";
        if (surname != null && surname.length > 0) userName += " " + surname;

        localStorage.setItem("token", idToken);
        localStorage.setItem("userId", localId);
        localStorage.setItem("expirationDate", expirationDate.toString());
        localStorage.setItem("email", email);
        localStorage.setItem("userName", userName);

        this.authSuccess(idToken, email, userName);
        this.autoLogout(expiresIn);
      });
  };

  autoLogout = (time: number) => {
    setTimeout(() => {
      this.logout();
    }, time * 1000);
  };

  autoLogin = () => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName") ?? "";
    const email = localStorage.getItem("email");

    if (!token || !email) {
      this.logout();
    } else {
      const expirationDate = new Date(
        localStorage.getItem("expirationDate") as string
      );
      if (expirationDate <= new Date()) {
        this.logout();
      } else {
        this.authSuccess(token, email, userName);
        this.autoLogout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        );
      }
    }
  };

  get isAuthenticated() {
    return !!this.token;
  }

  authSuccess = (token: string, email: string, userName: string) => {
    this.token = token;
    this.email = email;
    this.userName = userName;

    runInAction(() => {
      this.token = token;
      this.email = email;
      this.userName = userName;
    });
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("email");
    localStorage.removeItem("userName");

    this.token = null;
    this.email = "";
    this.userName = "";
  };
}
