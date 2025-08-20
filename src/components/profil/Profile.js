import React, { Fragment, useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { CgProfile } from "react-icons/cg";
import { BsBuilding } from "react-icons/bs";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { Helmet } from "react-helmet";
import Button from "../button/Button";
import Input from "../input/Input";
import {
  useGetProfileQuery,
  useProfileUpdateMutation,
} from "../../redux/api/profile";
function Profile() {
  const { data: profilRedux } = useGetProfileQuery();
  const [updateProfile] = useProfileUpdateMutation();
  const profilData = profilRedux && profilRedux.data;
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
  const [sucessMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateLastName, setUpdateLastName] = useState("");
  const [updateCompanyName, setUpdateCompanyName] = useState("");
  const [updatePhone, setUpdatePhone] = useState("");

  useEffect(() => {
    if (profilData) {
      setUpdateFirstName(profilData.firstname);
      setUpdateLastName(profilData.lastname);
      setUpdateCompanyName(profilData.companyname);
      setUpdatePhone(profilData.phone);
    }
  }, [
    profilData,
    setUpdateFirstName,
    setUpdateLastName,
    setUpdateCompanyName,
    setUpdatePhone,
  ]);

  const handleFirstNameChange = (e) => {
    setUpdateFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setUpdateLastName(e.target.value);
  };
  const handleCompanyChange = (e) => {
    setUpdateCompanyName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setUpdatePhone(e.target.value);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const requestData = {
      firstname: updateFirstName,
      lastname: updateLastName,
      companyname: updateCompanyName,
      phone: updatePhone,
    };

    try {
      const updatedMethod = await updateProfile(requestData);
      if (
        updatedMethod &&
        updatedMethod.data &&
        updatedMethod.data.status === true
      ) {
        setSuccessMessage(updatedMethod.data.data);
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
    } catch (error) {
      setErrorMessage("An error occurred while updating profile");
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (
      updateFirstName &&
      updateLastName &&
      updateCompanyName &&
      updatePhone.replace(/[^0-9]/g, "").length === 10
    ) {
      setIsUpdateDisabled(false);
    } else {
      setIsUpdateDisabled(true);
    }
  }, [updateFirstName, updateLastName, updateCompanyName, updatePhone]);
  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Settings</title>
      </Helmet>
      <div className="mt-4 text-white">
        <p className="text-[18px] font-semibold ">General</p>
        <p>
          Basic info, like your name and address that will be displayed in
          public
        </p>
      </div>
      <div className="grid grid-cols-3 border-b-[1px] py-8 items-center  ">
        <label
          className="customFontCategory col-span-1 font-semibold text-white"
          htmlFor="firstname"
        >
          Name
        </label>
        <div className="col-span-2  relative max-w-[70%] max-md:max-w-full">
          <Input
            type="text"
            className=" text-white bg-[#36394c] border-[#6e727d] w-full border-[1px] py-2 px-10 max-md:px-7 rounded-[8px] focus:outline-none"
            id="firstname"
            placeholder="Name"
            value={updateFirstName}
            onChange={handleFirstNameChange}
            required
          />
          <div className="absolute top-1/2 left-3 max-md:left-2 transform -translate-y-1/2 text-white text-[18px]">
            <CgProfile />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 border-b-[1px] py-8 items-center">
        <label
          className="customFontCategory col-span-1 font-semibold text-white"
          htmlFor="lastname"
        >
          Last name
        </label>
        <div className="relative col-span-2 max-w-[70%] max-md:max-w-full">
          <Input
            type="text"
            className="text-white bg-[#36394c] border-[#6e727d] w-full border-[1px] py-2 px-10 max-md:px-7 rounded-[8px] focus:outline-none"
            id="lastname"
            placeholder="Last name"
            value={updateLastName}
            onChange={handleLastNameChange}
            required
          />

          <div className="absolute top-1/2 left-3 max-md:left-2 transform -translate-y-1/2 text-white text-[18px]">
            <CgProfile />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 border-b-[1px] py-8 items-center">
        <label
          className="customFontCategory col-span-1 font-semibold text-white"
          htmlFor="companyname"
        >
          Company name
        </label>
        <div className="relative max-w-[70%] col-span-2 max-md:max-w-full">
          <Input
            type="text"
            className="text-white bg-[#36394c] border-[#6e727d] w-full border-[1px] py-2 px-10 max-md:px-7 rounded-[8px] focus:outline-none"
            id="companyname"
            placeholder="Company name"
            value={updateCompanyName}
            onChange={handleCompanyChange}
            required
          />

          <div className="absolute top-1/2 left-3 max-md:left-2 transform -translate-y-1/2 text-white text-[18px]">
            <BsBuilding />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 border-b-[1px] py-8 items-center">
        <label
          className="customFontCategory col-span-1 font-semibold text-white"
          htmlFor="email"
        >
          Email
        </label>
        <div className="col-span-2 relative max-w-[70%] max-md:max-w-full">
          <Input
            placeholder={profilData && profilData.email}
            type="text"
            className="text-white bg-[#36394c] border-[#6e727d] placeholder:text-white w-full cursor-not-allowed border-[1px] py-2 px-10 max-md:px-0  max-md:pl-7 rounded-[8px] focus:outline-none"
            id="email"
            readOnly
            name="email"
            required
          />

          <div className="absolute top-1/2 left-3 max-md:left-2 transform -translate-y-1/2 text-white text-[18px]">
            <AiOutlineMail />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 border-b-[1px] py-8 items-center">
        <label
          className="customFontCategory col-span-1 font-semibold text-white"
          htmlFor="phone"
        >
          Phone number
        </label>
        <div className="relative col-span-2 max-w-[70%] max-md:max-w-full">
          <InputMask
            mask="(999) 999-99-99"
            placeholder="(___) ___-__-__"
            type="text"
            className="text-white bg-[#36394c] border-[#6e727d] w-full border-[1px] py-2 px-10 max-md:px-7 rounded-[8px] focus:outline-none"
            id="phone"
            name="phone"
            value={updatePhone}
            onChange={handlePhoneChange}
            required
          />
          <div className="absolute top-1/2 left-3 max-md:left-2 transform -translate-y-1/2 text-white text-[18px]">
            <AiOutlinePhone />
          </div>
        </div>
      </div>
      <div>
        {sucessMessage && (
          <p className="text-green-500 font-bold">{sucessMessage}</p>
        )}

        {errorMessage && (
          <p className="text-red-500 font-bold">{errorMessage}</p>
        )}
        <div className="py-4">
          <div>
            <Button
              className={`px-5 py-2 font-semibold text-white rounded-[6px] bg-[#626ed4] hover:bg-[#535eb4] duration-200 ${
                isUpdateDisabled ? "opacity-50 cursor-not-allowed" : ""
              }  `}
              onClick={handlePost}
              disabled={isUpdateDisabled}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Profile;
