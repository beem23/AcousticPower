import React from 'react'
import MainPageStyles from './MainPageStyles';


function Search({ handleSearch }) {
    return (
        <input
            style={MainPageStyles.inputField}
            type="text"
            onChange={handleSearch}
            placeholder="Search clients..."
        />
    )
}

export default Search