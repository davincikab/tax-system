const SearchResultCard = (props) => {
    console.log(props.entries);

    return (
        <div className="search-result">
            <div className="search-header">
                <h2>SEARCH RESULT</h2>
            </div>

            <div className="search-body">
                {
                props.entries.map((entry, i) => (
                    <ResultCard key={`result-${i}`} entry={entry} />
                ))
                }
            </div>
        </div>
    )   
}

const ResultCard = ({entry}) => {
    return (
        <div className="result-card">

        <div className="card-header d-flex">
            <div className="text-card">
                <div className="color-div"></div>
                <div className="card-text">
                    <div className="label">Account #  :</div>
                    <b>{entry['Account Number']}</b>
                </div>
            </div>

            <div className="status d-flex">
                { (entry['Status'] === 'Paid') && <img src="/assets/icons/correct.png" alt="paid"/> }
                { (entry['Status'] === 'Unpaid') && <img src="/assets/icons/close.png" alt="Unpaid"/> }
                
                <span>{entry['Status']}</span>
            </div>
        </div>

        <div className="card-body">
            <div className="item-info d-flex">
                <div>
                    <div className="">Unit Address</div>
                    <div className="b">
                        Pulau Duyung Besar, 21200 Kuala Terangganu, Terangganu
                    </div>
                </div>

                <div>
                    <img src="/assets/icons/location.png" alt="location"/>
                </div>
            </div>

            <div className="item-info d-flex">
                <div>
                    <div>Tax Assessment Data: </div>
                    <div className="b">
                        12 Jun 2022
                    </div>
                </div>

                <div>
                    <div>Amount : </div>
                    <div className="b">
                        RM {formatValues(entry['Amount'])}
                    </div>
                </div>

            </div>

        </div>
        </div>
    )
}

function formatValues(value = 0) {
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');  
}

export default SearchResultCard;