import React from "react";
import { Component } from "react";
import { Checkmark } from "react-checkmark";

class PictureOwned extends Component {
  updatePictureStatus = () => {
    this.props.updateMethod(this.props.villager);
  }
  render() {
    let section = <Checkmark />;
    if (!this.props.villager.pictureOwned) {
      section = (
        this.getButton()
      );
    }
    return <div>{section}</div>;
  }
  getButton(){
    return <button
          className='btn btn-primary m-1'
          id={this.props.villager.id}
          name={this.props.villager.id}
          onClick={this.updatePictureStatus}
        >
          Je l'ai!
        </button>
  }
}

export default PictureOwned;
