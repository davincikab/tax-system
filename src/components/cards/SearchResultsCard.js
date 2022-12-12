const SearchResultCard = (props) => {
    return (
        <div className="search-result">
            <div className="search-header">
                <h2>SEARCH RESULT</h2>
            </div>

            <div className="search-body">
                {
                [0, 1].map(result => (
                    <ResultCard key={result} />
                ))
                }
            </div>
        </div>
    )   
}

const ResultCard = (props) => {
    return (
        <div className="result-card">

        <div className="card-header d-flex">
            <div className="text-card">
                <div className="color-div"></div>
                <div className="card-text">
                    <div className="label">Account #  :</div>
                    <b>00001</b>
                </div>
            </div>

            <div className="status d-flex">
                <img src="/assets/icons/correct.png" alt="paid"/>
                <span>Paid</span>
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
                        RM 638.00
                    </div>
                </div>

            </div>

        </div>
        </div>
    )
}

export default SearchResultCard;