const ReportFilterSection = (props) => {
    <div className="report-filter">

        <div className="filter-section">

            <div className="text-card">
                <div className="color-div"></div>
                <div className="card-text">
                    <div>Collection Summary</div>
                </div>
            </div>

            <div className="filter-body">
                <div className="filter-item">View By Zone</div>
                <div className="filter-item">View By Type</div>
                <div className="filter-item">Collection Summary</div>
            </div>
            
        </div>

        <div className="filter-section">

            <div className="text-card">
                <div className="color-div"></div>
                <div className="card-text">
                    <div>Collection Summary</div>
                </div>
            </div>

            <div className="filter-body">
                <div className="filter-item">View By Department</div>
                <div className="filter-item">View By Type</div>
            </div>

        </div>
    </div>
}

export default ReportFilterSection;