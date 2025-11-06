import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layout/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProductPage from "../pages/UploadProductPage";
import Product from "../pages/Product"
import AdminPermision from "../layout/AdminPermission";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobileLink from "../components/CartMobileLink";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import DisplayCartItem from "../components/DisplayCartItem";


const router = createBrowserRouter([
      {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
             {
                path : "search",
                element : <SearchPage/>
            },
            {
                path : "login",
                element : <Login/>
            },
              {
                path : "user",
                element : <UserMenuMobile/>
            },
              {
                path : "dashboard",
                element : <Dashboard />,
                children :[
                  {
                    path:"profile",
                    element : <Profile />
                  },
                   {
                    path:"myorders",
                    element : <MyOrders />
                  },
                   {
                    path:"address",
                    element : <Address/>
                  },
                  {
                    path:"category",
                    element : <AdminPermision> <CategoryPage/> </AdminPermision>
                  },
                  {
                    path:"subcategory",
                    element :<AdminPermision> <SubCategoryPage/> </AdminPermision> 
                  },
                  {
                    path:"upload product",
                    element :<AdminPermision> <UploadProductPage/> </AdminPermision> 
                  },
                  {
                    path:"product",
                    element :<AdminPermision> <Product/> </AdminPermision> 
                  }
                ]
            },
            {
               path : ":category",
                children : [
                    {
                        path : ":subCategory",
                        element : <ProductListPage/>
                    }
                ]
            },
            {
              path :"product/:product",
              element :<ProductDisplayPage/>
            },
             {
                path : 'cart',
                element : <DisplayCartItem/>
            },
              {
                path : "checkout",
                element : <CheckoutPage/>
            },
              {
                path : "success",
                element : <Success/>
            },
                 {
                path : 'cancel',
                element : <Cancel/>
            }
            
        ]
      }
])
export default router