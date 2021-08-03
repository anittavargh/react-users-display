import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
// import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import ReactPaginate from "react-paginate";

//  import { useForm } from "react-hook-form";
// import { yupResolver } from '@hookform/resolvers/yup';
// import { Formik } from "formik";
// import * as yup from "yup";
// import { TablePagination } from 'react-pagination-table';

import axios from "axios";
import "./home.css";

export default function Home() {
  const [state, setState] = useState([]);
  const [user, setUser] = useState({});
  const [editusername, setEditusername] = useState();
  const [show, setShow] = useState(false);
  const [modalmessage, setModalmessage] = useState("");

  const [postsPerPage] = useState(15);
  const [offset, setOffset] = useState(0);
  const [posts, setAllPosts] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    getData();
  }, [pageCount]);

  const getData = () => {
    const users = localStorage.getItem("users");
    console.log(users);
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
          const slice = state.slice(0 + offset, postsPerPage + offset);
          setAllPosts(slice);
          setPageCount(Math.ceil(state.length / postsPerPage));
        })
        .catch((err) => err.message);
    } else {
      const parsedUser = JSON.parse(users);
      setState(parsedUser);
      const slice = parsedUser.slice(0 + offset, postsPerPage + offset);
      setAllPosts(slice);
      setPageCount(Math.ceil(parsedUser.length / postsPerPage));
    }
  };

  const handlePageClick = (event) => {
    console.log(event.selected);
    const selectedPage = event.selected;
    console.log(selectedPage);
    if (selectedPage >= 1) {
      setOffset(selectedPage * postsPerPage);
      setPageCount(selectedPage)
      console.log(offset);
    } else {
      setOffset(selectedPage);
      setPageCount(selectedPage)
    }
  };

  const submitUser = (user) => {
    const currentOffset=offset
    console.log("current",currentOffset)
    if (Boolean(editusername)) {
      const users = JSON.parse(localStorage.getItem("users"));
      const getUsers = users.filter((user) => user.Username !== editusername);
      getUsers.push(user);
      localStorage.clear();
      localStorage.setItem("users", JSON.stringify(getUsers));
      setState(getUsers);
      getData()
      setModalmessage("User is updated!!");
      setEditusername()
      handleShow();
      setUser({});
      formDisplay();
    } else {
      const isUsernameAvailable = Boolean(user.Username);
      const isEmailAvailable = Boolean(user.Email);
      const isPasswordAvailable = Boolean(user.Password);
      console.log({
        isUsernameAvailable,
        isEmailAvailable,
        isPasswordAvailable,
      });
      if (!user.Username || !user.Email || !user.Password) {
        setModalmessage(
          "Enter user details --> mandatory to input Username, Email && Password"
        );
        handleShow();
        setUser({});
      } else if (
        state.find((person) => person.Username === user.Username) != null
      ) {
        setModalmessage("Username already exists, enter a new username");
        handleShow();
        setUser({});
      } else {
        setModalmessage("User is registered!!");
        handleShow();
        const data = JSON.parse(localStorage.getItem("users"));
        data.push(user);
        localStorage.clear();
        localStorage.setItem("users", JSON.stringify(data));
        setState(data);
        getData()
        setUser({});
      }
      formDisplay();
    }
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
      getData()
      setModalmessage(`User with username: ${username} is removed`);
      handleShow();
    } else {
      setModalmessage(`User with username: ${username} is not removed`);
      handleShow();
    }
  };

  const editUser = (username) => {
    var x = document.getElementById("form");
    x.style.display = "block";
    const users = JSON.parse(localStorage.getItem("users"));
    const getUser = users.find((user) => user.Username == username);
    setEditusername(username);
    setUser(getUser);
  };

  const filterTable = (userinfo) => {
    const users = JSON.parse(localStorage.getItem("users"));
    if (!Boolean(userinfo)) {
      setState(users);
      getData()
    } else {
      const matchingUsers = [];
      users.map((user) => {
        const userData = Object.values(user);
        const checkForSubstring = userData
          .map((element) => {
            const stringifyElement = element.toString();
            if (stringifyElement.includes(userinfo)) {
              return user;
            }
          })
          .filter((element) => element);

        if (checkForSubstring.length !== 0) {
          matchingUsers.push(checkForSubstring[0]);
        }
      });
      setAllPosts(matchingUsers);
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <div id="alert">
        <Modal show={show} onHide={handleClose}>
          <ModalHeader as="span">
            <ModalTitle as="h4">Hi</ModalTitle>
          </ModalHeader>
          <ModalBody as="section">{modalmessage}</ModalBody>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal>
      </div>
      &nbsp;&nbsp;
      <div className="menubar">
        <Form.Group controlId="form.user">
          <p></p>
          <Form.Control
            type="text"
            placeholder="user detail"
            value={user.userinfo}
            onChange={(e) => {
              console.log(e.value);
              filterTable(e.target.value.trim());
            }}
          />
        </Form.Group>
        &nbsp;&nbsp; &nbsp;&nbsp;
        <p></p>
        <button className="register" onClick={() => formDisplay()}>
          + Create New User
        </button>
      </div>
      <modal>
        <div id="form" style={{ display: "none" }}>
          <Container>
            <h3> User</h3>
            <Form>
              <button class="btn-close" onClick={() => formDisplay()}>
                X
              </button>
              <Form.Group controlId="form.Gender">
                <Form.Label>Gender: </Form.Label>
                <Form.Control
                  type="text"
                  name="gender"
                  placeholder={user.Gender}
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
                  placeholder={user.Name}
                  value={user.Name}
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
                  placeholder={user.Email}
                  value={user.Email}
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
                  placeholder={user.Username}
                  value={user.Username}
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
                  type="password"
                  placeholder={user.Password}
                  value={user.Password}
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
                  type="date"
                  placeholder={user.DOB}
                  value={user.DOB}
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
                  type="number"
                  placeholder={user.Phone}
                  value={user.Phone}
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
      <p></p>
      <p></p>
      <h2>Users Details</h2>
      <table class="styled-table">
        <thead>
          <tr>
            <th>Gender</th>
            <th>Name</th>
            <th>Email</th>
            <th>DOB</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.Gender}</td>
                <td>{item.Name}</td>
                <td>{item.Email}</td>
                <td>{item.DOB}</td>
                <td>{item.Username}</td>
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
      <div>
        <p></p>
        <p></p>
        <p></p>
        <p>
          <ReactPaginate
            // previousLabel={"previous"}
            // nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
  );
}
