import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import axios from "axios";
import "./home.css";

export default function Home() {
  const [state, setState] = useState([]);
  const [user, setUser] = useState({});
  const [userinfo, setUserinfo] = useState("");
  const [edituser, setEdituser] = useState();
  const [editusername, setEditusername] = useState();

  useEffect(() => {
    const users = localStorage.getItem("users");
    if (localStorage.getItem("users") === null) {
      axios
        .get("https://randomuser.me/api/0.8/?results=20")
        .then((res) => {
          const userDetails = res.data.results.map((user) => {
            const userInfo = {
              Gender: user.user.gender,
              Name:
                user.user.name.title +
                " " +
                user.user.name.first +
                " " +
                user.user.name.last,
              Email: user.user.email,
              DOB: user.user.dob,
              Username: user.user.username,
              Password: user.user.password,
              Phone: user.user.phone,
            };
            return userInfo;
          });
          localStorage.setItem("users", JSON.stringify(userDetails));
          setState(userDetails);
        })
        .catch((err) => err.message);
    } else {
      const parsedUser = JSON.parse(users);
      setState(parsedUser);
    }
  }, []);

  const submitUser = (user) => {
    const isUsernameAvailable = Boolean(user.Username);
    const isEmailAvailable = Boolean(user.Email);
    const isPasswordAvailable = Boolean(user.Password);
    console.log({ isUsernameAvailable, isEmailAvailable, isPasswordAvailable });
    if (!user.Username || !user.Email || !user.Password) {
      alert(
        "Enter user details --> mandatory to input Username, Email && Password"
      );
      setUser({});
    } else if (
      state.find((person) => person.Username === user.Username) != null
    ) {
      alert("Username already exists, enter a new username");
      setUser({});
    } else {
      alert("User is registered!!");
      const data = JSON.parse(localStorage.getItem("users"));
      data.push(user);
      localStorage.clear();
      localStorage.setItem("users", JSON.stringify(data));
      setState(data);
      setUser({});
    }
    formDisplay();
  };

  const deleteUser = (username) => {
    const confirm = window.confirm(
      "Are you sure you wish to delete this item?"
    );
    if (confirm) {
      const users = JSON.parse(localStorage.getItem("users"));
      const getUsers = users.filter((user) => user.Username !== username);
      localStorage.clear();
      localStorage.setItem("users", JSON.stringify(getUsers));
      setState(getUsers);
      alert(`User  with username: ${username} has been removed`);
    } else {
      alert(`User with username: ${username} is not removed`);
    }
  };

  const editUser = (username) => {
    const users = JSON.parse(localStorage.getItem("users"));
    const getUser = users.find((user) => user.Username == username);
    setEditusername(username);
    setEdituser(getUser);
    if (!getUser) {
      alert(`User  with username: ${username} does not exist`);
    }
  };
  const updateUser = (edituser) => {
    const users = JSON.parse(localStorage.getItem("users"));
    const getUsers = users.filter((user) => user.Username !== editusername);
    getUsers.push(edituser);
    localStorage.clear();
    localStorage.setItem("users", JSON.stringify(getUsers));
    setState(getUsers);
    setEdituser();
    alert("User is updated!!");
  };

  const filterTable = (userinfo) => {
    const users = JSON.parse(localStorage.getItem("users"));
    const getUsers = users
      .map((user) => {
        if (Object.values(user).indexOf(userinfo) > -1) {
          return user;
        } else if (user.DOB == userinfo || user.Phone == userinfo) {
          return user;
        }
      })
      .filter((e) => e);
    if (getUsers.length === 0) {
      setState(users);
      alert("Search does not match any user");
    } else {
      setState(getUsers);
    }
  };

  const formDisplay = () => {
    var x = document.getElementById("form");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  };

  return (
    <div>
      <div className="menubar">
        <Form.Group controlId="form.user">
          <p></p>
          <Form.Control
            type="text"
            placeholder="user detail"
            value={user.userinfo}
            onChange={(e) => setUserinfo(e.target.value.trimEnd())}
          />
        </Form.Group>
        &nbsp;&nbsp;
        <Button
          className="pull"
          variant="primary"
          onClick={() => filterTable(userinfo)}
        >
          Search
        </Button>
        &nbsp;&nbsp;
        <p></p>
        <button className="register" onClick={() => formDisplay()}>
          Enter new user
        </button>
      </div>
      <modal>
        <div id="form" style={{ display: "none" }}>
          <Container>
            <h3> Register New User</h3>
            <Form>
              <button class="btn-close" onClick={() => formDisplay()}>
                X
              </button>
              <Form.Group controlId="form.Gender">
                <Form.Label>Gender: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter gender"
                  value={user.Gender}
                  onChange={(e) => {
                    setUser({ ...user, Gender: e.target.value });
                  }}
                  autoComplete="off"
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Name">
                <Form.Label>Name: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={user.name}
                  onChange={(e) => {
                    setUser({ ...user, Name: e.target.value });
                  }}
                  autoComplete="off"
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Email">
                <Form.Label>Email: </Form.Label>
                <Form.Control
                  type="text"
                  autocomplete="false"
                  placeholder="Enter email"
                  value={user.email}
                  onChange={(e) => {
                    setUser({ ...user, Email: e.target.value });
                  }}
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Username">
                <Form.Label>Username: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={user.username}
                  onChange={(e) => {
                    setUser({ ...user, Username: e.target.value });
                  }}
                  autoComplete="off"
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Password">
                <Form.Label>Password: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter password"
                  value={user.password}
                  onChange={(e) => {
                    setUser({ ...user, Password: e.target.value });
                  }}
                  autoComplete="off"
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.DOB">
                <Form.Label>DOB: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter DOB"
                  value={user.dob}
                  onChange={(e) => {
                    setUser({ ...user, DOB: e.target.value });
                  }}
                  autoComplete="off"
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Phone">
                <Form.Label>Phone number: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, Phone: e.target.value })}
                  autoComplete="phone-number"
                />
              </Form.Group>
              <p></p>
              <Button
                onClick={() => submitUser(user)}
                variant="primary"
                type="reset"
              >
                Submit
              </Button>
            </Form>
          </Container>
        </div>
      </modal>
      {edituser ? (
        <div>
          <Container>
            <h3> Edit User</h3>
            <Form>
              <button class="btn-close" onClick={() => formDisplay()}>
                {" "}
                X{" "}
              </button>
              <Form.Group controlId="form.Gender">
                <Form.Label>Gender: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={edituser.Gender}
                  value={edituser.Gender}
                  onChange={(e) =>
                    setEdituser({ ...edituser, Gender: e.target.value })
                  }
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Name">
                <Form.Label>Name: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={edituser.Name}
                  onChange={(e) =>
                    setEdituser({ ...edituser, Name: e.target.value })
                  }
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Email">
                <Form.Label>Email: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter email"
                  value={edituser.Email}
                  onChange={(e) =>
                    setEdituser({ ...edituser, Email: e.target.value })
                  }
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Username">
                <Form.Label>Username: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={edituser.Username}
                  onChange={(e) =>
                    setEdituser({ ...edituser, Username: e.target.value })
                  }
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Password">
                <Form.Label>Password: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter password"
                  value={edituser.Password}
                  onChange={(e) =>
                    setEdituser({ ...edituser, Password: e.target.value })
                  }
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.DOB">
                <Form.Label>DOB: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter DOB"
                  value={edituser.DOB}
                  onChange={(e) =>
                    setEdituser({ ...edituser, DOB: e.target.value })
                  }
                />
              </Form.Group>
              <p></p>
              <Form.Group controlId="form.Phone">
                <Form.Label>Phone number: </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={edituser.Phone}
                  onChange={(e) =>
                    setEdituser({ ...edituser, Phone: e.target.value })
                  }
                />
              </Form.Group>
              <p></p>
              <Button
                onClick={() => updateUser(edituser)}
                variant="primary"
                type="reset"
              >
                Update
              </Button>
            </Form>
          </Container>
        </div>
      ) : null}
      <p></p>
      <p></p>
      <h2>Users Details:</h2>
      <table class="styled-table">
        <thead>
          <tr>
            <th>Gender</th>
            <th>Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Username</th>
            <th>Password</th>
            <th>Phone</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {state.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.Gender}</td>
                <td>{item.Name}</td>
                <td>{item.Email}</td>
                <td>{item.DOB}</td>
                <td>{item.Username}</td>
                <td>{item.Password}</td>
                <td>{item.Phone}</td>
                <td>
                  <button
                    onClick={() => editUser(item.Username)}
                    variant="primary"
                  >
                    Edit User
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => deleteUser(item.Username)}
                    variant="primary"
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
