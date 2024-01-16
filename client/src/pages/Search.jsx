import { useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom'
import ListingItem from '../components/ListingItem';

const Search = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        offer: false,
        parking: false,
        furnished: false,
        sort: 'create_at',
        order: 'desc'
    });

    const handleChange = (e) => {

        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sell'){
            setSidebarData({...sidebarData, type: e.target.id});
        }

        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value});
        }

        if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished'){
            setSidebarData({...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false});
        }

        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({...sidebarData, sort, order});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('type',sidebarData.type);
        urlParams.set('offer',sidebarData.offer);
        urlParams.set('furnished',sidebarData.furnished);
        urlParams.set('parking',sidebarData.parking);
        urlParams.set('searchTerm',sidebarData.searchTerm);
        urlParams.set('sort',sidebarData.sort);
        urlParams.set('order',sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const searctTermFromURL = urlParams.get('searchTerm');
        const typeFromURL = urlParams.get('type');
        const offerFromURL = urlParams.get('offer');
        const furnishedFromURL = urlParams.get('furnished');
        const parkingFromURL = urlParams.get('parking');
        const sortFromURL = urlParams.get('sort');
        const orderFromURL = urlParams.get('order');

        if(searctTermFromURL || typeFromURL || offerFromURL || furnishedFromURL || parkingFromURL || sortFromURL || orderFromURL){
            setSidebarData({
                searchTerm: searctTermFromURL || '',
                type: typeFromURL || 'all',
                offer: offerFromURL === 'true' ? true : false,
                parking: parkingFromURL === 'true' ? true : false,
                furnished: furnishedFromURL === 'true' ? true : false,
                sort: sortFromURL || 'created_at',
                order: orderFromURL || 'desc'
            });

            const fetchListings = async() => {
                setLoading(true);
                setShowMore(false);
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/listing/get?${searchQuery}`);
                const data = await res.json();
                setListings(data);
                if(data.length > 8){
                    setShowMore(true);
                }
                setLoading(false);
            };

            fetchListings();
        }
    },[location.search])

    const handleShowMore = async() => {
        const startIndex = listings.length;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

  return (
    <div className='flex flex-col md:flex-row '>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className=' flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold whitespace-nowrap'>Search Term</label>
                    <input type='text' onChange={handleChange} value={sidebarData.searchTerm} id='searchTerm' placeholder='Search...' className='rounded-lg p-3 border w-full' />
                </div>
                <div className='flex gap-2'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={sidebarData.type === 'all'} id='all' className='w-5' />
                        <span>Rent & Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={sidebarData.type === 'rent'} id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={sidebarData.type === 'sell'} id='sell' className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={sidebarData.offer} id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={sidebarData.parking} id='parking' className='w-5' />
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={sidebarData.furnished} id='furnished' className='w-5' />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <select onChange={handleChange} defaultValue={'created_at_desc'} id='sort_order' className='p-3 border rounded-lg'>
                        <option value={'regularPrice_desc'}>Price: Low to High</option>
                        <option value={'regularPrice_asc'}>Price: High to Low</option>
                        <option value={'createdAt_desc'}>Latest</option>
                        <option value={'createdAt_asc'}>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
            </form>
        </div>
        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                Listing results:
            </h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700'>No listing found!</p>
                )}
                {loading && (
                    <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                )}
                {
                !loading && listings && listings.map(listing => (
                    <ListingItem key={listing._id} listing={listing} />
                ))
                }
                {showMore && <button className='text-center text-green-700 hover:underline p-5 w-full' onClick={handleShowMore}>Show more...</button>}
            </div>
                
        </div>
    </div>
  )
}

export default Search