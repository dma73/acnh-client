import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';

async function loginUser(credentials) {
 return fetch('https://dmathys.com:3001/api/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function Login({ setToken, setLoginCreated, loginFailed }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const displayError = (loginFailed ? {display: 'block'} : {display: 'none'});
    console.log("username",username);
    console.log("password",password);

  const handleSubmit = async e => {
    e.preventDefault();
    //const token = 'AIGS-6DGI-HD90-092H-FD72';
    const token = await loginUser({
      userId:username,
      password:password
    });
    setToken(token.token,username);
  }
  const handleCreateLogin = async e => {
    //e.preventDefault();
    setLoginCreated(false);
  }

  return(
      <div className="overlay">
    <div className="d-flex flex-column top">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label className="text-danger" style={displayError}>
          <p>Invalid Username or Password</p>
        </label>
        <label>
          <p>Username</p>
          <input className="m-2 form-control col-sm-10" type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input className="m-2 form-control col-sm-10" type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <label className="btn btn-secondary m-2" onClick={handleCreateLogin}>Create New User</label>
        </div>
        <div>
          <button className="btn btn-primary m-2" type="submit">Submit</button>
        </div>
      </form>
    </div>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  setLoginCreated: PropTypes.func.isRequired
};