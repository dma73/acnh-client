import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';

async function loginUser(credentials) {
 return fetch('https://desktop-pjt8gar:3001/api/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
    console.log("username",username);
    console.log("password",password);

  const handleSubmit = async e => {
    e.preventDefault();
    //const token = 'AIGS-6DGI-HD90-092H-FD72';
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
  }

  return(
      <div className="overlay">
    <div className="d-flex flex-column top">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input className="m-2 form-control col-sm-10" type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input className="m-2 form-control col-sm-10" type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button className="btn btn-primary m-2" type="submit">Submit</button>
        </div>
      </form>
    </div>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};