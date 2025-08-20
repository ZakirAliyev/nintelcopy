import React, { useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { SyncLoader } from "react-spinners";
// import { getToken } from "./token/getToken";
import Button from "../button/Button";
import Input from "../input/Input";
import { useResetPasswordMutation } from "../../redux/api/auth";
function NewPassword() {
  const location = useLocation();
  const [resetPassword] = useResetPasswordMutation();
  const userId = location.state && location.state.userIdProps;
  const userTokenProps = location.state && location.state.userToken.token;
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [repeat_password, setRepeat_Password] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   if (!userTokenProps) {
  //     const token = getToken();
  //     if (!token) {
  //       navigate("/");
  //     } else {
  //       navigate("/");
  //     }
  //   }
  // }, [navigate, userTokenProps]);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password === repeat_password) {
      const response = await resetPassword({
        user_id: userId,
        password: password,
        repeat_password: repeat_password,
        token: userTokenProps,
      });
      if (response && response.payload.status === true) {
        navigate("/signin");
        setLoading(false);
      } else {
        setErrorMessage("An error occurred, please enter the password again.");
        setLoading(false);
      }
    } else {
      setErrorMessage(
        "The passwords do not match, please re-enter the password"
      );
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

        <form className="w-[75%] max-md:w-[95%]">
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-[48px] customFontDetailTitle max-md:text-[32px]">
              Reset password
            </p>
            <label className="font-semibold text-[#6b7280]" htmlFor="email">
              New password
            </label>
            <div className="relative p-2">
              <Input
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-[1px] bg-[#F3F4F5] py-2 px-2 rounded-[8px] focus:outline-none"
                required
              />
              <Button
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#6b7280]"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4 py-2 ">
            <label className="font-semibold text-[#6b7280] " htmlFor="password">
              Repeat the password
            </label>
            <div className="relative p-2">
              <Input
                placeholder="Repeat the password"
                value={repeat_password}
                onChange={(e) => setRepeat_Password(e.target.value)}
                className="w-full bg-[#F3F4F5] py-2 px-2 rounded-[8px]  focus:outline-none"
                type={showPassword ? "text" : "password"}
                required
              />

              <Button
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#6b7280]"
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </Button>
            </div>
            {errorMessage && <p className="text-red-800">{errorMessage}</p>}
          </div>
          <div className="my-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <SyncLoader color={"#4f46e5"} loading={loading} size={10} />
              </div>
            ) : (
              <Button
                onClick={handleResetPassword}
                className="border-[1px] w-full  py-2 rounded-[6px] bg-[#4f46e5] text-white hover:bg-[#6366f1] duration-200"
              >
                Confirmation
              </Button>
            )}

            <div className="absolute top-12 right-12 text-white">
              <NavLink to="/signin">
                <AiOutlineClose />
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
