import  { FaFilePdf, FaFileExcel, FaFileWord, FaFilePowerpoint} from 'react-icons/fa';

import BarChart1 from "../graphs/BarChart1"
import BarChart2 from "../graphs/BarChart2"
import HorizontalBar from "../graphs/HorizontalBarChart"

const CollectionManagementSection = (props) => {
    return (
        <div className="report-summary">
            <div className="title-section">
                <div className="card-icon">
                <img src="/assets/icons/logo.png" alt="logo" />
                    <div>Tax Collection Management</div>
                </div>
            </div>

            <div className="report-body d-flex">
                <div className=''>
                    <div className="text-card">
                        <div className="color-div" style={{ backgroundColor:"orange"}}></div>
                        <div className="card-text">
                            <div>{props.district}</div>
                        </div>
                    </div>

                    <div className="text-card">
                        <div className="color-div"></div>
                        <div className="card-text">
                            <div>Daily Tax Received  :</div>
                            <b>RM 158,220.00</b>
                        </div>
                    </div>
                </div>

                <div className=''>

                </div>
            </div>
        </div>
    )
}


export default CollectionManagementSection;