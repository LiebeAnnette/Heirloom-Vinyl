import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/queries";
import { login } from "../utils/auth";

export default function LoginPage() {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [loginUser] = useMutation(LOGIN_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await loginUser({ variables: formState });
    login(data.login.token);
    window.location.assign("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <input
        placeholder="Username"
        value={formState.username}
        onChange={(e) =>
          setFormState({ ...formState, username: e.target.value })
        }
      />
      <input
        placeholder="Password"
        type="password"
        value={formState.password}
        onChange={(e) =>
          setFormState({ ...formState, password: e.target.value })
        }
      />
      <button type="submit">Log In</button>
    </form>
  );
}
