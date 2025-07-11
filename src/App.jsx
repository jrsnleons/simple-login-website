import { Link, Route, Routes } from "react-router-dom";
import "./App.css"
import ProtectedRoute from "./components/ProtectedRoute";
import { Error, Home, Login, Register } from "./pages";

export default function App() {
    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col text-white items-center justify-center">
            <Routes>
                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </div>
    );
}
