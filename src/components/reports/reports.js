import  { FaFilePdf, FaFileExcel, FaFileWord, FaFilePowerpoint} from 'react-icons/fa';

import BarChart1 from "../graphs/BarChart1"
import BarChart2 from "../graphs/BarChart2"
import HorizontalBar from "../graphs/HorizontalBarChart"

const ReportSection = (props) => {
    return (
        <div className="report-summary">
            <div className="title-section">
                <div className="card-icon">
                <img src="/assets/icons/logo.png" alt="logo" />
                    <div>Tax Assessment - Report</div>
                </div>
            </div>

            <div className="report-header d-flex">
                <div className="text-card">
                    <div className="color-div"></div>
                    <div className="card-text">
                        <div>Collection Summary</div>
                    </div>
                </div>

                <div className="export-options d-flex">
                    <div className="">
                        Export Options:
                    </div>

                    <div className="btn-group d-flex">
                        <div> <FaFileWord color='#ED5565'/> </div>
                        <div> <FaFileExcel color='#ED5565'/> </div>
                        <div> <FaFilePdf color='#ED5565'/> </div>
                        <div> <FaFilePowerpoint color='#ED5565'/> </div>
                    </div>
                </div>
            </div>

            <div className="report-body d-flex">
                <div className='graph-section' >
                    <div className='horizontal-graph'>
                        <HorizontalBar />
                    </div>
                </div>

                <div className="">
                    <div className='bar-graph'>
                        <BarChart1 />
                    </div>

                    <div className='bar-graph'>
                        <BarChart2 />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ReportSection;