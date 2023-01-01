import './App.css';
import MapContainer from './components/map/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import Footer from './components/footer';
import ToolKitCard from './components/cards/ToolsCard';
import SearchCard from './components/cards/SearchCard';
import SearchResultCard from './components/cards/SearchResultsCard';
import Dashboard from './components/dashboard/dashboard';

import { useEffect, useState } from 'react';

import LoginPage from './components/login';

import TaskSection from './components/task/TaskSection';
import SummarySection from './components/summary/summary';
import SummaryToggler from './components/summary/summary-toggler';

import ReportSection from './components/reports/reports';
import CollectionManagementSection from './components/reports/collection_management';
import ReportFilterSection from './components/reports/report-filters';

import {read, utils} from "xlsx";
import CustomReport from './components/reports/custom-report';


function App() {

  const [ state, setState ] = useState({
    activeTab:'search', 
    summaryActive:false,
    search_results:[],
    district:"",
    tax_assessment:null,
    location:null,
    isLoggedIn:true,
    graphData:{
      licenses:[],
      rental:[],
      tax:[]
    },
    activeEntry:null
  });

  useEffect(() => {
    if(!state.tax_assessment) {
      loadData() 
    }
    
  });

  const loadData = () => {
    fetch("/assets/data/Business License.xlsx")
      .then(res => res.arrayBuffer())
      .then(data => {
        let businessWorkbook = read(data);

        // utils.sheet_to_
        fetch("/assets/data/Business License.xlsx")
        .then(res => res.arrayBuffer())
        .then(data => {
          let rentalWorkbook = read(data);

          setState({
            ...state,
            graphData:{
              tax:utils.sheet_to_json(businessWorkbook.Sheets['Tax']),
              licenses:utils.sheet_to_json(businessWorkbook.Sheets['License']),
              rental:utils.sheet_to_json(rentalWorkbook.Sheets['Rent Place'])
            },
            tax_assessment:utils.sheet_to_json(businessWorkbook.Sheets['Tax Assessment'])
          });

        });

      })
  }

  const toggleTab = (tab) => {

    setState({
      ...state,
      activeTab:tab
    });

  }

  const toggleSummaryTab = () => {

    setState({
      ...state,
      summaryActive:!state.summaryActive
    });

  }

  const selectDistrict = (district) => {

    setState({
      ...state,
      summaryActive:false,
      district
    });

  }

  const handleSearchChange = (val) => {
    // filter the dataset
    let value = val.toLowerCase();
    let searchResults = state.tax_assessment.filter(entry => {
      // console.log(entry);

      if(
        entry['Account Number'].toString().toLowerCase().includes(value) || 
        entry['Lot Number'].toString().toLowerCase().includes(value) ||
        entry['Reference Number'].toString().toLowerCase().includes(value) ||
        entry['IC Number'].toString().toLowerCase().includes(value) ||
        entry['Premise Owner Name'].toString().toLowerCase().includes(value)
      ) {
        return entry;
      }

      return false;
    });


    setState({
      ...state,
      activeEntry:null,
      location:null,
      search_results:value ? searchResults.slice(0, 6) : []
    })

  }

  const handleLocationClick = (location, entry) => {
    console.log(location);

    setState({
      ...state,
      location,
      district:entry.properties['District'],
      activeEntry:entry
    });

  }

  const handleLogin = () => {
    setState({
      ...state,
      isLoggedIn:true
    });

  }

  let { 
    activeTab, summaryActive, district, isLoggedIn,
    search_results, location, activeEntry
  } = state;

  // console.log(activeEntry);

  return (
    <div className="App">
      {!isLoggedIn && <LoginPage handleLogin={handleLogin} /> }

      { isLoggedIn &&
        <>
          <MapContainer 
            activeDistrict={district}
            selectDistrict={selectDistrict}
            location={location}
            activeEntry={activeEntry}
          />

          <SearchCard handleSearchChange={handleSearchChange} />

          <SearchResultCard 
            toggleTab={toggleTab} 
            entries={search_results}
            handleLocationClick={handleLocationClick}
          />
          
          { !search_results[0] && <Dashboard /> }

          <ToolKitCard  
            toggleTab={toggleTab} 
            activeTab={state.activeTab}
          />

          { activeTab === "task" && <TaskSection /> }
          { summaryActive && <SummarySection toggleSummaryTab={toggleSummaryTab} selectDistrict={selectDistrict} /> }

          {activeTab === "settings" && <>
              <ReportFilterSection />
              <ReportSection /> 
              <CollectionManagementSection />
            </>
          }

          <CustomReport 
            district={state.activeDistrict}
            data={state.graphData}
          />
          <SummaryToggler toggleSummaryTab={toggleSummaryTab}/>

          <Footer />
        </>
      }
    </div>
  );

}

export default App;
