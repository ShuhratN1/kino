// index.jsx
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Movies from "./components/Movies.jsx";
import PrivateRoute from "./components/PrivateRouter.jsx";
import { AuthProvider } from "./AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PopularMovies from "./components/PopularMovies.jsx";
import Multfilms from "./components/Multfilms.jsx";
import Profileee from "./components/Profileee.jsx";

function AppWrapper() {
  const [searchQuery, setSearchQuery] = useState("avengers");
  return (
    <PrivateRoute>
      <Navbar onSearch={setSearchQuery} />
      <Movies searchQuery={searchQuery} />
    </PrivateRoute>
  );
}

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/", element: <AppWrapper /> },
  { path: "/popular", element: <PopularMovies /> },
  { path: "/multfilms", element: <Multfilms /> },
  { path: "/profileee", element: <Profileee /> },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4 text-yellow-400">
          404 - Sahifa topilmadi 😕
        </h1>
        <a
          href="/"
          className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold transition"
        >
          ⬅ Bosh sahifaga qaytish
        </a>
      </div>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
