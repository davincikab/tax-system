import './App.css';
import MapContainer from './components/map/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import Footer from './components/footer';
import ToolKitCard from './components/cards/ToolsCard';
import SearchCard from './components/cards/SearchCard';
import SearchResultCard from './components/cards/SearchResultsCard';
import Dashboard from './components/dashboard/dashboard';

import { useEffect, useState } from 'react';
import TaskSection from './components/task/TaskSection';
import SummarySection from './components/summary/summary';
import SummaryToggler from './components/summary/summary-toggler';
import ReportSection from './components/reports/reports';


import {read, utils} from "xlsx";


function App() {

  const [ state, setState ] = useState({
    activeTab:'search', 
    summaryActive:false,
    search_results:[],
    district:"",
    tax_assessment:null
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
        setState({
          ...state,
          tax_assessment:utils.sheet_to_json(businessWorkbook.Sheets['Tax Assessment'])
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
        entry['Account Number'].toString().includes(value) || 
        entry['Lot Number'].toString().includes(value) ||
        entry['Reference Number'].toString().includes(value) ||
        entry['IC Number'].toString().includes(value) ||
        entry['Premise Owner Name'].toString().includes(value)
      ) {
        return entry;
      }

      return false;
    });


    setState({
      ...state,
      search_results:searchResults.slice(0, 6)
    })

  }

  let { activeTab, summaryActive, district, search_results } = state;
  // console.log(district);

  return (
    <div className="App">
      <MapContainer 
        activeDistrict={district}
        selectDistrict={selectDistrict}
      />
      <SearchCard handleSearchChange={handleSearchChange} />

      <SearchResultCard 
        toggleTab={toggleTab} 
        entries={search_results}
      />
      
      { activeTab === "task" && <Dashboard /> }

      <ToolKitCard  
        toggleTab={toggleTab} 
        activeTab={state.activeTab}
      />

      { activeTab === "task" && <TaskSection /> }
      { summaryActive && <SummarySection toggleSummaryTab={toggleSummaryTab} selectDistrict={selectDistrict} /> }

      {activeTab === "settings" && <ReportSection />}
      <SummaryToggler toggleSummaryTab={toggleSummaryTab}/>

      <Footer />
    </div>
  );

}

export default App;
