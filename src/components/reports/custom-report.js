import  { FaFilePdf, FaFileExcel, FaFileWord, FaFilePowerpoint} from 'react-icons/fa';

import BarChart1 from "../graphs/BarChart1"
import BarChart2 from "../graphs/BarChart2"
import CustomBarChart from '../graphs/CustomBarChart';
import HorizontalBar from "../graphs/HorizontalBarChart"

const CustomReport = ({ district, data:{ tax, licenses, rental }, toggleCustomReport }) => {
    // get and aggregate(ditricts) the data

    let taxData = tax.filter(entry => entry['District Name'] === "Pulau-Pulau");
    let currentDistrict, currentRevenue = "";
    let licenseData = licenses.map(lic => {
        if(lic['District Name']) {
          currentDistrict = lic['District Name'];
          currentRevenue = lic['Total Revenue'];

        } else {

          lic['District Name'] = currentDistrict;
          lic['Total Revenue'] = currentRevenue;

        }

        return lic;
    }).filter(entry => entry['District Name'] === "Pulau-Pulau");

    let rentalData = rental.filter(entry => entry['District Name'] === "Pulau-Pulau");

    console.log(licenseData);

    return (
        <div className="report-summary">
            <div className="title-section">
                <div className="card-icon">
                <img src="/assets/icons/logo.png" alt="logo" />
                    <div>Custom Report</div>
                </div>
            </div>

            <div className="report-header d-flex">
                <div className="text-card">
                    <div className="color-div"></div>
                    <div className="card-text">
                        <div>Pulau-Pulau</div>
                    </div>
                </div>

                <div className="close-btn" onClick={toggleCustomReport}>
                    <img src="/assets/icons/cross.png" alt="close-btn" height={"20px"}/>
                </div>

                <div className="d-none export-options">
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

            <div className="reports-body">
                <div className='d-flex report-summary-section'>
                     {/* license types */}

                    <div className='title'>
                        Licenses Report
                    </div>

                    { licenseData[0] && <LicenseReport data={licenseData} /> }

                </div>

                <div className='d-flex report-summary-section'>
                    {/* cases and amount (overdue) */}
                    <div className='title'>
                        Tax Report
                    </div>

                    { taxData[0] && <TaxReport data={taxData}/> }

                </div>  

                

                <div className="d-flex report-summary-section">
                    <div className='title'>
                        Rental Units
                    </div>

                    <div className=''>
                        <div className='bar-graph'>
                            <BarChart1 />
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}


const TaxReport = ({ data }) => {
    let fields = ["Total Assessment Case", "Total Overdue Case", "Current Overdue Amount", 
        "Accumulated Overdue Amount",	"Current Year Collection" 
    ];

    let casesData =  {
        'Assessment': data[0]["Total Assessment Case"],
        'Overdue':data[0]["Total Overdue Case"]
    };

    let taxAmount = {
        "Current": data[0]["Current Overdue Amount"], 
        "Accumulated": data[0]["Accumulated Overdue Amount"],	
        // "Current Year Collection": data[0]["Current Year Collection"] 
    }

    // console.log(taxAmount);

    return (
        <div className='bar-graph-section d-flex'>
            <div className='bar-graph'>
                <CustomBarChart items={casesData} title="Tax Cases"/>
            </div>

            <div className='bar-graph'>
                <CustomBarChart items={taxAmount} title="Overdue Amount"/>
            </div>
        
        </div>
    )
}


const LicenseReport = ({data}) => {
    let items = {};

    data.forEach(item => {
        items[item['License Type']] = {
            'Expired':item['Total License Expired'],
            'Issued / Renewed':item['Total License Issued / Renewed']
        };

    })

    // expired 
    console.log(items);

    // issued
    return (
        <div className='bar-graph-section d-flex'>
            <div className='bar-graph'>
                <CustomBarChart items={items['General License']} title="General License"/>
            </div>
            
            <div className='bar-graph'>
                <CustomBarChart items={items["Hawker License"]} title="Hawker License"/>
            </div>

            <div className='bar-graph'>
                <CustomBarChart items={items['Advertisement License']} title="Advertisement License"/>
            </div>
        </div>
    );
}



const RentalReport = ({rental}) => {
    // Total Unit	Unit Available	Total Rent

    <div className='bar-graph-section d-flex'>
            <div className='bar-graph'>
                {/* <CustomBarChart items={items['General License']} title="General License"/> */}
            </div>
            
            <div className='bar-graph'>
                {/* <CustomBarChart items={items["Hawker License"]} title="Hawker License"/> */}
            </div>

            <div className='bar-graph'>
                {/* <CustomBarChart items={items['Advertisement License']} title="Advertisement License"/> */}
            </div>
        </div>
}

export default CustomReport;