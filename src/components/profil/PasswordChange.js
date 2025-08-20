import React, { useState, Fragment } from "react";
import { Helmet } from "react-helmet";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "../button/Button";
import Input from "../input/Input";
import { useChangePasswordMutation } from "../../redux/api/profile";
function Password() {
  const [updatePassword] = useChangePasswordMutation();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [repeat_password, setRepeat_Password] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSuccessMessage] = useState("");
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleRepeatPasswordChange = (e) => {
    setRepeat_Password(e.target.value);
  };
  // useEffect(() => {
  //   const link = document.querySelector("link[rel='icon']");
  //   if (link) {
  //     link.href = "../../assets/images/2.png";
  //   }
  // }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      password: newPassword,
      repeat_password: repeat_password,
    };
    const updatedMethod = await updatePassword(requestData);
    if (
      updatedMethod &&
      updatedMethod.data &&
      updatedMethod.data.status &&
      updatedMethod.data.status === true
    ) {
      const message =
        updatedMethod && updatedMethod.data && updatedMethod.data.data;
      setSuccessMessage(message);
      setErrorMessage("");
    } else if (
      updatedMethod.error &&
      updatedMethod.error.data.status === false
    ) {
      let errorMessage = "";
      for (const field in updatedMethod.error.data.message) {
        if (Array.isArray(updatedMethod.error.data.message[field])) {
          errorMessage = updatedMethod.error.data.message[field][0];
          break;
        }
      }
      setErrorMessage(errorMessage);
      setSuccessMessage("");
    }
  };
  const isSubmitDisabled = newPassword === "" || repeat_password === "";

  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Change password</title>
      </Helmet>
      <div className="mt-4 text-white">
        <p className="text-[18px] font-semibold">Password</p>
        <p>Enter your new password to reset your password</p>
      </div>
      <form>
        <div className="grid grid-cols-3  border-b-[1px] py-8 items-center">
          <label className="customFontCategory col-span-1 font-semibold text-white">
            New password
          </label>
          <div className="relative col-span-2 max-w-[70%] max-md:max-w-full">
            <Input
              className=" text-white bg-[#36394c] border-[#6e727d] w-full border-[1px] py-2 px-3 rounded-[8px] focus:outline-none"
              value={newPassword}
              placeholder="New password"
              onChange={handleNewPasswordChange}
              type={showNewPassword ? "text" : "password"}
              autoComplete="newpassword"
              required
            />

            <span
              onClick={toggleNewPasswordVisibility}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white"
            >
              {showNewPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 border-b-[1px] py-8 items-center ">
          <label className="customFontCategory col-span-1 font-semibold text-white">
            Confirm password
          </label>
          <div className="relative col-span-2 max-w-[70%] max-md:max-w-full">
            <Input
              className="text-white bg-[#36394c] border-[#6e727d] w-full border-[1px] py-2 px-3 rounded-[8px] focus:outline-none"
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Confirm password"
              autoComplete="confirmpassword"
              value={repeat_password}
              required
              onChange={handleRepeatPasswordChange}
            />

            <span
              onClick={toggleRepeatPasswordVisibility}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white"
            >
              {" "}
              {showRepeatPassword ? (
                <AiOutlineEye />
              ) : (
                <AiOutlineEyeInvisible />
              )}
            </span>
          </div>
        </div>
        {sucessMessage && (
          <p className="text-green-700 font-bold">
            {sucessMessage && sucessMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-700 font-bold">{errorMessage}</p>
        )}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            className={`px-5 py-2 font-semibold text-white rounded-[6px] bg-[#626ed4] hover:bg-[#535eb4] duration-200 ${
              isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
            }  `}
            disabled={isSubmitDisabled}
          >
            Update password
          </Button>
        </div>
      </form>
    </Fragment>
  );
}

export default Password;
