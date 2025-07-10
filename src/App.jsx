import { Link, Route, Routes } from "react-router-dom";
import { Home, Login, Register } from "./pages";

export default function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </div>
    );
}
