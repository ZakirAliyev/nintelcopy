import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
function ConfirmPassword() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    setLoading(true);
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const token = { token: slug };
    axios
      .post(`${baseUrl}/auth/confirm-password-token`, token)
      .then((response) => {
        if (response.data.status === true) {
          const userIdProps = response.data.data && response.data.data.user;
          const userToken = token;
          navigate("/reset-password", { state: { userIdProps, userToken } });
        }
        setLoading(false);
        setSuccessMessage("Success");
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage("Error");
        setSuccessMessage("");
      });
  }, [slug, navigate]);
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
          {loading ? (
            <p className="flex justify-center items-center">Loading...</p>
          ) : (
            <p className="flex justify-center items-center ">
              API query completed
            </p>
          )}
          <div className="my-4 text-center">
            {successMessage && (
              <p className="text-green-600">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmPassword;
