import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/queries";
import { login } from "../utils/auth";

export default function SignupPage() {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [addUser] = useMutation(ADD_USER);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await addUser({ variables: formState });
    login(data.addUser.token);
    window.location.assign("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
      <button type="submit">Create Account</button>
    </form>
  );
}
