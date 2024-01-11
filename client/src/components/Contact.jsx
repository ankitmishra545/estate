import { useEffect, useState } from "react"
import {Link} from 'react-router-dom'

const Contact = ({listing}) => {

    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {

        const fetchLandlord = async() => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }            
        }

        fetchLandlord();
    },[])

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-4 mt-4">
            <p>Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
            <textarea className="w-full border p-3 rounded-lg" name="message" id="message" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message here..."></textarea>
            <Link className="bg-slate-700 p-3 text-white rounded-lg text-center uppercase hover:opacity-90" to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} >Send Message</Link>
        </div>
      )}
    </>
  )
}

export default Contact