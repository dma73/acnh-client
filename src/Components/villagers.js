import React from 'react'
import PictureOwned from './PictureOwned';
import { Component } from 'react'

class Villagers extends Component {

  render() {
    return (
      <div>
        {this.props.villagers.map((villager) => (
          <div className="card" key={villager.id}>
            <div className="card-body">
              <h5 className="card-title">{villager.name}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{villager.type}</h6>
              <PictureOwned villager ={villager} updateMethod={this.props.updateMethod} />
            </div>
          </div>
        ))}
      </div>
    )
  };
}

export default Villagers