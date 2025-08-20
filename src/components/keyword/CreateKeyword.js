import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { GoTrash } from "react-icons/go";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import { FaCheck } from "react-icons/fa6";
import { GrClose } from "react-icons/gr";
import Button from "../button/Button";
import Input from "../input/Input";
import {
  useCreateTopicsMutation,
  useGetUserCompanyQuery,
} from "../../redux/api/keywords";
function CreateKeyword() {
  const [createTopic] = useCreateTopicsMutation();
  const { data: companyIdRedux } = useGetUserCompanyQuery();
  const company_id =
    companyIdRedux && companyIdRedux.data && companyIdRedux.data.company_id;
  const navigate = useNavigate();
  // const userId = Cookies.get("user");
  // const userDataId = userId ? JSON.parse(userId).id : null;
  const tokenCookies = JSON.parse(Cookies.get("token"));
  let accessTokenToSend = tokenCookies;
  // try {
  //   const refresh_token =
  //     userCompanyIdReduxActions &&
  //     userCompanyIdReduxActions.message &&
  //     userCompanyIdReduxActions.message
  //       ? userCompanyIdReduxActions.message.refresh_token
  //       : null;
  //   if (refresh_token) {
  //     Cookies.set("token", JSON.stringify(refresh_token));
  //   }
  //   const tokenFromCookie = Cookies.get("token");
  //   const tokenCookies = tokenFromCookie ? JSON.parse(tokenFromCookie) : null;
  //   accessTokenToSend = tokenCookies;
  // } catch (error) {
  //   console.error(error.message);
  // }
  const [errorMessage, setErrorMessage] = useState("");
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [groups, setGroups] = useState([
    { id: 1, items: [{ id: 1, itemName: "", isNot: false }] },
  ]);
  const addGroup = () => {
    if (groups.length < 5) {
      const newGroup = {
        id: groups.length + 1,
        items: [{ id: 1, itemName: "" }],
      };
      setGroups([...groups, newGroup]);
    }
  };
  const toggleNotStatus = (groupId, itemId) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    itemName:
                      item.itemName && !item.isNot
                        ? `${item.itemName}`
                        : item.itemName && item.isNot
                        ? item.itemName.replace(/^NOT /, "")
                        : item.itemName || "",
                    isNot: !item.isNot,
                  }
                : item
            ),
          }
        : group
    );
    setGroups(updatedGroups);
  };

  // useEffect(() => {
  //   dispatch(
  //     fetchGetUserCompany({
  //       userid: userDataId,
  //       accessToken: accessTokenToSend,
  //     })
  //   );
  // }, [dispatch, userDataId, accessTokenToSend]);

  const addItem = (groupId) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            items: [
              ...group.items,
              { id: group.items.length + 1, itemName: "" },
            ],
          }
        : group
    );
    setGroups(updatedGroups);
  };

  const removeGroup = (groupId) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);
  };
  const removeItem = (groupId, itemId) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId
        ? { ...group, items: group.items.filter((item) => item.id !== itemId) }
        : group
    );
    setGroups(updatedGroups);
  };
  const handleItemNameChange = (groupId, itemId, value) => {
    const updatedGroups = groups.map((group) =>
      group.id === groupId
        ? {
            ...group,
            items: group.items.map((item) =>
              item.id === itemId ? { ...item, itemName: value } : item
            ),
          }
        : group
    );

    setGroups(updatedGroups);
  };
  const handleSave = async () => {
    const combinedKeywords = groups
      .map(
        (group) =>
          `(${group.items
            .map((item) => {
              if (item.isNot) {
                return `NOT "${item.itemName}"`;
              } else {
                return `"${item.itemName}"`;
              }
            })
            .join(" OR ")})`
      )
      .join(" AND ");
    createTopic({
      company_id: company_id,
      keyword: combinedKeywords,
      accessToken: accessTokenToSend,
      title: titleValue,
      description: descriptionValue,
    })
      .unwrap()
      .then((data) => {
        if (data.status === true) {
          navigate("/topics-list", { state: { refetch: true } });
          setErrorMessage("");
        } else {
          setErrorMessage(data);
        }
      });
    setTitleValue("");
    setDescriptionValue("");
    setGroups([{ id: 1, items: [{ id: 1, itemName: "" }] }]);
  };

  const isSaveDisabled =
    !titleValue ||
    groups.some((group) => group.items.some((item) => !item.itemName));

  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Create keyword</title>
      </Helmet>
      <div className="mb-4">
        <label className="block mb-1 font-bold text-[#adb5bd]">Title:</label>
        <Input
          value={titleValue}
          required
          onChange={(e) => setTitleValue(e.target.value)}
          type="text"
          className="border-[1px] outline-none bg-[#36394c] text-white border-[#6e727d] px-2 py-2 rounded-[8px] w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-bold text-[#adb5bd]">
          Desctiption:
        </label>
        <textarea
          cols="135"
          rows="5"
          required
          value={descriptionValue}
          onChange={(e) => setDescriptionValue(e.target.value)}
          className="border-[1px] outline-none bg-[#36394c] text-white border-[#6e727d] px-2 py-2 rounded-[8px] w-full"
        />
      </div>
      <div className="flex gap-4 mb-4">
        <Button
          className="bg-[#626ed4] flex items-center gap-2 text-white rounded-[8px] hover:bg-[#535eb4] px-2 py-2 duration-200"
          onClick={addGroup}
        >
          <span className="text-[20px]">
            <AiOutlinePlus />
          </span>
          Add group
        </Button>
      </div>

      {groups.map((group) => (
        <div key={group.id}>
          <table>
            <thead>
              <tr className="text-[#adb5bd]">
                <th>Exclude</th>
                <th>Keyword</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((item) => (
                <tr key={item.id} className="mb-2">
                  <td>
                    <Button
                      className={`px-4 py-3 border-[#6e727d] text-white rounded-r-[8px] border-[1px] ${
                        item.isNot ? "border-red-500" : ""
                      }`}
                      onClick={() => toggleNotStatus(group.id, item.id)}
                    >
                      {item.isNot ? <GrClose /> : <FaCheck />}
                    </Button>
                  </td>
                  <td className="w-full">
                    <Input
                      type="text"
                      className={`border-[1px] bg-[#36394c] outline-none text-white border-[#6e727d] px-2 py-2 rounded-s-[8px] w-full ${
                        group.isNotGroup
                          ? "border-red-500  focus:outline-red-600"
                          : ""
                      }`}
                      placeholder="Keyword"
                      value={item.itemName}
                      onChange={(e) =>
                        handleItemNameChange(group.id, item.id, e.target.value)
                      }
                      required
                    />
                  </td>
                  <td>
                    <Button
                      className={`px-4 py-2 border-[#6e727d] text-red-600 rounded-r-[8px] border-[1px] ${
                        group.isNotGroup ? "border-red-500  " : ""
                      }`}
                      onClick={() => removeItem(group.id, item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-4 my-4 max-md:justify-between">
            <Button
              className="flex items-center gap-2 text-white px-2 py-2 rounded-[8px] bg-red-600 duration-200 hover:bg-red-700"
              onClick={() => removeGroup(group.id)}
            >
              <span className="text-[20px]">
                <GoTrash />
              </span>
              Delete group
            </Button>
            <Button
              className="flex items-center gap-2 px-2 py-2 bg-[#626ed4] rounded-[8px] hover:bg-[#535eb4] duration-200 text-white"
              onClick={() => addItem(group.id)}
            >
              <span className="text-[20px]">
                <AiOutlinePlus />
              </span>
              Add keyword
            </Button>
          </div>
        </div>
      ))}
      <textarea
        cols="135"
        rows="5"
        readOnly
        value={groups
          .map(
            (group, index) =>
              `${index > 0 ? " AND " : ""} (${group.items
                .map(
                  (item) =>
                    `${item.isNot ? 'NOT "' : '"'}${item.itemName}${
                      item.isNot ? '"' : '"'
                    }`
                )
                .join(" OR ")})`
          )
          .join("")}
        className="border-[1px] bg-[#36394c] outline-none text-white border-[#6e727d] px-2 py-2 rounded-[8px] w-full"
      />
      {errorMessage && <p className="text-red-500 font-bold">{errorMessage}</p>}

      <div className="py-4">
        <Button
          disabled={isSaveDisabled}
          className={`text-white  px-4 py-2 rounded-[8px]  duration-200 ${
            isSaveDisabled
              ? "bg-[#626ed4] opacity-40 cursor-not-allowed"
              : "bg-[#626ed4] hover:bg-[#535eb4]"
          }`}
          onClick={handleSave}
        >
          Save topic
        </Button>
      </div>
    </Fragment>
  );
}

export default CreateKeyword;
