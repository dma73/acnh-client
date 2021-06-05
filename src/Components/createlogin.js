import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './login.css';

async function createUser(credentials) {
 return fetch('https://dmathys.com:3001/api/createlogin', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function CreateLogin({ setLoginCreated }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [email, setEmail] = useState();
    console.log("username",username);
    console.log("password",password);
    console.log("confirmPassword",confirmPassword);
    console.log("email",email);

  const handleSubmit = async e => {
    e.preventDefault();
    if (password === confirmPassword){
      await createUser({
        userId:username,
        password:password,
        email:email
     });
      setLoginCreated(true);
    }
  }

  return(
      <div className="overlay">
    <div className="d-flex flex-column top">
      <h1>Please Create User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input className="m-2 form-control col-sm-10" type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input className="m-2 form-control col-sm-10" type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <label>
          <p>ConfirmPassword</p>
          <input className="m-2 form-control col-sm-10" type="password" onChange={e => setConfirmPassword(e.target.value)} />
        </label>
        <label>
          <p>Email Address</p>
          <input className="m-2 form-control col-sm-10" type="text" onChange={e => setEmail(e.target.value)} />
        </label>
        <div>
          <button className="btn btn-primary m-2" type="submit">Submit</button>
        </div>
      </form>
    </div>
    </div>
  )
  
}
CreateLogin.propTypes = {
  setLoginCreated: PropTypes.func.isRequired
};