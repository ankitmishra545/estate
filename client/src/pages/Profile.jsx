import { useSelector } from "react-redux"

const Profile = () => {
  const { currentUser } = useSelector(state => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold m-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <img className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2" src={currentUser.avatar} alt="profile-image" />
        <input type="text" placeholder="username" id="username" className="p-3 rounded-lg border" />
        <input type="email" placeholder="email" id="email" className="p-3 rounded-lg border" />
        <input type="password" placeholder="password" id="password" className="p-3 rounded-lg border" />
        <button className="uppercase p-3 bg-slate-700 rounded-lg text-white hover:opacity-90 disabled:opacity-70">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile