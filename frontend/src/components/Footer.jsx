import React from 'react'
import { Link } from 'react-router-dom'

const footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        {/* Quick Links */}
        <div className='footer-section'>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="./about">About Us</Link></li>
            <li><a href='#'>Contact</a></li>
            <li><a href='#'>FAQs</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className='footer-section'>
          <h4>Follow Us</h4>
          <div className='social-links'>
            <a href='https://www.linkedin.com/in/badal-maurya-14948a256'>Linkedin</a>
            <a href='#'>Twitter</a>
            <a href='https://www.instagram.com/badalofficial2.0?igsh=MXM0ODFtcThwc211NQ=='>Instagram</a>
          </div>
        </div>

        {/* Company Info */}
        <div className='footer-section'>
          <h4>Company</h4>
          <p>Email: badalmaurya101@gmail.com</p>
          <p>Phone: 6307370257</p>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© 2026 ShopMart. All rights reserved. <br /> Built by Badal Maurya🤗</p>
      </div>
    </footer>
  )
}

export default footer
