import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import axios from "axios";
import "./home.css";

function Home() {
  const [state, setState] = useState([]);
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [searchuser, setSearchuser] = useState();
  const [edituser, setEdituser] = useState();

  useEffect(() => {
    const users = localStorage.getItem("users");
    if (localStorage.getItem("users") === null) {
      axios
        .get("https://randomuser.me/api/0.8/?results=20")
        // fetch('https://randomuser.me/api/0.8/?results=20')
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
      console.log(parsedUser);
    }
  }, []);

  const submitUser = (user) => {
    if(user.Username==null){
      alert ("Enter user details")
    }
    else{
    alert("User is registered!!");
    const data = JSON.parse(localStorage.getItem("users"));
    data.push(user);
    localStorage.clear();
    localStorage.setItem("users", JSON.stringify(data));
    setState(data);
    }
  };

  const submitUsername = (username) => {
    const users = JSON.parse(localStorage.getItem("users"));
    const getUser = users.find((user) => user.Username === username);
    setSearchuser(getUser);
    if (getUser == null) {
      alert(`User  with username: ${username} does not exist`);
    }
    setEdituser();
  };

  const deleteUser = (username) => {
    const users = JSON.parse(localStorage.getItem("users"));
    const getUsers = users.filter((user) => user.Username !== username);
    localStorage.clear();
    localStorage.setItem("users", JSON.stringify(getUsers));
    setState(getUsers);
    setEdituser();
    setSearchuser();
    alert(`User  with username: ${username} has been removed`);
  };

  const editUser = (username) => {
    const users = JSON.parse(localStorage.getItem("users"));
    const getUser = users.find((user) => user.Username === username);
    setEdituser(getUser);
    if (!getUser) {
      alert(`User  with username: ${username} does not exist`);
    }
    setSearchuser();
  };
  const updateUser = (edituser) => {
    const users = JSON.parse(localStorage.getItem("users"));
    const getUsers = users.filter(
      (user) => user.Username !== edituser.Username
    );
    console.log(getUsers);
    getUsers.push(edituser);
    localStorage.clear();
    localStorage.setItem("users", JSON.stringify(getUsers));
    setState(getUsers);
    setEdituser();
    alert("User is updated!!");
  };

  const formDisplay = () => {
    var x = document.getElementById("form");
    console.log(x.style)
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    
  };

  return (
    <div>
      <h2>Existing Users's Details:</h2>
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
              </tr>
            );
          })}
        </tbody>
      </table>
      <p></p>
      <button onClick={() => formDisplay()}>Enter new user</button>
      <div id="form" style={{display:"none"}}>
        <Container>
          <h3> Register New User</h3>
          <Form>
            <Form.Group controlId="form.Gender">
              <Form.Label>Gender: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter gender"
                value={user.Gender}
                onChange={(e) => setUser({ ...user, Gender: e.target.value })}
              />
            </Form.Group>
            <p></p>
            <Form.Group controlId="form.Name">
              <Form.Label>Name: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={user.name}
                onChange={(e) => setUser({ ...user, Name: e.target.value })}
              />
            </Form.Group>
            <p></p>
            <Form.Group controlId="form.Email">
              <Form.Label>Email: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={user.email}
                onChange={(e) => setUser({ ...user, Email: e.target.value })}
              />
            </Form.Group>
            <p></p>
            <Form.Group controlId="form.Username">
              <Form.Label>Username: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={user.username}
                onChange={(e) => setUser({ ...user, Username: e.target.value })}
              />
            </Form.Group>
            <p></p>
            <Form.Group controlId="form.Password">
              <Form.Label>Password: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter password"
                value={user.password}
                onChange={(e) => setUser({ ...user, Password: e.target.value })}
              />
            </Form.Group>
            <p></p>
            <Form.Group controlId="form.DOB">
              <Form.Label>DOB: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter DOB"
                value={user.dob}
                onChange={(e) => setUser({ ...user, DOB: e.target.value })}
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
              />
            </Form.Group>
            <p></p>
            <Button onClick={() => submitUser(user)} variant="primary">
              Submit
            </Button>
          </Form>
        </Container>
      </div>
      <p></p>
      <h2> Search a user:</h2>
      <Form.Group controlId="form.user">
        <Form.Label>User: </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={user.username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <p></p>
      <Button variant="primary" onClick={() => submitUsername(username)} >
        User Details
      </Button>&nbsp;&nbsp;
      {searchuser ? (
        <div class="user_details">
          <p>Gender:{searchuser.Gender}</p>
          <p>Name:{searchuser.Name}</p>
          <p>Email:{searchuser.Email}</p>
          <p>Password:{searchuser.Password}</p>
          <p>DOB:{searchuser.DOB}</p>
          <p>Phone number:{searchuser.Phone}</p>
        </div>
      ) : null}

      <button onClick={() => editUser(username)} variant="primary">
        Edit User
      </button>&nbsp;&nbsp;

      <button onClick={() => deleteUser(username)} variant="primary">
        Delete User
      </button>&nbsp;&nbsp;
      {edituser ? (
        <div>
          <Container>
            <h3> Edit User</h3>
            <Form>
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
                  readonly="readonly"
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
                onClick={() => updateUser(edituser, { searchuser })}
                variant="primary"
              >
                Update
              </Button>
            </Form>
          </Container>
        </div>
      ) : null}
      <p></p>
    </div>
  );
}

export default Home;
