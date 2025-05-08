import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Venue from "./pages/Venue";
import CreateVenue from "./pages/CreateVenue";
import EditVenue from "./pages/EditVenue";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/venue/:id" element={<Venue />} />
        <Route path="/create-venue" element={<CreateVenue />} />
        <Route path="/edit-venue/:id" element={<EditVenue />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
