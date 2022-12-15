const SummaryToggler = (props) => {
    return (
        <div className="summary-toggler" onClick={props.toggleSummaryTab}>
            <div>
                <div className="card-icon">
                <img src="/assets/icons/logo.png" alt="logo" />
                    <div>Summary</div>
                </div>
            </div>
        </div>
    )
}

export default SummaryToggler;