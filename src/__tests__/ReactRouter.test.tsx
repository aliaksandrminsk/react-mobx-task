import React, { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import axios from "axios";
import store, { StoreContext } from "../store";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const withRouter = (ui: ReactElement, { route = "/" } = {}) => {
  return (
    <StoreContext.Provider value={store}>
      <MemoryRouter initialEntries={[route]} initialIndex={0}>
        {ui}
      </MemoryRouter>
    </StoreContext.Provider>
  );
};

describe("React Router", () => {
  it("landing on a register page", async () => {
    const route = "/register";
    await waitFor(() => render(withRouter(<App />, { route })));

    expect(screen.getByText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Name$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Surname$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Create account/i)).toHaveLength(2);
  });

  it("landing on a bad page, then move to login page", async () => {
    const route = "/something-that-does-not-match";
    await waitFor(() => render(withRouter(<App />, { route })));

    expect(screen.getByText(/^Email$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^Name$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Surname$/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Sign in/i)).toHaveLength(2);
  });

  it("landing on a list page", async () => {
    // Make the mock return the custom axios response
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    localStorage.setItem("token", "fakeToken");
    localStorage.setItem("email", "email@tut.by");
    localStorage.setItem("userName", "Alex");
    const expirationDate = new Date(new Date().getTime() + 1000);
    localStorage.setItem("expirationDate", expirationDate.toString());

    const route = "/list";
    await waitFor(() => render(withRouter(<App />, { route })));

    expect(screen.getByText(/Hello Alex/i)).toBeInTheDocument();
    expect(screen.getByText(/All/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Waiting/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Add note/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Save notes/i })
    ).toBeInTheDocument();

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userName");
    localStorage.removeItem("expirationDate");
  });
  it("landing on a logout page", async () => {
    const route = "/logout";
    await waitFor(() => render(withRouter(<App />, { route })));
    expect(screen.getByText(/^Email$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^Surname$/i)).not.toBeInTheDocument();
  });
});
