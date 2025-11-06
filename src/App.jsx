import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setUserDetails } from "./store/userSlice";
import fetchUserDetails from "./utils/fetchUserDetails";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { setAllCategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import { handleAddItemCart } from './store/cartProduct.js'
import GlobalProvider from "./provider/GlobalProvider.jsx";
import CartMobileLink from "./components/CartMobileLink.jsx";


function App() {
  const dispatch = useDispatch();
    const location = useLocation()

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true);
          const userData = await fetchUserDetails(token);
          if (userData?.data) dispatch(setUserDetails(userData.data));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      } else {
        dispatch(setUserDetails({ _id: "", name: "", email: "", mobile: "" }));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);


   const fetchCategory = async()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...SummaryApi.getCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        
    }finally{
      dispatch(setLoadingCategory(false))
    }
  }

   const fetchSubCategory = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.getSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        
    }finally{
    }
  }
  
   
  
  useEffect(()=>{
    
    fetchCategory()
    fetchSubCategory()
    
    
  },[])


  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
       {
        location.pathname !== '/checkout' && (
          <CartMobileLink/>
        )
      }
    </GlobalProvider>
  );
}

export default App;
