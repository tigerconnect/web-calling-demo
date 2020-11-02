import React from "react";
import "./App.css";
import { useAppState } from "./state";
import CallView from "./components/CallView/CallView";
import LoginForm from "./components/LoginForm/LoginForm";

function App() {
  const { user } = useAppState();
  return <div className="App">{user ? <CallView /> : <LoginForm />}</div>;
}

export default App;
