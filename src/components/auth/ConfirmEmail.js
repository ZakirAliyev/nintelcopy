import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
function ConfirmEmail() {
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
      .post(`${baseUrl}/auth/confirm-register-token`, token)
      .then((response) => {
        if (response.data.status === true) {
          setSuccessMessage("Success");
          navigate("/signin");
          setErrorMessage("");
        } else {
          setErrorMessage("Error");
          setSuccessMessage("");
        }
      })
      .catch((error) => {
        setErrorMessage("Error");
        setSuccessMessage("");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, navigate]);
  return (
    <Fragment>
      {loading && <p>Loading...</p>}
      {!loading && successMessage && (
        <p className="text-green-600">{successMessage}</p>
      )}
      {!loading && errorMessage && (
        <p className="text-red-600">{errorMessage}</p>
      )}
    </Fragment>
  );
}

export default ConfirmEmail;
