import React, { useState, useEffect, Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { AiOutlinePlus } from "react-icons/ai";
import { Helmet } from "react-helmet";
// import Cookies from "js-cookie";
import { FaCheck } from "react-icons/fa6";
import { GrClose } from "react-icons/gr";
import Button from "../button/Button";
import Input from "../input/Input";
import { useEditTopicsMutation } from "../../redux/api/keywords";

function EditKeyword() {
  const [editTopic] = useEditTopicsMutation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState(state.title || "");
  const [description, setDescription] = useState(state.description || "");
  const [keywordValues, setKeywordValues] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const tokenCookies = JSON.parse(Cookies.get("token"));
  const keywordId = state && state.keywordId;

  useEffect(() => {
    if (state && state.keywordList && state.keywordList.title) {
      setTitle(state.keywordList.title);
    }
    if (state && state.keywordList && state.keywordList.description) {
      setDescription(state.keywordList.description);
    }
    if (state && state.keywordList && state.keywordList.keyword) {
      const orGroups = state.keywordList.keyword.split(" AND ");
      const groupedKeywords = orGroups.map((group) => group.split(" OR "));
      const cleanedKeywords = groupedKeywords.map((group) =>
        group.map((keyword) => keyword.replace(/[()']/g, ""))
      );
      setKeywordValues(cleanedKeywords);
    }
  }, [state]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddGroup = () => {
    const updatedKeywords = [...keywordValues];
    updatedKeywords.push([""]);
    setKeywordValues(updatedKeywords);
  };
  const handleInputChange = (groupIndex, keywordIndex, e) => {
    const updatedKeywords = [...keywordValues];
    const newValue = `"${e.target.value}"`;
    updatedKeywords[groupIndex][keywordIndex] = newValue;
    setKeywordValues(updatedKeywords);
  };
  const handleAddKeyword = (groupIndex) => {
    const updatedKeywords = [...keywordValues];
    const lastKeywordIndex = updatedKeywords[groupIndex].length - 1;

    if (
      lastKeywordIndex >= 0 &&
      updatedKeywords[groupIndex][lastKeywordIndex].includes(")")
    ) {
      updatedKeywords[groupIndex][lastKeywordIndex] = updatedKeywords[
        groupIndex
      ][lastKeywordIndex].replace(/\)/g, "");
    }

    updatedKeywords[groupIndex].push("");
    setKeywordValues(updatedKeywords);
  };

  const handleDeleteKeyword = (groupIndex, keywordIndex) => {
    const updatedKeywords = [...keywordValues];
    updatedKeywords[groupIndex].splice(keywordIndex, 1);
    setKeywordValues(updatedKeywords);

    if (updatedKeywords[groupIndex].length === 0) {
      const remainingGroups = updatedKeywords.filter(
        (group, index) => index !== groupIndex
      );
      setKeywordValues(remainingGroups);
    }
  };

  const toggleNotStatus = (groupIndex, keywordIndex) => {
    const updatedKeywords = [...keywordValues];
    const currentKeyword = updatedKeywords[groupIndex][keywordIndex];

    const updatedKeyword = currentKeyword.startsWith("NOT")
      ? currentKeyword.replace(/^NOT\s/, "")
      : `NOT ${currentKeyword}`;

    updatedKeywords[groupIndex][keywordIndex] = updatedKeyword;
    setKeywordValues(updatedKeywords);
  };

  const editTopics = () => {
    const formattedKeywords = keywordValues
      .map((group) => `(${group.join(" OR ")})`)
      .join(" AND ");
    editTopic({
      title: title,
      description: description,
      keyword: formattedKeywords,
      id: keywordId,
    })
      .unwrap()
      .then((data) => {
        if (data.status === true) {
          setSuccessMessage(data.data);
          setErrorMessage("");
          navigate("/topics-list", { state: { refetch: true } });
        } else {
          setErrorMessage(data);
          setSuccessMessage("");
        }
      })
      .catch((error) => {
        setErrorMessage("Error edited keywords" + error.message);
        setSuccessMessage("");
      });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Edit keyword</title>
      </Helmet>
      <div className="mb-4">
        <label className="block mb-1 font-bold text-[#adb5bd]">Title:</label>
        <Input
          className="border-[1px] outline-none bg-[#36394c] text-white border-[#6e727d] px-2 py-2 rounded-[8px] w-full"
          type="text"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-bold text-[#adb5bd]">
          Desctiption:
        </label>
        <textarea
          className="border-[1px] outline-none bg-[#36394c] text-white border-[#6e727d] px-2 py-2 rounded-[8px] w-full"
          cols="135"
          value={description}
          onChange={handleDescriptionChange}
          rows="5"
        ></textarea>
      </div>

      <Button
        className="bg-[#626ed4] hover:bg-[#535eb4] flex items-center gap-2 text-white rounded-[8px]  px-2 py-2 duration-200"
        onClick={handleAddGroup}
      >
        <span className="text-[20px] max-md:text-[18px]">
          <AiOutlinePlus />
        </span>
        Add group
      </Button>

      {keywordValues.map((orGroup, groupIndex) => (
        <div
          key={groupIndex}
          style={{
            borderBottom: "1px solid white",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {orGroup.map((keyword, keywordIndex) => (
            <div
              key={keywordIndex}
              className="grid grid-cols-4 items-center gap-12 mb-4 max-md:gap-4"
            >
              <label className="col-span-1 text-[#adb5bd]">
                Keyword value:
              </label>
              <Input
                className="border-[1px] outline-none bg-[#36394c] text-white col-span-2 border-[#6e727d] rounded-[8px] py-2 px-2"
                type="text"
                value={keyword.replace(/["']/g, "")}
                onChange={(e) => handleInputChange(groupIndex, keywordIndex, e)}
              />

              <div className="flex justify-end gap-4 max-md:gap-2">
                <Button
                  className="bg-red-600 hover:bg-red-700 col-span-1 text-white px-2 py-2 text-[24px] rounded-[8px]  duration-200 max-md:text-[18px]"
                  onClick={() => handleDeleteKeyword(groupIndex, keywordIndex)}
                  children={<GoTrash />}
                />

                <Button
                  className="bg-[#626ed4] hover:bg-[#535eb4] col-span-1 text-white px-2 py-2 text-[24px] rounded-[8px]  duration-200 max-md:text-[18px]"
                  onClick={() => toggleNotStatus(groupIndex, keywordIndex)}
                  children={
                    keyword.startsWith("NOT") ? <GrClose /> : <FaCheck />
                  }
                />
              </div>
            </div>
          ))}

          <Button
            onClick={() => handleAddKeyword(groupIndex)}
            className="bg-[#7B16E5] text-white px-2 py-2 text-[24px] rounded-[8px] hover:bg-[#5600b3] duration-200 max-md:text-[18px]"
            children={<AiOutlinePlus />}
          />
        </div>
      ))}
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
        className="bg-[#626ed4] hover:bg-[#535eb4] font-medium text-white px-4 rounded-[8px]  duration-200 py-2"
        onClick={editTopics}
        children={"Edit topic"}
      />
    </Fragment>
  );
}

export default EditKeyword;
