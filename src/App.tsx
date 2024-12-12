import React, { useEffect } from "react";

import "./App.css";
import { useUser } from "./contexts/UserContexts";
import Login from "./pages/Login";
import Main from "./pages/Main";

function App() {
  const { user, setUser } = useUser();

  const updateUser = () => {
    setUser({ id: "1", name: "vendor", role: "vendor" });
  };

  useEffect(() => {
    // updateUser();
  }, []);

  return <>{user == null ? <Login /> : <Main />}</>;
}

export default App;
