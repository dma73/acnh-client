import React from 'react';
import PropTypes from 'prop-types';

export default function ToggleCheckBox({ filterAlreadyOwned, cbLabel, setToggleMethod }) {

  return(
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={filterAlreadyOwned}
            id="flexCheckChecked"
            defaultChecked
            onChange={(e) => {
              console.log(e.target.value);
              setToggleMethod(e);
            }}
          />
          <label
            className="form-check-label m-2 bg-dark text-white"
            for="flexCheckChecked"
          >
            {cbLabel}
          </label>
        </div>
    );
  
}
ToggleCheckBox.propTypes = {
    filterAlreadyOwned: PropTypes.bool.isRequired,
    cbLabel: PropTypes.string.isRequired,
    setToggleMethod: PropTypes.func.isRequired
};