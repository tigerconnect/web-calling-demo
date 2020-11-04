import React, { useCallback, useState } from "react";
import { useAppState } from "../../state";
import logo from "../../images/logo.png";
import "./LoginForm.css";

export default function LoginForm() {
  const { isSigningIn, signIn, signInError } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = useCallback((e) => {
    e.preventDefault()
    signIn(email, password)
  }, [email, password, signIn])

  return (
    <div id="login-form">
      <div>
        <div>
          <img src={logo} alt="TigerConnect Logo" />
          <div className="label">CALLING SDK DEMO</div>
        </div>
        { signInError && <div className="error"> Login attempt failed. Please check your email/password </div> }
        <form className={"form"} onSubmit={onSubmit}>
          <input
            disabled={isSigningIn}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            type="text"
            value={email}
            autoComplete="on"
          />
          <input
            disabled={isSigningIn}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            value={password}
            autoComplete="on"
          />
          <button onClick={onSubmit}> LOGIN </button>
        </form>
        <div className="helper">
        </div>
      </div>
    </div>
  );
}
