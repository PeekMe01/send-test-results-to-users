import React from 'react'
import './nav.css'

export default function Nav(props) {
  return (
    <div>
      <nav className='nav__bar'>
        <h2>Welcome back, {props.user.username}</h2>
        <button className='logout__button' onClick={()=>{
          localStorage.removeItem("user");
          window.location.reload(false);
        }}
          >Logout</button>
      </nav>
    </div>
  )
}
