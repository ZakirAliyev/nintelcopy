import React, { useState, useEffect, useRef, Fragment, memo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import Button from "../button/Button";
import { setIntervalAction } from "../../redux/api/interval/intervalActions";
function Interval() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const selectedDatesString = Cookies.get("selectedDates");
  const selectedDates = selectedDatesString
    ? JSON.parse(selectedDatesString)
    : null;
  // const currentPath = window.location.pathname;
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleDateChange = async (newDate) => {
    setDateRange(newDate);
    const formattedDates = newDate.map((date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    });
    dispatch(setIntervalAction(formattedDates));
    Cookies.set("selectedDates", JSON.stringify(formattedDates), {
      expires: 1,
    });

    // const startData = formattedDates.length > 0 && formattedDates[0];
    // const endData = formattedDates.length > 0 && formattedDates[1];
    // const tokenCookies = JSON.parse(Cookies.get("token"));
    // const baseUrl = process.env.REACT_APP_BASE_URL;
    // const keywordId = sessionStorage.getItem("keywordId");
    // if (currentPath === "/result-keyword") {
    //   try {
    //     const response = await axios.get(
    //       `${baseUrl}/articles/${keywordId}/${startData}/${endData}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${tokenCookies}`,
    //         },
    //       }
    //     );
    //     const sourceResponse = await axios.get(
    //       `${baseUrl}/source-distribution/${keywordId}/${startData}/${endData}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${tokenCookies}`,
    //         },
    //       }
    //     );

    //     const sentimentResponse = await axios.get(
    //       `${baseUrl}/sentiment/${keywordId}/${startData}/${endData}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${tokenCookies}`,
    //         },
    //       }
    //     );

    //     navigate("/result-keyword", {
    //       state: {
    //         dataInterval: response.data,
    //         dataSentiment: sentimentResponse.data,
    //         dataIntervalSource: sourceResponse.data,
    //       },
    //     });
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const today = new Date();
    const last14Days = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 13
    );

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    const defaultDateRange = [formatDate(last14Days), formatDate(today)];

    if (!selectedDates || selectedDates.length !== 2) {
      setDateRange([last14Days, today]);
      Cookies.set("selectedDates", JSON.stringify(defaultDateRange), {
        expires: 1,
      });
    }
  }, [selectedDates]);

  return (
    <Fragment>
      <div
        ref={dropdownRef}
        className="relative inline-block z-50 max-md:flex max-md:justify-center"
      >
        <Button
          className="text-white max-w-[250px] min-w-[200px] max-2xl:px-2 px-4 py-3 rounded font-medium border-[#6e727d] border-[1px]"
          onClick={toggleMenu}
        >
          {selectedDates && selectedDates.length === 2
            ? selectedDates.join(" : ")
            : "Select a time range."}
        </Button>

        {isOpen && (
          <div className="absolute top-16 left-0 text-black bg-white p-4 border max-md:top-12 max-md:left-auto">
            <h2 className="text-center font-bold">Time interval</h2>
            <div>
              <Calendar
                onChange={handleDateChange}
                value={dateRange}
                selectRange={true}
                maxDate={new Date()}
              />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default memo(Interval);
