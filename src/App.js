import './App.css';
import MapContainer from './components/map/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import Footer from './components/footer';
import ToolKitCard from './components/cards/ToolsCard';
import SearchCard from './components/cards/SearchCard';
import SearchResultCard from './components/cards/SearchResultsCard';
import Dashboard from './components/dashboard/dashboard';

import { useState } from 'react';
import TaskSection from './components/task/TaskSection';
import SummarySection from './components/summary/summary';
import SummaryToggler from './components/summary/summary-toggler';
import ReportSection from './components/reports/reports';


function App() {

  const [ state, setState ] = useState({
    activeTab:'search', 
    summaryActive:false,
    district:""
  });

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

  let { activeTab, summaryActive, district } = state;
  // console.log(district);

  return (
    <div className="App">
      <MapContainer 
        activeDistrict={district}
        selectDistrict={selectDistrict}
      />
      <SearchCard />

      <SearchResultCard 
        toggleTab={toggleTab} 
      />
      
      <Dashboard />

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
