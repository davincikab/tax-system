import { FaSearch, FaCheckSquare, FaDatabase, FaHouseUser, FaCog } from 'react-icons/fa';

import logo from '../../logo.svg';

const ToolKitCard = (props) => {
    const setActiveTab = (tab) => {
        props.toggleTab(tab);
    }

    const getClassName = (tab) => {
        return tab === props.activeTab ? 'card-item active' : 'card-item';
    }

    console.log(props.activeTab);
    return (
        <div className="card tools-card">
            
            <div className="card-icon">
            <img src="/assets/icons/logo.png" alt="logo" />
                <div>Activity Board</div>
            </div>

            <div className="card-content">
                <div className={getClassName('search')} onClick={() => setActiveTab('search')}>
                    <img src="/assets/icons/loupe.png" alt='search'/>
                    <b>Search</b>
                </div>

                <div className={getClassName('task')} onClick={() => setActiveTab('task')}>
                    {/* <FaCheckSquare /> */}
                    <img src="/assets/icons/assign.png" alt='assign'/>
                    <b>Add Task</b>
                </div>

                <div className={getClassName('user')} onClick={() => setActiveTab('user')}>
                    {/* <FaHouseUser /> */}
                    <img src="/assets/icons/user.png" alt='user'/>
                    <b>User</b>
                </div>
                <div className={getClassName('database')} onClick={() => setActiveTab('database')}>
                    {/* <FaDatabase /> */}
                    <img src="/assets/icons/database.png" alt='database'/>
                    <b>Database</b>
                </div>
                <div className={getClassName('settings')} onClick={() => setActiveTab('settings')}>
                    {/* <FaCog /> */}
                    <img src="/assets/icons/settings.png" alt='settings'/>
                    <b>Settings</b>
                </div>

            </div>
        </div>
    )
}

export default ToolKitCard;