import { Outlet } from "react-router";
import Navbar from "./Components/Navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./Context/useAuth";
import { SpinnerProvider } from "./Context/SpinnerContext";

function App() {
  return (
    <>
      <SpinnerProvider>
        <UserProvider>
          <Navbar />
          <Outlet />
          <ToastContainer />
        </UserProvider>
      </SpinnerProvider>
    </>
  );
}

export default App;
