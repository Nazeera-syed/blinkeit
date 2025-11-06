import React from 'react';
import OtpInput from "otp-input-react";
import { useState } from "react";
import mylogo from '../assets/mylogo.png'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { auth } from "../firebaseConfig"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";


const Login = () => {

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();



  // Step 1: Send OTP
  const sendOtp = async () => {
    setLoading(true);
    try {
      if (!phone) return alert("Enter phone number with country code, e.g. +91XXXXXXXXXX");

      // Initialize recaptcha only once
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }

      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(result);
      setLoading(false);
      setShowOTP(true);
      toast.success(` OTP sent to ${phone}`);


    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      setLoading(false);
      alert("Failed to send OTP: " + err.message);
    }
  };


  // Step 2: Verify OTP & call backend
  const verifyOtp = async () => {
    setLoading(true);
    try {
      if (!confirmation) return toast.error("Please send OTP first");
      if (!otp) return toast.error("Enter the OTP");

      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();
      console.log("✅ Firebase ID Token:", idToken);

      const res = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      if (data.success) {
      

        // Optional: store user info
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setUser(data.data.user);

        toast.success("🎉 Login successful!");
     
        setLoading(false);
        navigate("/");
      } else {
        toast.error("Login failed: " + data.message);
      }
    } catch (err) {
      console.error("❌ OTP Verification Error:", err);
      setLoading(false);
      toast.error("OTP verification failed: " + err.message);
    }
  };

  return (
    <section className=" flex items-center justify-center py-10">
      <div id="recaptcha-container"></div>
      {user ? (
        <h2 className="text-center text-white font-medium text-2xl">
          👍Login Success
        </h2>
      ) : (
        <div className="bg-white w-90 flex flex-col gap-4 rounded-lg  p-4">
          <div className="flex items-center justify-center rounded-lg ">
            <img
              src={mylogo}
              width={120}
              height={100}
              alt='mylogo'

            />       </div>
          <h1 className="text-center leading-normal font-medium text-2xl mb-6">
            India's Last Minute App <br /> Login or Signup
          </h1>
          {showOTP ? (
            <>
              <label
                htmlFor="otp"
                className="font-bold text-xl  text-center"
              >
                Enter your OTP
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                inputClassName="w-15 h-15 text-center text-lg font-medium border border-gray-400 
                          rounded-lg shadow-sm focus:outline-none focus:ring-2 
                          focus:ring-black-100 py-3"
                className="flex justify-center "
              ></OtpInput>
              <button
                onClick={verifyOtp}
                className=" w-full flex gap-2  items-center justify-center py-3 rounded bg-green-600"
              >
                {loading && (
                  <CgSpinner size={24} className="mt-1 animate-spin" />
                )}
                <span>Verify OTP</span>
              </button>
            </>
          ) : (

            <>


              <label
                htmlFor="otp"
                className="font-bold text-xl  text-center"
              >
                Enter your Phone Number
              </label>
              <input
                placeholder="+91XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button
                onClick={sendOtp}
                className="bg-green-600 w-full flex gap-1 items-center justify-center py-2.5 rounded"
              >
                {loading && (
                  <CgSpinner size={24} className="mt-1 animate-spin" />
                )}
                <span>Send code via SMS</span>
              </button>

            </>
          )}
        </div>


      )}
    </section>
  );
}

export default Login;
