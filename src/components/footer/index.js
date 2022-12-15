import React from "react";
import logo from '../../logo.svg';

const Footer = () => {
    return (
        <div className="footer-section">

            <div className="card-icon">
                <img src="/assets/icons/logo.png" alt="logo" />
                <div>Activity Board</div>
            </div>

            <div className="footer-content">
                <div className="text-card">
                    <div className="color-div"></div>
                    <div className="card-text">
                        <div>Daily Tax Received  :</div>
                        <b>RM 158,220.00</b>
                    </div>
                </div>

                <div className="text-card">
                    <div className="color-div"></div>
                    <div className="card-text">
                        <div>Overdue Case  :</div>
                        <b>5,226</b>
                    </div>
                </div>
            </div>
            
        </div>
    )
}


export default Footer;