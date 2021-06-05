import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Villagers from "./Components/villagers";
import Login from "./Components/login";
import CreateLogin from "./Components/createlogin";

class App extends Component {
  

  state = {
    token: undefined,
    loginCreated: true,
    loginFailed: false,
    user: ""
  };

 
  setToken(token,user) {
    console.log('token before: ', token);
    if (Object.entries(token).length === 0){
      token = undefined;
      this.setState({ loginFailed: true }, () => {
        console.log('login failed');
      });
    } else {
      this.setState({ loginFailed: false }, () => {
        console.log('login successful');
      });
    } 
    console.log('token after if : ', token);
    this.setState({ token: token, user:user }, () => {
      console.log('token after set state : ',this.state.token);
    });
  }

  setTokenBound = this.setToken.bind(this);

  setLoginCreated(loginCreated) {
    this.setState({ loginCreated: loginCreated }, () => {
      console.log("loginCreated", this.state.loginCreated);
    });
  }

  setLoginCreatedBound = this.setLoginCreated.bind(this);

  render() {
    console.log('token: ',this.state.token, ' logincreated: ', this.state.loginCreated )
    if (!this.state.token) {
      return this.getSecurityScreen();
    } else {
      return this.getMainSection();
    }
  }
  getSecurityScreen(){
    let method = this.getLoginForm();
    if (!this.state.loginCreated) {
      method = this.getCreateUserForm();
    }
    return method;
  }
  handleLogout(){
    const userId = this.state.user;
    this.setState({token:undefined, user:""}, () => {
      console.log("User: ", userId, " has disconnected");

    })
  }
  handleLogoutBound = this.handleLogout.bind(this);
  getMainSection() {
    return (
      <div className="bg-dark flex">
        <h1 className="p-2 text-white">Application</h1>
        <label className="btn btn-secondary m-2" onClick={this.handleLogoutBound}>Logout {this.state.user}</label>
        <BrowserRouter>
          <Switch>
            <Route path="/villagers">
              <Villagers
                user={this.state.user} token={this.state.token}/>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }

  getLoginForm() {
    return (
      <Login
        setToken={this.setTokenBound}
        setLoginCreated={this.setLoginCreatedBound}
        loginFailed={this.state.loginFailed} />
    );
  }

  getCreateUserForm() {
    return <CreateLogin setLoginCreated={this.setLoginCreatedBound} />;
  }

  }

export default App;
