import React from 'react'

const Notify = ({ errorMessage }) => {
    return (
        <div style={{ backgroundColor: 'red'}}>{errorMessage}</div>
    )
}

export default Notify