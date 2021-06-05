import React from 'react'
import PictureOwned from './PictureOwned'
import ToggleCheckBox from './togglecheckbox';
import { Component } from 'react'

class Villagers extends Component {
  fileReader = new FileReader();
  state = {
    filterAlreadyOwned: true,
    villagers: [],
    filteredVillagers: [],
  };

  componentDidMount() {
    console.log('token:',this.props.token);
    //fetch('http://dmathys.com:3001/villagersitems')
    fetch("https://dmathys.com:3001/api/villagersitemsget", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token:this.props.token})
    })
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
    )
  }
  toggleCheckBoxBound = this.toggleCheckBox.bind(this);
  initFilteredList() {
    let villagers = [...this.state.villagers];
    villagers = this.filterAlreadyOwned(villagers);
    this.setState({ filteredVillagers: villagers }, () => {
      console.log(this.state.filteredVillagers);
    });
  }

  getHeader() {
    return (
      <div className="mb-2 bg-dark">
        <center>
          <h1 className="p-3 mb-2 bg-dark text-white">Liste des photos</h1>
        </center>
        <div className="mb-2 form-inline">
          {this.getButton()}
          {this.getFilter()}
          <ToggleCheckBox filterAlreadyOwned={this.state.filterAlreadyOwned} 
            cbLabel='ne montrer que les manquantes' 
            setToggleMethod = {this.toggleCheckBoxBound} /> 
        </div>
      </div>
    );
  }
  getFilter() {
    "U+1F50E";
    return (
      <label
        htmlFor="filter"
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
  filterAlreadyOwned(filteredList) {
    if (this.state.filterAlreadyOwned) {
      filteredList = filteredList.filter((value) => value.pictureOwned === false);
    }
    return filteredList;
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
    console.log("villager", villager);
    console.log("token", this.props.token)
    villager.pictureOwned = true;
    villager.token = this.props.token;
    console.log("villager", villager);
    fetch("https://dmathys.com:3001/api/villagersitems/" + villager.id, {
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
    villager.token = this.props.token;
    //fetch('http://dmathys.com:3001/villagersitems')
    fetch("https://dmathys.com:3001/api/villagersitems/0", {
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

    

  render() {
    console.log('render');
    return (
      <div>
        {this.getHeader()}
        {this.state.filteredVillagers.map((villager) => (
          <div className="card" key={villager.id}>
            <div className="card-body">
              <h5 className="card-title">{villager.name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{villager.type}</h6>
              <PictureOwned villager ={villager} updateMethod={this.updatePictureStatusBound} />
            </div>
          </div>
        ))}
      </div>
    )
  };
}

export default Villagers