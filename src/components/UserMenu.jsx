import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Divider from './Divider';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from "../firebaseConfig";
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'


const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const auth = getAuth();

    try {
      // 1. Firebase logout
      await signOut(auth);

      // 2. Call backend (optional, only if you track sessions there)
      await fetch("http://localhost:8080/api/user/logout", {
        method: "GET",
        credentials: "include",
      });

      // 3. Clear redux
      dispatch(logout());

      // 4. Clear local storage/session if any
      localStorage.clear();

      // 5. Redirect
      toast.success("Logged out successfully");
      if (close) close();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  const handleClose = () => {
    if (close) {
      close()
    }
  }


  return (
    <div>
      <div className='font-semibold'>My Account</div>
      <div className='text-sm flex items-center gap-1'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>{user.mobile || user.name}<span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
        <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
          < HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />
      <div className='text-sm grid gap-1'>
        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/category"}
              className='px-2 hover:bg-orange-200 py-1'>Category</Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/subcategory"}
              className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/upload product"}
              className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
          )
        }

        {
          isAdmin(user.role) && (
            <Link onClick={handleClose} to={"/dashboard/product"}
              className='px-2 hover:bg-orange-200 py-1'>Product</Link>
          )
        }





        <Link onClick={handleClose} to={"/dashboard/myorders"}
          className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>
        <Link onClick={handleClose} to={"/dashboard/address"}
          className='px-2 hover:bg-orange-200 py-1'>Save Address</Link>
        <button onClick={handleLogOut} className='text-left px-2 hover:bg-orange-200 py-1'>Log Out</button>
      </div>
    </div>
  );
}

export default UserMenu;
