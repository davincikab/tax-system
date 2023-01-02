import  { FaFilePdf, FaFileExcel, FaFileWord, FaFilePowerpoint} from 'react-icons/fa';
import { useEffect, useState } from 'react';

import BarChart1 from "../graphs/BarChart1"
import BarChart2 from "../graphs/BarChart2"
import CustomBarChart from '../graphs/CustomBarChart';
import HorizontalBar from "../graphs/HorizontalBarChart";

let districtNames = [
    "Bandar Kuala Terengganu",
    "Atas Tol","Batu Buruk","Belara",
    "Bukit Besar","Cabang Tiga","Cenering",
    "Gelugur Kedai","Gelugur Raja","Kepung","Kuala Ibai",
    "Kubang Parit","Losong","Manir","Paluh","Pengadang Buloh",
    "Pulau-Pulau","Rengas","Serada","Tok Jamal"
];

const CustomReport = ({ data:{ tax, licenses, rental }, toggleCustomReport }) => {
    const [ state, setState ] = useState({
        activeReport:'License',
        district:null
    });

    const handleReportToggle = (report) => { 
        setState({
            ...state,
            activeReport:report
        })
    }

    const handleDistrictChange = (e) => {
        setState({
            ...state,
            district:e.target.value
        })
    }

    const getClassName = (report) => {
        return state.activeReport === report ? "toggler-item active" : "toggler-item";
    }
    // get and aggregate(ditricts) the data

    let { activeReport, district } = state;

    let taxData = district !== "" ? tax.filter(entry => entry['District Name'] === district) : [...tax];

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
    });

    licenseData = district ? licenseData.filter(entry => entry['District Name'] === district) : [...licenseData];
    let rentalData = district ? rental.filter(entry => entry['District Name'] === district) : [...rental];
    console.log(rentalData);

    

    return (
        <div className="report-summary">
            <div className='report-toggler'>
                <div className='title'> Report Types</div>

                <div className='section-body'>
                    <div className={getClassName("License")} onClick={() => handleReportToggle("License")}>License</div>
                    <div className={getClassName("Tax Assessment")} onClick={() => handleReportToggle("Tax Assessment")}>Tax Assessment</div>
                    <div className={getClassName("Rental")} onClick={() => handleReportToggle("Rental")}>Rental</div>
                </div>
            </div>

            <div className="title-section">
                <div className="card-icon">
                <img src="/assets/icons/logo.png" alt="logo" />
                    <div>{activeReport}  Report</div>
                </div>
            </div>

            <div className="report-header d-flex">
                <div className="text-card">
                    <div className="color-div"></div>
                    <div className="card-text">
                        <select className='form-control' id='district' onChange={handleDistrictChange}>
                            <option value="">All Districts</option>

                            {
                                districtNames.map(name => <option key={name} value={name}>{name}</option>)
                            }
                        </select>

                        <div>{district}</div>
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
                {activeReport === "License" && <div className='d-flex report-summary-section'>
                     {/* license types */}

                    {/* <div className='title'>
                        Licenses Report
                    </div> */}

                    { licenseData[0] && <LicenseReport data={licenseData} /> }

                </div> }

                { activeReport === "Tax Assessment" && <div className='d-flex report-summary-section'>
                    {/* cases and amount (overdue) */}
                    {/* <div className='title'>
                        Tax Report
                    </div> */}

                    { taxData[0] && <TaxReport data={taxData}/> }

                </div>  }

                

                { activeReport === "Rental" && <div className="d-flex report-summary-section">
                    {/* <div className='title'>
                        Rental Units
                    </div> */}

                    { rentalData[0] && <RentalReport data={rentalData} /> }

                </div> }
            </div>

        </div>
    )
}

const sum = (entries, field) => {
    return entries.reduce((a, b) => {
        a = a + b[field];

        return a;
    }, 0)
}


const TaxReport = ({ data }) => {
    let fields = ["Total Assessment Case", "Total Overdue Case", "Current Overdue Amount", 
        "Accumulated Overdue Amount",	"Current Year Collection" 
    ];

    let casesData =  {
        'Assessment': sum(data, "Total Assessment Case"),
        'Overdue':sum(data, "Total Overdue Case")
    };

    let taxAmount = {
        "Current": sum(data, "Current Overdue Amount"), 
        "Accumulated": sum(data, "Accumulated Overdue Amount"),	
        // "Current Year Collection": data[0]["Current Year Collection"] 
    }

    // console.log(taxAmount);

    // District Name	Total Assessment Case	Total Overdue Case	
    // Current Overdue Amount	Accumulated Overdue Amount	Current Year Collection


    return (
        <div className='bar-graph-section'>
            <div className='d-flex'>
                <div className='bar-graph'>
                    <CustomBarChart items={casesData} title="Tax Cases"/>
                </div>

                <div className='bar-graph'>
                    <CustomBarChart items={taxAmount} title="Overdue Amount"/>
                </div>
            </div>
            

            <div className='table-section'>
                <table className='table'>
                    <thead>
                        <th>District Name</th>
                        <th>Total Assessment Case</th>
                        <th>Total Overdue Case</th>
                        <th>Current Overdue Amount</th>
                        <th>Accumulated Overdue Amount</th>
                        <th>Current Year Collection</th>
                    </thead>

                    <tbody>
                        {
                            data.map(entry => (
                                <tr>
                                    <td>{entry['District Name']}</td>
                                    <td>{entry['Total Assessment Case']}</td>
                                    <td>{entry['Total Overdue Case']}</td>
                                    <td>RM {entry['Current Overdue Amount']}</td>
                                    <td>RM {entry['Accumulated Overdue Amount']}</td>
                                    <td>RM {entry['Current Year Collection']}</td>
                                </tr>
                            ))
                        }
                        
                    </tbody>
                </table>
            </div>
        
        </div>
    )
}


const LicenseReport = ({data}) => {
    let items = {};

    let licenseTypes = data.map(item => item['License Type']);
    licenseTypes = [...new Set(licenseTypes)];

    licenseTypes.forEach(licenseType => {
        let entries = data.filter(item => item['License Type'] === licenseType);

        items[licenseType] = {
            'Expired':sum(entries, 'Total License Expired'),
            'Issued / Renewed':sum(entries, 'Total License Issued / Renewed')
        };


    })

    // data.forEach(item => {
    //     items[item['License Type']] = {
    //         'Expired':item['Total License Expired'],
    //         'Issued / Renewed':item['Total License Issued / Renewed']
    //     };

    // })

    // expired 
    console.log(items);

    // issued
    return (
        <div className='bar-graph-section'>
            <div className='d-flex'>
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

            <div className='table-section'>
                <table className='table'>
                    <thead>
                        <th>District Name</th>
                        <th>License Type</th>
                        <th>Total License Issued / Renewed</th>
                        <th>Total License Expired</th>
                        <th>License Revenue</th>
                        <th>Total Revenue</th>
                    </thead>

                    <tbody>
                        {
                            data.map(entry => (
                                <tr>
                                    <td>{entry['District Name']}</td>
                                    <td>{entry['License Type']}</td>
                                    <td>{entry['Total License Issued / Renewed']}</td>
                                    <td>{entry['Total License Expired']}</td>
                                    <td>RM {entry['License Revenue']}</td>
                                    <td>RM {entry['Total Revenue']}</td>
                                </tr>
                            ))
                        }
                        
                    </tbody>
                </table>
            </div>
            
        </div>
    );
}



const RentalReport = ({ data }) => {
    // Total Unit	Unit Available	Total Rent
    // console.log(data);

    let buildings = data.map(entry => entry['Name']);
    buildings = [...new Set(buildings)];

    let districts = data.map(entry => entry['District Name']);
    districts = [...new Set(districts)];

    // let items = districts.map(district => {
    //     let entries = data.filter(item => item['District Name'] === district);

    let items = {
        'Total Units':sum(data.filter(item => item['Total Unit']), 'Total Unit'),
        'Available Units':sum(data.filter(item => item['Unit Available']), 'Unit Available')
    };

    // });

    console.log(items);

    return (
        <div className='bar-graph-section'>
            <div className='d-flex'>
                <div className='bar-graph'>
                    <CustomBarChart items={items} title="Rental Units"/>
                </div>
                
                <div className='bar-graph'>
                    {/* <CustomBarChart items={items["Hawker License"]} title="Hawker License"/> */}
                </div>

                <div className='bar-graph'>
                    {/* <CustomBarChart items={items['Advertisement License']} title="Advertisement License"/> */}
                </div>
            </div>
            

            <div className='table-section'>
                <table className='table'>
                    <thead>
                        <th>Name</th>
                        <th>Total Unit</th>
                        <th>Unit Available</th>
                        <th>Total Rent</th>
                        <th>District</th>
                    </thead>

                    <tbody>
                        {
                            data.filter(entry => entry['Name']).map((entry,i) => (
                                <tr key={`rental-${i}`}>
                                    <td>{entry['Name']}</td>
                                    <td>{entry['Total Unit']}</td>
                                    <td>{entry['Unit Available']}</td>
                                    <td>RM {entry['Total Rent']}</td>
                                    <td>{entry['District Name']}</td>
                                </tr>
                            ))
                        }
                        
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default CustomReport;