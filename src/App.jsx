import React, { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Movies from "./components/Movies.jsx";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-black min-h-screen">
      <Navbar onSearch={setSearchQuery} />
      <Movies searchQuery={searchQuery} />
    </div>
  );
}



