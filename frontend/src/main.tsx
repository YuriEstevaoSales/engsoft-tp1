import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PublicLayout } from "./components/public-layout.js";
import { AboutPage, HomePage } from "./pages/home-page.js";
import { LoginPage } from "./pages/login-page.js";
import { SignupPage } from "./pages/signup-page.js";
import { SignupDoctorPage } from "./pages/signup-doctor-page.js";
import { TestPage, TestPageError } from "./pages/test-page.js";
import { loadTestData } from "./routes/test-data.js";
import "./styles.css";
import "./styles/layout.css";
import "./styles/login.css";
import "./styles/signup.css";

const router = createBrowserRouter([
  { Component: () => <PublicLayout header="dark" />, children: [{ path: "/entrar", Component: LoginPage }] },
  { Component: () => <PublicLayout header="teal" />, children: [{ path: "/cadastro", Component: SignupPage }] },
  {
    Component: () => <PublicLayout header="light" />,
    children: [
      { path: "/", Component: HomePage },
      { path: "/sobre", Component: AboutPage },
      { path: "/cadastro/dados", Component: SignupDoctorPage },
    ],
  },
  { path: "/teste-banco", loader: loadTestData, Component: TestPage, ErrorBoundary: TestPageError },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
