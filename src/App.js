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


function App() {
  const [ state, setState ] = useState({
    activeTab:'search'
  });

  const toggleTab = (tab) => {

    setState({
      ...state,
      activeTab:tab
    });

  }

  let { activeTab } = state;
  return (
    <div className="App">
      <MapContainer />
      <SearchCard />

      <SearchResultCard 
        toggleTab={toggleTab} 
      />
      
      <Dashboard />

      <ToolKitCard  
        toggleTab={toggleTab} 
        activeTab={state.activeTab}
      />

      {activeTab === "task" && <TaskSection /> }

      <Footer />
    </div>
  );

}

export default App;
