import { Link, Route, Routes } from "react-router-dom";
import { Error, Home, Login, Register } from "./pages";

export default function App() {
    return (
        <div>
            <Routes>
                <Route index element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="home" element={<Home />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </div>
    );
}
