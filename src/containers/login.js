// import React from 'react';
import { useState } from "react";
import userinfo from "../login.json";
import { useHistory } from "react-router-dom";
import "./login.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(6, "Username must be at least 6 characters")
    .max(20, "Username must not exceed 20 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(40, "Password must not exceed 40 characters"),
});

export default function Login(props) {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    console.log("event", event);
    console.log("static login info:", userinfo);
    if (userinfo.username === username && userinfo.password === password) {
      console.log("Login successful");
      // redirect to home page
      history.push("/home");
      // history.push({pathname:"/home", state: { detail: 'some_value' }})
      console.log(history);
    } else {
      history.push("/");
      alert("Wrong credentials :-(");
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div class="container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Enter username"
            {...register("username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="**********"
            value={password}
            {...register("password")}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
