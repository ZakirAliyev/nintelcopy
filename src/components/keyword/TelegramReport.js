import React, { useEffect, useState, useCallback, Fragment } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Button from "../button/Button";
import Input from "../input/Input";
function TelegramReport() {
  const tokenCookies = JSON.parse(Cookies.get("token"));
  const clickedKeyword = sessionStorage.getItem("keywordId");
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [telegramGroupId, setTelegramGroupId] = useState("");
  const [status, setStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/get-telegram-report/${clickedKeyword}`,
        {
          headers: {
            Authorization: `Bearer ${tokenCookies}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.data.status === "active") {
        setStatus(true);
      } else if (response.data.data.status === "deactive") {
        setStatus(false);
      }
      const receivedTelegramGroupId = response.data.data.telegram_group_id;
      if (receivedTelegramGroupId) {
        setTelegramGroupId(receivedTelegramGroupId);
      }
    } catch (error) {
      console.error("GET request failed:", error);
    }
  }, [clickedKeyword, tokenCookies, baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendButtonClick = async () => {
    try {
      const newStatus = status ? "active" : "deactive";
      const response = await axios.post(
        `${baseUrl}/telegram-report`,
        {
          telegram_group_id: telegramGroupId,
          keyword_id: clickedKeyword,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenCookies}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setSuccessMessage(response.data.data);
        setErrorMessage("");
      }
      fetchData();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const dynamicField = Object.keys(error.response.data.message)[0];
        const errorMessage = error.response.data.message[dynamicField][0];
        setErrorMessage(errorMessage);
        setSuccessMessage("");
      }
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setTelegramGroupId(inputValue);
  };
  const handleStatusCheck = () => {
    setStatus((status) => !status);
  };

  return (
    <Fragment>
      <div className="my-4">
        <div className="flex items-center">
          <div className="mr-3 text-white  font-medium">Status check</div>
          <div className="relative">
            <Input
              type="checkbox"
              id="statusToggle"
              className="sr-only "
              checked={status}
              onChange={handleStatusCheck}
            />

            <label className="cursor-pointer" htmlFor="statusToggle">
              <div
                className={`block w-12 h-6 rounded-full ${
                  status ? "bg-green-600" : "bg-red-600"
                }`}
              ></div>
              <div
                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${
                  status ? "translate-x-6" : ""
                }`}
              ></div>
            </label>
          </div>
        </div>
        <div className="flex gap-4 border-b-[1px] py-4 items-center">
          <label htmlFor="companyname">Telegram group id</label>
          <div className="relative max-w-[70%]">
            <Input
              type="text"
              className=" text-white border-[#6e727d] bg-[#36394c] w-full border-[1px] py-2 px-2 rounded-[4px] focus:outline-none"
              value={telegramGroupId || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="my-4">
        {successMessage && (
          <div className="success-message text-green-600 font-bold">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="error-message text-red-600 font-bold">
            {errorMessage}
          </div>
        )}
      </div>
      <Button
        onClick={handleSendButtonClick}
        disabled={!telegramGroupId}
        className={`mt-4 flex items-center gap-2 bg-[#626ed4] hover:bg-[#535eb4] duration-200 px-5 py-2 text-white rounded-[8px] font-medium ${
          !telegramGroupId ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        Save
      </Button>
    </Fragment>
  );
}

export default TelegramReport;
