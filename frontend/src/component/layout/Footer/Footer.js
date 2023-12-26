import React from 'react';
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css"

const Footer = () => {
  return (

    <footer id="footer">
        <div className='leftFooter'>
            <h4>DOWNLOAD OUR APP</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <img src={playStore} alt='playstore' />
            <img src={appStore} alt='Appstore' />
        </div>

        <div className='midFooter'>
            <h1>Ecommerce</h1>
            <p>High Quality is our first priority</p>

            <p>Copyrights 2023 &copy; Gargi Chaudhari</p>
        </div>

        <div className='rightFooter'>
            <h4>Follow Me</h4>
            <a href='https://www.instagram.com/__.gargii._/' target='_blank'>Instagram</a>
            <a href='https://www.linkedin.com/in/gargi-chaudhari-110514240/' target='_blank'>LinkedIn</a>
            <a href='https://github.com/gargi0310' target='_blank'>GitHub</a>
        </div>


    </footer>
   
  );
};

export default Footer