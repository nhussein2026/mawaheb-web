import React from 'react';

const Footer = () => (
  <footer style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'rgb(121 19 19 / 4%)' }} className="p-4 text-center text-rgb(177 24 24)">
    <code>Developed with passion by <a href="http://nhussein.io" target="_blank" rel="noopener noreferrer" style={{ color: '#D49129', transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = '#EAB860'} onMouseOut={(e) => e.currentTarget.style.color = '#D49129'}>nhussein.io</a></code>
  </footer>
);

export default Footer;
