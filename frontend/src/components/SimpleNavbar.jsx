import React from 'react'

const SimpleNavbar = () => {
  return (
    <nav style={{display: 'flex', gap: 12, padding: 12, background: '#0ea5a4', color: 'white'}}>
      <a href="#" style={{color: 'white', textDecoration: 'none', fontWeight: 600}}>Home</a>
      <a href="#courses" style={{color: 'white', textDecoration: 'none'}}>Courses</a>
      <a href="#about" style={{color: 'white', textDecoration: 'none'}}>About</a>
      <a href="#contact" style={{color: 'white', textDecoration: 'none'}}>Contact</a>
    </nav>
  )
}

export default SimpleNavbar
