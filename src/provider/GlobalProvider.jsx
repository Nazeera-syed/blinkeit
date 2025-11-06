import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";



export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const cartItem = useSelector(state => state.cartItem.cart)
  const user = useSelector(state => state?.user)

  const fetchCartItem = async () => {
    try {

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return; // user not logged in yet

      const token = await user.getIdToken(); // ✅ get token from Firebase directly



      const response = await Axios({
        ...SummaryApi.getCartItem,
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
        console.log("Fetched cart items:", responseData.data);

        // Compute totals
        const qty = responseData.data.reduce((sum, item) => sum + item.quantity, 0);
        const price = responseData.data.reduce(
          (sum, item) => sum + (item?.productId?.price || 0) * item.quantity,
          0
        );

        const notDiscountPrice = responseData.data.reduce(
          (sum, item) => sum + (item?.productId?.originalPrice || 0) * item.quantity,
          0
        );

        setTotalQty(qty);
        setTotalPrice(price);
        setNotDiscountTotalPrice(notDiscountPrice);
      }
    } catch (error) {
      console.error("Fetch cart item error:", error);
      AxiosToastError(error);
    }
  };





  // Update quantity of a cart item
  const updateCartItemQty = async (cartId, qty) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        headers: { Authorization: `Bearer ${token}` },
        data: { cartId, qty }, // send cartId and new quantity
      });

      const resData = response.data;
      console.log("✅ updateCartItemQty:", resData);

      if (resData.success) {
        await fetchCartItem(); // refresh totals
      }

      return resData; // ✅ Return backend response
    } catch (error) {
      console.error("❌ updateCartItemQty error:", error.response?.data || error.message);
      return { success: false, message: "Failed to update cart" }; // ✅ Always return something
    }
  };
  // delete cart item
  const deleteCartItem = async (cartId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.warn("No user logged in");
        return { success: false, message: "User not logged in" };
      }

      const token = await user.getIdToken();

      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        headers: { Authorization: `Bearer ${token}` },
        data: { cartId }, // backend expects cartId in body
      });

      const resData = response.data;
      console.log("🗑️ deleteCartItem:", resData);

      if (resData.success) {
        await fetchCartItem(); // refresh totals and cart items
      }

      return resData; // ✅ Return backend response to caller
    } catch (error) {
      console.error("❌ deleteCartItem error:", error.response?.data || error.message);
      return { success: false, message: "Failed to delete cart item" };
    }
  };

  const fetchAddress = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.warn("No user logged in, skipping address fetch");
        return;
      }

      const token = await user.getIdToken(); // ✅ get Firebase token
      const response = await Axios({
        ...SummaryApi.getAddress,
          headers: { Authorization: `Bearer ${token}` },
      })
      const { data: responseData } = response

      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data))
          console.log("✅ Fetched addresses:", responseData.data);
    } else {
      console.warn("⚠️ Address fetch failed:", responseData.message);
    }
      
    } catch (error) {
       console.error("❌ fetchAddress error:", error);
    }
  }

    const fetchOrder = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.getOrderItems,
        })
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data))
        }
      } catch (error) {
        console.log(error)
      }
    }


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
      console.log("✅ Firebase user logged in:", user.uid);
      fetchCartItem();
      fetchAddress(); 
      fetchOrder()
    } else {
      console.log("🚪 No user logged in");
      handleLogoutOut(); // clear only on logout
    }
  });
    return () => unsubscribe();
  }, []);

  const handleLogoutOut = () => {
    localStorage.clear()
    dispatch(handleAddItemCart([]))
  }

  



  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItemQty,
        deleteCartItem,
        totalQty,
        totalPrice,
        notDiscountTotalPrice,
        fetchAddress,
        fetchOrder
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
