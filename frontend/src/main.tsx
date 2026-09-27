import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import { TestPage, TestPageError } from "./pages/test-page.js";
import { loadTestData } from "./routes/test-data.js";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/teste-banco"),
  },
  {
    path: "/teste-banco",
    loader: loadTestData,
    Component: TestPage,
    ErrorBoundary: TestPageError,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
