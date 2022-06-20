import React from 'react'

const Loading = () => {
    return (
        <div className="loader position-fixed w-100 h-100 text-center" style={{background: '#0008', color: 'white', top: 0, left: 0, zIndex: 9}}>
            <div className="loading">
            <div className="spinner">
                <div className="circle"></div>
            </div><br />
            <h2 className="textLoad text-white" style={{letterSpacing:"10px"}}>LOADING...</h2>
            </div>
        </div>
    )
}

export default Loading
