
import districts from '../../assets/data/districts.json';
import { getRandomInt } from '../../utils/faker/faker';

const SummarySection = (props) => {

    let uniqueNames = districts.features.map(district => district.properties.Name);
    uniqueNames = [...new Set(uniqueNames)];

    // let values = [];

    return (
        <div className="summary-section">
            <div className="summary-header">
                <div>
                    <div className="card-icon">
                    <img src="/assets/icons/logo.png" alt="logo" />
                        <div>Summary Board</div>
                    </div>
                </div>

                <div className="close-btn" onClick={props.toggleSummaryTab}>
                    <img src="/assets/icons/cross.png" alt="close-btn"/>
                </div>
            </div>

            <div className="summary-body">
                {uniqueNames.map(name => (
                    <SummaryCard 
                        key={name} 
                        district={name} 
                        handleCardClick={props.selectDistrict} 
                    />
                )
                )}
            </div>
        </div>
    )
}

const SummaryCard = (props) => {
    const handleClick = (district) => {
        // zoom to the given district
        props.handleCardClick(district)
    }

    return (
        <div className="summary-card" onClick={() => handleClick(props.district)}>
            <div className="text-card">
                <div className="color-div"></div>
                <div className="card-text">
                    <div>{props.district}</div>
                </div>
            </div>

            <div className="card-body">
                <div className="card-text">
                    <div>Uncollected Tax</div>
                    <span>:</span>
                    <div className='value'>{getRandomInt(1800, 3000)}</div>
                </div>

                <div className="card-text">
                    <div>License Expired</div>
                    <span>:</span>
                    <div className='value'>{getRandomInt(100, 300)}</div>
                </div>

                <div className="card-text">
                    <div>Space Rental Available</div>
                    <span>:</span>
                    <div className='value'>{getRandomInt(10, 200)}</div>
                </div>
            </div>
        </div>
    );

}

export default SummarySection;