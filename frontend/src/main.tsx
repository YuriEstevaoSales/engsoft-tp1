import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PublicLayout } from "./components/public-layout.js";
import { AboutPage, HomePage } from "./pages/home-page.js";
import { LoginPage } from "./pages/login-page.js";
import { SignupPage } from "./pages/signup-page.js";
import { SignupDoctorPage } from "./pages/signup-doctor-page.js";
import { DoctorProfilePage } from "./pages/doctor-profile-page.js";
import { AppointmentStartPage, DoctorSearchPage } from "./pages/doctor-search-page.js";
import { TestPage, TestPageError } from "./pages/test-page.js";
import { loadTestData } from "./routes/test-data.js";
import { DOCTOR_SEARCH_ROUTE_PATH } from "./routes/doctor-search.js";
import { requireSignupDraft } from "./routes/signup-draft.js";
import "./styles.css";

const router = createBrowserRouter([
  { Component: () => <PublicLayout header="dark" />, children: [{ path: "/entrar", Component: LoginPage }] },
  { Component: () => <PublicLayout header="teal" />, children: [{ path: "/cadastro", Component: SignupPage }] },
  { Component: () => <PublicLayout header="home" />, children: [{ path: "/", Component: HomePage }] },
  {
    Component: () => <PublicLayout header="light" />,
    children: [
      { path: "/sobre", Component: AboutPage },
      { path: DOCTOR_SEARCH_ROUTE_PATH, Component: DoctorSearchPage },
      { path: "/agendar/:doctorId", Component: AppointmentStartPage },
      { path: "/cadastro/dados", loader: requireSignupDraft, Component: SignupDoctorPage },
      { path: "/perfil", Component: DoctorProfilePage },
    ],
  },
  { path: "/teste-banco", loader: loadTestData, Component: TestPage, ErrorBoundary: TestPageError },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
