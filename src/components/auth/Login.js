import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { SyncLoader } from "react-spinners";
import Cookies from "js-cookie";
import Button from "../button/Button";
import Input from "../input/Input";
import { useLoginMutation } from "../../redux/api/auth";

function Login() {
  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const credentials = {
      email,
      password,
    };
    try {
      const response = await login(credentials).unwrap();
      if (response !== undefined && response.status === true) {
        Cookies.set("user", JSON.stringify(response.data.user), { expires: 1 });
        const dataUser = response.data && response.data.user;
        Cookies.set("token", JSON.stringify(response.data.access_token), {
          expires: 1,
        });
        navigate("/", { state: { dataUser } });
        setError("");
      }
    } catch (error) {
      setError(error && error.data.message);
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const isFormValid = () => {
    return email !== "" && password !== "";
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
            Sign in
          </p>
          <div className="flex gap-2 text-[#9BA5B5]">
            <p>Don't have an account yet?</p>
            <NavLink to="/register" className="text-[#626ed4] hover:underline">
              Sign up
            </NavLink>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-[75%] max-md:w-[95%]">
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-[#6b7280]" htmlFor="email">
              Email:
            </label>
            <Input
              placeholder="Email"
              tabIndex="1"
              className="border-[1px] bg-[#F3F4F5] py-2 px-2 rounded-[8px] focus:outline-none"
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2 py-2 ">
            <label className="font-semibold text-[#6b7280] " htmlFor="password">
              Password:
            </label>
            <div className="relative bg-[#F3F4F5] border-[1px] rounded-[8px]">
              <Input
                placeholder="Password"
                tabIndex="2"
                className="w-full bg-[#F3F4F5] py-2 px-2 rounded-[8px]  focus:outline-none"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute cursor-pointer top-1/2 right-2 transform -translate-y-1/2 text-[#6b7280]"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <div className="col-span-1">
                {error && <p className="text-red-600  text-start">{error}</p>}
              </div>
              <NavLink
                to="/forgotpassword"
                className="flex col-span-1 justify-end hover:underline hover:text-gray-500"
              >
                Forgot your password?
              </NavLink>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <SyncLoader color={"#4f46e5"} loading={loading} size={10} />
            </div>
          ) : (
            <Button
              className={`border-[1px] w-full py-2 rounded-[8px] bg-[#626ed4] text-white hover:bg-[#6366f1] duration-200 ${
                !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isFormValid()}
            >
              Sign in
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
