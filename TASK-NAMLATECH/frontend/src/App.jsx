import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HotelList from "./pages/HotelList";
import HotelDetails from "./pages/HotelDetails";
import HotelForm from "./components/HotelForm";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HotelList />} />
        <Route path="/add" element={<HotelForm />} />
        <Route path="/edit/:id" element={<HotelForm />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="*" element={<HotelList />} />
      </Routes>
    </>
  );
}

export default App;