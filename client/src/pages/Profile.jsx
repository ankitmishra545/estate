import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'

const Profile = () => {

  const dispatch = useDispatch();

  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);


  // firebase storage
  // allow read;
  //     allow write: if
  //     request.resource.size < 2 * 1024 * 1024 &&
  //     request.resource.contentType.matches('image/.*')

const handleFileUpload = (file) => {
  const storage = getStorage(app);
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage, fileName);
  const uploadTasks = uploadBytesResumable(storageRef, file);

  uploadTasks.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;
    setFilePerc(Math.round(progress));
  },

  (error) => {
    setFileUploadError(true);
  },

  () => {
    getDownloadURL(uploadTasks.snapshot.ref).then(
      (downloadURL) => {
        setFormData({...formData, avatar: downloadURL});
      }
    )
  })
}

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }    
  }, [file])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers:{
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold m-7 text-center">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} ref={fileRef} type="file" hidden accept="image/*" />
        <img onClick={() => fileRef.current.click()} className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2" src={formData.avatar || currentUser.avatar} alt="profile-image" />
        <p className="text-sm self-center">{ fileUploadError 
          ? <span className="text-red-700">Error occured while uploading file!(image should be less than 2MB)</span>
          : filePerc > 0 && filePerc < 100  
          ? <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          : filePerc === 100 
          ? <span className="text-green-700">Image successfully uploaded!</span>
          : ""}</p>
        <input onChange={handleChange} type="text" defaultValue={currentUser.username} placeholder="username" id="username" className="p-3 rounded-lg border" />
        <input onChange={handleChange} type="email" defaultValue={currentUser.email} placeholder="email" id="email" className="p-3 rounded-lg border" />
        <input type="password" placeholder="password" id="password" className="p-3 rounded-lg border" />
        <button disabled={loading} className="uppercase p-3 bg-slate-700 rounded-lg text-white hover:opacity-90 disabled:opacity-70">{loading ? 'Loading...' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User updated successfully!' : ''}</p>
    </div>
  )
}

export default Profile