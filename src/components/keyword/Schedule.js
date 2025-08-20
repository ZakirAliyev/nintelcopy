import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { Helmet } from "react-helmet";
import Button from "../button/Button";
import Input from "../input/Input";
import {
  useGetScheduleQuery,
  usePostScheduleMutation,
} from "../../redux/api/scheduleReport";
function Schedule() {
  const clickedKeyword = sessionStorage.getItem("keywordId");
  const { data: scheduleReport } = useGetScheduleQuery({ id: clickedKeyword });
  const scheduleDataRedux = scheduleReport && scheduleReport.data;
  const [createSchedule] = usePostScheduleMutation();
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [formDisabled, setFormDisabled] = useState(true);
  const [timeDisabled, setTimeDisabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (scheduleDataRedux) {
      const selectedTimeRedux = {
        value: scheduleDataRedux.report_time,
        label: scheduleDataRedux.report_time,
      };
      setSelectedDay(selectedTimeRedux);
      if (scheduleDataRedux && Array.isArray(scheduleDataRedux.emails)) {
        const emailString = scheduleDataRedux.emails.join(", ");
        setEmail(emailString);
      }
      if (scheduleDataRedux && scheduleDataRedux.status === "active") {
        setStatus(false);
      } else if (scheduleDataRedux.status === "deactive") {
        setStatus(true);
      }

      if (scheduleDataRedux && scheduleDataRedux.multi_time === "active") {
        setIsChecked(true);
        setFormDisabled(false);
        setTimeDisabled(true);
      } else if (scheduleDataRedux.multi_time === "deactive") {
        setIsChecked(false);
        setFormDisabled(true);
        setTimeDisabled(false);
      }
      if (scheduleDataRedux && scheduleDataRedux.report_hours) {
        let parsedHours = null;
        try {
          parsedHours = JSON.parse(scheduleDataRedux.report_hours);
        } catch (error) {
          console.error("Error parsing report hours:", error);
        }
        if (parsedHours && Array.isArray(parsedHours)) {
          if (parsedHours.length > 1) {
            const selectedHoursRedux = parsedHours.map((hour) => ({
              value: hour,
              label: hour,
            }));
            setSelectedHour("");
            setSelectedHours(selectedHoursRedux);
          } else {
            const selectedHourRedux = {
              value: parsedHours[0],
              label: `${parsedHours[0]}`,
            };
            setSelectedHour(selectedHourRedux);
          }
        } else {
          const selectedHourRedux = {
            value: scheduleDataRedux.report_hours,
            label: `${scheduleDataRedux.report_hours}`,
          };
          setSelectedHour(selectedHourRedux);
        }
      }
    }
  }, [scheduleDataRedux]);
  const handleSave = async () => {
    let hoursToSend = [];
    if (isChecked && selectedHours.length < 2) {
      setErrorMessage("You must choose at least 2 times!");
      setSuccessMessage("");
      return;
    } else {
      setErrorMessage("");
    }
    if (selectedHour && selectedHour.label) {
      hoursToSend = [selectedHour.label];
    } else if (selectedHours.length > 1) {
      hoursToSend = selectedHours.map((hour) => hour.label);
    }
    const emailArray =
      typeof email === "string"
        ? email.split(",").map((email) => email.trim())
        : [];

    await createSchedule({
      emails: emailArray,
      report_time: selectedDay ? selectedDay.value : "",
      report_hours: hoursToSend,
      status: statusToSend,
      multi_time: statusMultiTime,
      keyword_id: clickedKeyword,
    })
      .unwrap()
      .then((data) => {
        if (data.status === true) {
          setSuccessMessage(data.data);
          setErrorMessage("");
        } else {
          setErrorMessage(data);
          setSuccessMessage("");
        }
      })
      .catch((err) => {
        let errorMessage = "";
        for (const field in err.data.message) {
          if (Array.isArray(err.data.message[field])) {
            errorMessage = err.data.message[field][0];
            break;
          }
        }
        setErrorMessage(errorMessage);
        setSuccessMessage("");
      });
  };
  const toggleHandler = () => {
    setIsChecked((prevState) => !prevState);
    setFormDisabled((formDisabled) => !formDisabled);
    setTimeDisabled((timeDisabled) => !timeDisabled);
  };
  useEffect(() => {
    if (formDisabled) {
      setSelectedHours([]);
    }
    if (timeDisabled) {
      setSelectedHour([]);
    }
  }, [formDisabled, timeDisabled]);

  ////////////////////////// DAYS SELECT //////////////////////////////
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 30; i++) {
      days.push({ value: i, label: `${i}` });
    }
    return days;
  };
  const dayOptions = generateDays();
  const [selectedDay, setSelectedDay] = useState([]);
  const handleDayChange = (selectedOption) => {
    setSelectedDay(selectedOption);
  };
  //////////////////////////////////////////////////////////////

  ///////////////SELECTED HOURS////////////////
  const [selectedHour, setSelectedHour] = useState([]);
  const generateHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      hours.push({ value: hour, label: `${hour}:00` });
    }
    return hours;
  };
  const hourOptions = generateHours();
  //////////////////////////////
  const hourOptionsElvin = generateHours();

  const [selectedHours, setSelectedHours] = useState([]);
  const handleChange = (selectedOptions) => {
    setSelectedHours(selectedOptions);
  };

  const handleStatusCheck = () => {
    setStatus((status) => !status);
  };
  const statusToSend = status ? "deactive" : "active";
  const statusMultiTime = isChecked ? "active" : "deactive";
  const handleTextChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Settings keyword</title>
      </Helmet>
      <div className="my-4">
        <div className="flex items-center my-4">
          <div className="mr-3 text-white font-medium">Status check</div>
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
                  status ? "bg-red-600" : "bg-green-600"
                }`}
              ></div>
              <div
                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${
                  status ? "" : "translate-x-6"
                }`}
              ></div>
            </label>
          </div>
        </div>
      </div>

      <div className="gap-4 flex flex-col my-3">
        <div className="flex gap-4">
          <Select
            onChange={handleDayChange}
            value={selectedDay}
            options={dayOptions}
            placeholder="Select day"
            className="text-black"
          />
          <Select
            onChange={(selectedOption) => setSelectedHour(selectedOption)}
            value={selectedHour}
            options={hourOptions}
            placeholder="Select hour"
            isDisabled={timeDisabled}
            className="text-black"
          />
        </div>
        <div className="inline-block">
          <label htmlFor="toggle" className="flex items-center cursor-pointer">
            <div className="mr-3 text-white font-medium">
              Enable multiple schedules per day
            </div>
            <div className="relative">
              <Input
                type="checkbox"
                id="toggle"
                className="sr-only"
                checked={isChecked}
                onChange={toggleHandler}
              />
              <div
                className={`block w-12 h-6 rounded-full ${
                  isChecked ? "bg-green-600" : "bg-red-600"
                }`}
              ></div>
              <div
                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${
                  isChecked ? "translate-x-6" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
        <div>
          <Select
            options={hourOptionsElvin}
            onChange={(selectedOption) => handleChange(selectedOption)}
            value={selectedHours}
            isDisabled={formDisabled}
            isMulti
            className="text-black bg-[#36394c]"
          />
          <div
            className={`${formDisabled ? "hidden" : ""}`}
            id="output"
            style={{
              padding: "10px",
              marginTop: "10px",
              background: "#36394c",
            }}
          >
            {selectedHours.length > 0
              ? `Selected times: ${selectedHours
                  .map((hour) => hour.label)
                  .join(", ")}`
              : null}
          </div>
        </div>
        <div>
          <textarea
            value={email}
            onChange={handleTextChange}
            required
            className="border-[1px] w-full rounded-[4px] p-2 outline-none text-white bg-[#36394c] border-[#6e727d]"
            rows="5"
          ></textarea>
        </div>
        {successMessage && (
          <p className="text-green-600 font-bold">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 font-bold">{errorMessage}</p>
        )}
        <div>
          <Button
            onClick={handleSave}
            className="bg-[#626ed4] hover:bg-[#535eb4] px-5 py-2 font-medium text-white rounded-[8px] duration-200"
          >
            Save
          </Button>
        </div>
      </div>
    </Fragment>
  );
}

export default Schedule;
