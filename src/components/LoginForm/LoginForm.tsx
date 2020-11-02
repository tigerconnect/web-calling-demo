import React, { useState } from "react";
import { useAppState } from "../../state";
import logo from "../../images/logo.png";
import "./LoginForm.css";

export default function LoginForm() {
  const { isSigningIn, signIn, signInError } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div id="login-form">
      <div>
        <div>
          <img src={logo} alt="TigerConnect Logo" />
          <div className="label">CALLING SDK DEMO</div>
        </div>
        { signInError && <div className="error"> Login attempt failed. Please check your email/password </div> }
        <div className={"form"}>
          <input
            disabled={isSigningIn}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            type="text"
            value={email}
          />
          <input
            disabled={isSigningIn}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            value={password}
          />
          <button onClick={() => signIn(email, password)}> LOGIN </button>
        </div>
        <div className="helper">
          For documentation on TigerConnect's Calling SDK please refer to:
        </div>
      </div>
    </div>
  );
}
