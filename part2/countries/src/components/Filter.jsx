const Filter = ({filter, handleFiltering}) => {
    return (
        <div>find countries <input value={filter} onChange={handleFiltering} /></div>
    )    
}

export default Filter