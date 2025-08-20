import React, { useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import Button from "../button/Button";
import Input from "../input/Input";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sucessMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const response = await axios.post(
        `${baseUrl}/auth/send-email-password-reset`,
        { email }
      );
      if (response && response.data.status === true) {
        setSuccessMessage(response && response.data.data);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage(error && error.response && error.response.data.message);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-2 w-full max-md:grid-cols-1 bg-white">
      <div className="col-span-1 max-md:h-[300px] relative">
        <img
          className="h-screen w-full max-md:h-full"
          src="../assets/images/login.png"
          alt=""
        />
      </div>
      <div className="col-span-1 flex flex-col justify-center gap-8 max-md:my-2">
        <div className="h-[100px] flex justify-center">
          <img
            className="h-full"
            src="../assets/images/black_logo.png"
            alt=""
          />
        </div>
        <div className="flex justify-start flex-col items-start w-[75%] mx-auto max-md:w-[95%]">
          <p className="text-[48px] customFontDetailTitle max-md:text-[32px]">
            Having trouble logging in?
          </p>{" "}
          <div>
            <p className="text-[#6D7A84]">
              Enter your email address and we will send you a link to restore
              access to your account.
            </p>
          </div>
        </div>

        <div className="w-[75%] flex flex-col gap-2 mx-auto max-md:w-[95%]">
          <label className="font-semibold text-[#6b7280]">Email</label>
          <Input
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="border-[1px] py-2 px-2 mb-4 bg-[#F3F4F5] rounded-[8px] focus:outline-none"
            required
          />
          <div>
            {sucessMessage && <p className="text-green-600">{sucessMessage}</p>}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          </div>
          <div>
            {loading ? (
              <div className="py-4 flex justify-center">
                <SyncLoader color={"#4f46e5"} loading={loading} size={10} />
              </div>
            ) : (
              !sucessMessage && (
                <Button
                  onClick={handleResetPassword}
                  className={`border-[1px] w-full py-2 rounded-[6px] bg-[#4f46e5] text-white hover:bg-[#6366f1] duration-200 ${
                    !email && "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!email}
                >
                  Send a confirmation message
                </Button>
              )
            )}
          </div>
          <div className="absolute top-12 right-12 max-md:text-white max-md:text-[18px] max-md:top-8 max-md:right-6">
            <NavLink to="/signin" className="font-bold">
              <AiOutlineClose />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
