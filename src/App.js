import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Villagers from "./Components/villagers";
import Login from "./Components/login";

class App extends Component {
  fileReader = new FileReader();

  state = {
    token: undefined,
    filterAlreadyOwned: true,
    villagers: [],
    filteredVillagers: [],
  };
  
  componentDidMount() {
    //fetch('http://dmathys.com:3001/villagersitems')
    fetch("https://desktop-pjt8gar:3001/villagersitems")
      .then((res) => res.json())
      .then((data) => {
        console.log("data:", data);
        this.setState({ villagers: this.getSortedList(data) }, () => {
          console.log(this.state.villagers);
          this.initFilteredList();
        });
      })
      .catch((reason) => console.log("error", reason));
  }
 getSortedList(data) {
    return data._embedded.villagerItemList.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  toggleCheckBox(e) {
    let newFlag = !this.state.filterAlreadyOwned;
    this.setState({ filterAlreadyOwned: newFlag }, () =>
      this.initFilteredList()
    );
  }
  initFilteredList() {
    let villagers = [...this.state.villagers];
    villagers = this.filterAlreadyOwned(villagers);
    this.setState({ filteredVillagers: villagers }, () => {
      console.log(this.state.filteredVillagers);
    });
  }

  setToken(token){ 
    this.setState({ token: token }, () => {
      console.log(this.state.token);
    });
  }
  
  setTokenBound = this.setToken.bind(this);

  render() {


  if(!this.state.token) {
    return <Login setToken={this.setTokenBound} />
  }
    return (
      <div className="bg-dark">
        <h1 className="p-2 text-white">Application</h1>
        <BrowserRouter>
          <Switch>
            <Route path="/villagers">
              {this.getHeader()}
              <Villagers
                villagers={this.state.filteredVillagers}
                updateMethod={this.updatePictureStatusBound}
              />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
  getHeader() {
    return (
      <div className="mb-2 bg-dark">
        <center>
          <h1 className="p-3 mb-2 bg-dark text-white">Liste des photos</h1>
        </center>
        <div class="mb-2  form-inline">
          {this.getButton()}
          {this.getFilter()}
          {this.getCheckBox()}
        </div>
      </div>
    );
  }
  getCheckBox() {
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckChecked"
          defaultChecked
          onChange={(e) => {
            console.log(e.target.value);
            this.toggleCheckBox(e);
          }}
        />
        <label
          className="form-check-label m-2 bg-dark text-white"
          for="flexCheckChecked"
        >
          ne montrer que les manquantes
        </label>
      </div>
    );
  }
  getFilter() {
    "U+1F50E";
    return (
      <label
        for="filter"
        className="m-2 bg-dark text-white col-sm-2 col-form-label"
      >
        {"\ud83d\udd0d"}
        <input
          id="filter"
          className="m-2 form-control col-sm-10"
          type="text"
          name="filter"
          onKeyUp={(e) => {
            console.log(e.target.value);
            this.filterEntries(e.target.value);
          }}
        />
      </label>
    );
  }

  getButton() {
    return (
      <label className="btn btn-primary m-2">
        Importer un fichier avec les habitants manquants
        <input
          type="file"
          hidden
          accept=".txt"
          onChange={(e) => this.handleFile(e.target.files[0])}
        />
      </label>
    );
  }

  filterEntries(texte) {
    let temp = [...this.state.villagers];
    console.log("temp", temp);
    console.log("texte", texte);
    temp = temp.filter((value) =>
      value.name.toLowerCase().includes(texte.toLowerCase())
    );
    temp = this.filterAlreadyOwned(temp);
    console.log("temp after", temp);
    this.setState({ filteredVillagers: temp }, () => {
      console.log(this.state.filteredVillagers);
    });
  }
  filterAlreadyOwned(temp) {
    if (this.state.filterAlreadyOwned) {
      temp = temp.filter((value) => value.pictureOwned === false);
    }
    return temp;
  }

  handleFile(file) {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.parseFile;
    this.fileReader.readAsText(file);
  }
  parseFile = (e) => {
    let newVillagers = [];
    let fileContents = this.fileReader.result;
    let lines = fileContents.replace(/\r\n/g, "\n").split("\n");
    lines.forEach((element) => {
      element = element.toLowerCase();
      element = element.replace("photo de ", "");
      element = element.replace("photo d'", "");
      this.saveIfNotEmpty(element, newVillagers);
    });
    this.state.villagers.forEach((item) => {
      newVillagers.push(item);
    });
    newVillagers = newVillagers.sort((a, b) => a.name.localeCompare(b.name));
    this.setState({ villagers: newVillagers }, () => {
      console.log(this.state.villagers);
      this.initFilteredList();
    });
  };
  saveIfNotEmpty(element, newVillagers) {
    if (element.trim() !== "") {
      const villager = { name: element, pictureOwned: false };
      console.log("villager", villager);
      if (!this.state.filterAlreadyOwned) {
        newVillagers.push(villager);
      }
      this.saveItem(villager);
    }
  }

  saveVillager(villager) {
    this.setState((prevState) => {
      let newVillagers = [...prevState.filteredVillagers];
      const index = newVillagers.findIndex((value) => value.id === villager.id);
      this.handleVillager(newVillagers, index, villager);
      return { filteredVillagers: newVillagers };
    });
  }
  handleVillager(newVillagers, index, villager) {
    if (this.state.filterAlreadyOwned) {
      const removedVillager = newVillagers.splice(index, 1);
      console.log("removedVillager", removedVillager);
    } else {
      newVillagers[index].pictureOwned = villager.pictureOwned;
    }
  }

  updatePictureStatus(villager) {
    console.log("this1", this);
    villager.pictureOwned = true;
    fetch("https://desktop-pjt8gar:3001/api/villagersitems/" + villager.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(villager),
    })
      .then(
        function (res) {
          console.log("this2", this);
          return res.json();
        }.bind(this)
      )
      .then(
        function (data) {
          console.log("save returned data:", data);
          console.log("this3", this);
          this.saveVillager(villager);
        }.bind(this)
      )
      .catch((reason) => console.log("error", reason));
  }

  updatePictureStatusBound = this.updatePictureStatus.bind(this);

  saveItem(villager) {
    //fetch('http://dmathys.com:3001/villagersitems')
    fetch("https://desktop-pjt8gar:3001/api/villagersitems/0", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(villager),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("save returned data:", data);
        villager.id = data.id;
      })
      .catch((reason) => console.log("error", reason));
  }
}

export default App;
