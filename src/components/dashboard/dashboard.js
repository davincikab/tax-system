
// import logo from '../../logo.svg';
import React, { useState, useEffect } from 'react';
import { FaChartLine, FaThLarge, FaChartBar } from 'react-icons/fa';
import BarChart1 from '../graphs/BarChart1';
import BarChart2 from '../graphs/BarChart2';
import HorizontalBar from '../graphs/HorizontalBarChart';
import { PieComponent } from '../graphs/PieChart';


const Dashboard = (props) => {
    const [ state, setState ] = useState({
        activeTab:'Tax Collection'
    });

    const setActiveTab = (tab) => {
        setState({
            ...state,
            activeTab:tab
        });

    }

    const getClassName = (tab) => {
        return tab === state.activeTab ? 'toggler-item active' : 'toggler-item';
    }

    let { activeTab } = state;
    let date = new Date();
    
    return (
        <div className="dashboard-card">
            <div className="header">
                <div className="header__inner d-flex">
                    <div className="card-icon">
                        <img src="/assets/icons/logo.png" alt="logo" />
                        <div>{activeTab}</div>
                    </div>

                    <div className="date">
                        {date.toDateString()}
                    </div>
                </div>
                

                <div className="toggler-section d-flex">
                    <div 
                        className={getClassName("Tax Collection")}
                        id="tax-collection" 
                        onClick={() => setActiveTab('Tax Collection')}
                    >
                        <img src="/assets/icons/dashboard.png" alt="logo" />
                    </div>

                    <div 
                        className={getClassName("KPI Metrics")} 
                        id="kpi-metric" 
                        onClick={() => setActiveTab('KPI Metrics')}
                    >
                        <img src="/assets/icons/statistic.png" alt="logo" />
                    </div>

                    <div 
                        className={getClassName('Data Analytics')} 
                        id="data-analytic" 
                        onClick={() => setActiveTab('Data Analytics')}
                    >
                        <img src="/assets/icons/graph.png" alt="logo" />
                    </div>

                </div>
            </div>

            <div className="dashboard-content">
                { activeTab === "Tax Collection" && <TaxCollectionCard /> }
                { activeTab === "Data Analytics" && <StatsSection /> }
                { activeTab === "KPI Metrics" && <KpiMetrics /> }
            </div>
        </div>
    );
}

// respective card
const TaxCollectionCard = (props) => {
    let date = new Date();
    let localeString = date.toLocaleDateString();
    localeString = localeString.replace(/\//g, ".");

    return (
        <div className='section'>

            <div className='section-title'>
                Updated Data <span>{localeString} {date.toLocaleTimeString()}</span>
            </div>

            <div className='section-body'>
                <div className='section-card'>
                    <div className="text-card">
                        <div className="color-div"></div>
                        <div className="card-text">
                            <div>TOTAL TAX FILE  :</div>
                            <b>RM 158,220.00</b>
                        </div>
                    </div>

                    <div className='content'>
                        <div className='content-item'>
                            <div>COLLECTED  :</div>
                            <b>18,692</b>
                        </div>

                        <div className='content-item'>
                            <div>UNCOLLECTED :</div>
                            <b>7,130</b>
                        </div>
                    </div>
                </div>

                <div className='section-card'>
                    <div className="text-card">
                        <div className="color-div"></div>
                        <div className="card-text">
                            <div>TOTAL AMOUNT  :</div>
                            <b>RM 125,220,000.00</b>
                        </div>
                    </div>

                    <div className='content'>
                        <div className='content-item'>
                            <div>COLLECTED  :</div>
                            <b>85,825,000.00</b>
                        </div>

                        <div className='content-item'>
                            <div>UNCOLLECTED :</div>
                            <b>RM 39,805,000.00</b>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}


// stats
const StatsSection = (props) => {
    return (
        <div className='stats-section'>
            <div className="text-card">
                <div className="color-div"></div>
                <div className="card-text">
                    <div>TOTAL TAX FILE  :</div>
                    <b>RM 158,220.00</b>
                </div>
            </div>

            <div className='graph-section' >
                <div className='horizontal-graph'>
                    <HorizontalBar />
                </div>
            </div>
        </div>
    )
}

const KpiMetrics = (props) => {
    return (
        <div className='stats-section'>
            <div className="text-card">
                <div className="color-div"></div>
                <div className="card-text">
                    <div>Daily Target  :</div>
                    <b>200</b>
                </div>
            </div>

            <div className='stats-summary'>
                <div className='d-flex count'>
                    <div className='text d-flex'>
                        <div>COLLECTED  :  </div>
                        <b>150</b>
                    </div>

                    <div className='text d-flex'>
                        <div>UNCOLLECTED  :  </div>
                        <b>150</b>
                    </div>
                </div>
                

                <div className='text d-flex'>
                    <div>COLLECTED AMOUNT :  </div>
                    <b>RM 28,355.00</b>
                </div>
            </div>

            <div className='graph-section'>
                <div className=''>
                    <div className='graph-title'>Last 7days Collection</div>

                    <div className=''>
                        <div className='bar-graph'>
                            <BarChart1 />
                        </div>

                        <div className='pie-chart'>
                            <PieComponent />
                        </div>
                    </div>
                </div>

                <div className=''>
                    <div className='graph-title'>Collection By Weeks</div>

                    <div className=''>
                        <div className='bar-graph'>
                            <BarChart2 />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Dashboard;