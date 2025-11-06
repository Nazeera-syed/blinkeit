import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import updateProfile from "../utils/updateProfile";
import toast from "react-hot-toast";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();

    const result = await updateProfile(token, form);

    if (result?.success) {
      toast.success("Profile updated!");
      dispatch(setUserDetails(result.data)); // update redux
    } else {
      toast.error(result?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='my-4 grid gap-4'>
    <div  className='grid'>
         <label>Name</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter your Name"
        className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
      />
    </div>
      <div  className='grid'>
         <label html for='email'>Email</label>
      <input
        type="email"
        name="email"
            id='email'
        value={form.email}
        onChange={handleChange}
        placeholder="Enter Your Email"
        className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
      />
      </div>
        <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
      <input
        type="text"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        placeholder="Enter Your Mobile Number"
        className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded"
      />
      </div>
      <button
        type="submit"
     className='border px-4 py-2 font-semibold hover:bg-primary-100 border-primary-100 text-primary-200 hover:text-neutral-800 rounded'>
      
        Update Profile
      </button>
    </form>
  );
}

export default Profile;
