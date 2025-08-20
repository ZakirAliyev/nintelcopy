import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { SyncLoader } from "react-spinners";
import InputMask from "react-input-mask";
import Input from "../input/Input";
import { useRegisterMutation } from "../../redux/api/auth";

function Register() {
  const [register] = useRegisterMutation();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sucessMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const isFormValid = () => {
    return (
      firstname !== "" &&
      lastname !== "" &&
      password !== "" &&
      companyname !== "" &&
      phone !== "" &&
      email !== "" &&
      phone.replace(/[^0-9]/g, "").length === 10
    );
  };
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const userData = {
      firstname,
      lastname,
      email,
      password,
      companyname,
      phone,
    };
    try {
      const response = await register(userData).unwrap();
      if (response.status === true) {
        setSuccessMessage(
          "A confirmation message has been sent to your email address"
        );
        setError("");
        setLoading(false);
      } else {
        setSuccessMessage("");
        setError(response);
        setLoading(false);
      }
    } catch (error) {
      let errorMessage = "";
      for (const field in error.data.message) {
        if (Array.isArray(error.data.message[field])) {
          errorMessage = error.data.message[field][0];
          break;
        }
      }
      setError(errorMessage);
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
      <div className="col-span-1 flex justify-center items-center flex-col max-md:my-2">
        <div className="h-[100px]">
          <img
            className="h-full w-full"
            src="../assets/images/black_logo.png"
            alt=""
          />
        </div>
        <div className="flex flex-col w-[75%] justify-start text-black text-[14px] mb-4 max-md:w-[95%]">
          <p className="text-[48px] customFontDetailTitle max-md:text-[32px]">
            Sign up
          </p>
          <div className="flex gap-2 text-[#9BA5B5]">
            <p>If you have an account</p>
            <NavLink to="/signin" className="text-[#3A3FD8] hover:underline">
              Sign in
            </NavLink>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-[75%] max-md:w-[95%] ">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="font-semibold text-[#6b7280]" htmlFor="name">
                First name:
              </label>
              <Input
                placeholder="First name"
                type="text"
                className="border-[1px] bg-[#F3F4F5]  py-2 px-2 rounded-[8px] max-md:rounded-[8px] focus:outline-none"
                id="firstname"
                name="firstname"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mb-2 col-span-1">
              <label
                className="font-semibold text-[#6b7280]"
                htmlFor="lastname"
              >
                Last name:
              </label>
              <Input
                placeholder="Last name"
                className="border-[1px] bg-[#F3F4F5]  py-2 px-2 rounded-[8px] max-md:rounded-[8px] focus:outline-none"
                type="text"
                id="lastname"
                name="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mb-2 col-span-1 ">
              <label
                className="font-semibold text-[#6b7280]"
                htmlFor="companyname"
              >
                Company name:
              </label>
              <Input
                placeholder="Company name"
                className="border-[1px] bg-[#F3F4F5]  py-2 px-2 rounded-[8px] max-md:rounded-[8px] focus:outline-none"
                type="text"
                id="company"
                name="company"
                value={companyname}
                onChange={(e) => setCompanyname(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mb-2 col-span-1  ">
              <label className="font-semibold text-[#6b7280]" htmlFor="phone">
                Mobile number:
              </label>
              <div>
                <InputMask
                  className="border-b-[1px] w-full placeholder:text-[#6b7280] outline-none py-2 px-2 "
                  mask="(999) 999-99-99"
                  placeholder="(___) ___-__-__"
                  type="text"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[#6b7280]" htmlFor="email">
                Email:
              </label>
              <Input
                placeholder="Email"
                className="border-[1px] bg-[#F3F4F5]  py-2 px-2 rounded-[8px] max-md:rounded-[8px] focus:outline-none"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="font-semibold text-[#6b7280] "
                htmlFor="password"
              >
                Password:
              </label>
              <div className="relative bg-[#F3F4F5]  rounded-[8px] max-md:rounded-[8px] border-[1px]">
                <Input
                  placeholder="Password"
                  className="w-full bg-[#F3F4F5]  py-2 px-2 pr-10 focus:outline-none"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-[#6b7280]"
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 my-2">
            <div className="my-4 ">
              {sucessMessage && (
                <p className="text-green-600">{sucessMessage}</p>
              )}
              {error ? <p className="text-red-700">{error}</p> : ""}
            </div>
            <NavLink
              to="/forgotpassword"
              className="flex justify-end hover:underline hover:text-gray-500"
            >
              {" "}
              Forgot your password?
            </NavLink>
          </div>
          <div>
            {loading ? (
              <div className="flex justify-center py-4">
                <SyncLoader color={"#4f46e5"} loading={loading} size={10} />
              </div>
            ) : (
              !sucessMessage && (
                <Input
                  className={`rounded-[6px] w-full py-2 bg-[#4f46e5] text-white hover:bg-[#6366f1] duration-200 ${
                    !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={!isFormValid()}
                  value="Sign up"
                />
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
