

const SearchCard = (props) => {
    const handleChange = (evt) => {
        console.log(evt.target.value);
    }

    return (
        <div className="search-card">
            <div className="input-group">
                <input 
                    type="text" 
                    name="search" 
                    onChange={handleChange}
                    placeholder="Search an address ..."
                />
                <div className="filter-toggler">
                    <img src="/assets/icons/filter.png" alt='filter' style={{"height":"20px"}}/>
                </div>
            </div>

            <div className='search-button'>
                SEARCH
            </div>
        </div>
    )
}


export default SearchCard;