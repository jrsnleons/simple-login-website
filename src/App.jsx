import { Link, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Error, Home, Login, Register } from "./pages";

export default function App() {
    return (
        <div>
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
