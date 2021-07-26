// import React from 'react';
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useState } from "react";
import userinfo from "../login.json";
import { useHistory } from "react-router-dom";
import './login.css'

export default function Login(props) {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (username, password) => {
    console.log({ usrename: username, password: password });
    console.log("static login info:", userinfo);
    if (userinfo.username === username && userinfo.password === password) {
      console.log("Login successful");
      // redirect to home page
      history.push("/home");
      // history.push({pathname:"/home", state: { detail: 'some_value' }})
      console.log(history);
    } else {
      history.push("/login");
      alert("Wrong credentials :-(");
    }
  };

  return (
    <div class="container">
    <Container>
      <h1>Login</h1>
      <Form>
        <Form.Group controlId="form.Username">
          <Form.Label>Username: </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <p></p>
        <Form.Group controlId="form.Password">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <p></p>
        <Button onClick={() => onSubmit(username, password)} variant="primary">
          Submit
        </Button>
      </Form>
    </Container>
    </div>
  );
}
