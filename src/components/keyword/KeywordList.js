import React, { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import { SyncLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import Button from "../button/Button";
import Input from "../input/Input";
// import debounce from "lodash.debounce";
import { setClickedKeyword } from "../../redux/api/clickedKeyword/getClickedActions";
import {
  // useGetUserCompanyQuery,
  useGetTopicsQuery,
  useDeleteTopicsMutation,
  // useGetSearchQuery,
} from "../../redux/api/keywords";
const KeywordList = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  // const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  // const { data: searchData } = useGetSearchQuery({ query: debouncedSearchQuery });
  // useEffect(() => {
  //   const delayedSearchQuery = debounce((query) => setDebouncedSearchQuery(query), 500);
  //   delayedSearchQuery(searchQuery);
  //   return () => delayedSearchQuery.cancel();
  // }, [searchQuery]);

  const location = useLocation();
  const [deleteKeyword] = useDeleteTopicsMutation();
  // const { data: userCompanyId } = useGetUserCompanyQuery();
  const { data: getTopics, refetch: refetchTopicsList } = useGetTopicsQuery();
  const keywordRedux = getTopics && getTopics.data;
  const navigate = useNavigate();
  const [buttonLoadingState, setButtonLoadingState] = useState({});
  const handleEditClick = (keywordList) => {
    if (
      keywordList.hasOwnProperty("id") &&
      keywordList.hasOwnProperty("keyword")
    ) {
      const keywordId = keywordList.id;

      navigate("/edit-keywords", { state: { keywordId, keywordList } });
    } else {
      console.error("Keyword ID not found in keywordList");
    }
  };
  useEffect(() => {
    if (location.state && location.state.refetch) {
      refetchTopicsList();
    }
  }, [location.state, refetchTopicsList]);
  // const userId = Cookies.get("user");
  // const userDataId = userId ? JSON.parse(userId).id : null;
  // const tokenCookies = JSON.parse(Cookies.get("token"));
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(false);

  const [visibleKeywords, setVisibleKeywords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(currentPage);

  const itemsPerPage = 10;

  const filteredKeywords =
    visibleKeywords &&
    visibleKeywords.filter((keyword) => {
      const lowercaseSearchQuery = searchQuery.toLowerCase();
      const lowercaseKeywords = keyword.keyword.toLowerCase();
      return (
        (keyword.title &&
          keyword.title.toLowerCase().includes(lowercaseSearchQuery)) ||
        lowercaseKeywords.includes(lowercaseSearchQuery)
      );
    });

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSettingsClick = (keywordId) => {
    if (keywordId) {
      sessionStorage.setItem("keywordId", keywordId);
      navigate("/settings-keyword");
    } else {
      console.error("Keyword ID is not defined");
    }
  };

  const handleSearchClick = async (clickedKeyword) => {
    const selectedDatesString = Cookies.get("selectedDates");
    const selectedDates = selectedDatesString
      ? JSON.parse(selectedDatesString)
      : null;
    if (!selectedDates || selectedDates.length !== 2) {
      toast.error("Select a time range.");

      return;
    }
    if (clickedKeyword && clickedKeyword.keyword) {
      setIsSearchButtonDisabled(true);
      setButtonLoadingState({ [clickedKeyword.id]: true });
      try {
        const keywordId = clickedKeyword && clickedKeyword.id;
        sessionStorage.setItem("keywordId", keywordId);
        navigate("/result-keyword", {
          state: {
            // keywordId,
            keyword: clickedKeyword.title,
          },
        });
        // const [response, response1, response2] = await Promise.all([
        // ]);
        // const data = response.payload;
        // const data1 = response1.payload;
        // const dataSource = response2.payload;
        // navigate("/result-keyword", {
        //   state: {
        //     data,
        //     data1,
        //     dataSource,
        //     keywordId,
        //     keyword: clickedKeyword.title,
        //   },
        // });
      } catch (error) {
        console.error("An error occurred while searching: ", error);
      } finally {
        setButtonLoadingState({ [clickedKeyword.id]: false });
        setIsSearchButtonDisabled(false);
      }
    } else {
      console.error(
        "clickedKeyword is not defined or does not have a 'keyword' property"
      );
    }
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setVisibleKeywords(
      keywordRedux && keywordRedux.slice(startIndex, endIndex)
    );
  }, [keywordRedux, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(
    keywordRedux && keywordRedux.length / itemsPerPage
  );

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [keywordToDelete, setKeywordToDelete] = useState(null);
  const openDeleteConfirmation = (id) => {
    setKeywordToDelete(id);
    setDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setKeywordToDelete(null);
    setDeleteConfirmation(false);
  };

  const handleDeleteClick = async (id) => {
    openDeleteConfirmation(id);
  };
  const writeLastKeywordIdToSessionStorage = () => {
    const lastKeywordIndex = keywordRedux && keywordRedux.length - 1;
    if (lastKeywordIndex >= 0) {
      const lastKeywordId = keywordRedux && keywordRedux[lastKeywordIndex].id;
      dispatch(setClickedKeyword(lastKeywordId));
      sessionStorage.setItem("keywordId", lastKeywordId);
    }
  };
  const confirmDelete = async () => {
    if (keywordToDelete) {
      try {
        const response = await deleteKeyword({
          id: keywordToDelete,
        });
        if (response.data.status === true) {
          toast.success(response.data.data);
          sessionStorage.removeItem("keywordId");
          writeLastKeywordIdToSessionStorage();
          refetchTopicsList();
        } else {
          toast.error("Failed attempt");
        }
        closeDeleteConfirmation();
      } catch (error) {
        console.error("An error occurred while deleting:", error);
      }
    }
  };
  const tableHeaders = [
    { title: "Index", colSpan: 1 },
    { title: "Title", colSpan: 2 },
    { title: "Topics", colSpan: 4 },
    { title: "Created time", colSpan: 2 },
    { title: "Actions", colSpan: 2 },
    { title: "Search", colSpan: 1 },
  ];

  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Topics list</title>
      </Helmet>
      <div className="pb-4 max-md:pb-0 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <NavLink
            className="rounded-[8px] bg-[#626ed4] hover:bg-[#535eb4]  text-white duration-200 px-4 py-2"
            to="/create-keywords"
          >
            Add topic
          </NavLink>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
        <div className=" relative flex items-center max-md:w-full">
          <Input
            type="text"
            placeholder="Search keywords"
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="border-[1px] p-2 rounded-[4px] text-white border-[#6e727d] outline-none bg-[#36394c] max-md:w-full"
          />
          <div className="absolute  right-2 text-[#6e727d]">
            {" "}
            <FaSearch />
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-12 border-[1px] text-[#adb5bd] border-[#6e727d] max-md:hidden ">
          {tableHeaders.map((header, index) => (
            <p
              key={index}
              className={`col-span-${header.colSpan} p-2 font-bold border-r-[1px] border-[#6e727d] text-center`}
            >
              {header.title}
            </p>
          ))}
        </div>
        {filteredKeywords &&
          filteredKeywords.map((keywordList, index) => (
            <div
              key={index}
              className="grid grid-cols-12 bg-[#36394c] text-white gap-4 my-4 py-3 px-3 border-[1px] items-center border-[#6e727d]  rounded-[8px] max-md:block"
            >
              <p className="col-span-1 text-[20px]">{index + 1}.</p>
              <p className="col-span-2 max-md:text-center">
                {keywordList.title}
              </p>
              <div className="col-span-4 max-md:py-2">
                {keywordList.keyword.split(" AND ").map((keywordGroup, i) => {
                  return (
                    <span key={i}>
                      {i > 0 && " AND "}
                      <span>
                        {keywordGroup.split(" OR ").map((keyword, j) => {
                          return (
                            <span key={j}>
                              {j > 0 && " OR "}
                              <span>{`${keyword}`}</span>
                            </span>
                          );
                        })}
                      </span>
                    </span>
                  );
                })}
              </div>
              <p className="col-span-2 max-md:pb-2 text-center max-md:text-left">
                {keywordList.created_at}
              </p>
              <div className="col-span-2 flex justify-center gap-4 max-md:hidden">
                <Button
                  className="bg-[#626ed4] hover:bg-[#535eb4]  col-span-1 flex justify-center items-center   text-white px-4 rounded-[8px] duration-200 py-3"
                  onClick={() => handleSettingsClick(keywordList.id)}
                >
                  <IoSettings />
                </Button>

                <Button
                  onClick={() => handleEditClick(keywordList)}
                  className="bg-[#626ed4] hover:bg-[#535eb4]col-span-1 flex justify-center items-center text-white px-4 rounded-[8px] duration-200 py-3"
                >
                  <FaEdit />
                </Button>
                <Button
                  onClick={() => handleDeleteClick(keywordList.id)}
                  className="bg-[#626ed4] hover:bg-[#535eb4] col-span-1 flex justify-center items-center text-white px-4 rounded-[8px] duration-200 py-3"
                >
                  <FaTrash />
                </Button>
              </div>
              <div className="col-span-1 flex justify-center max-md:hidden">
                {buttonLoadingState[keywordList.id] ? (
                  <div className="flex justify-center items-center">
                    <SyncLoader color="#41d3fa" size={8} />
                  </div>
                ) : (
                  <Button
                    onClick={() => handleSearchClick(keywordList)}
                    disabled={isSearchButtonDisabled}
                    className={`bg-[#41d3fa] col-span-1 flex justify-center items-center hover:bg-[#41BAFA] text-white px-4 rounded-[8px] duration-200 py-3 ${
                      isSearchButtonDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {" "}
                    {buttonLoadingState[keywordList.id] ? (
                      <SyncLoader color="#41d3fa" size={8} />
                    ) : (
                      <FaSearch />
                    )}
                  </Button>
                )}
              </div>
              <div className="max-md:flex max-md:justify-between hidden">
                <div className="col-span-2 flex justify-center gap-4">
                  <Button
                    className="bg-[#626ed4] hover:bg-[#535eb4]  col-span-1 flex justify-center items-center   text-white px-4 rounded-[8px] duration-200 py-3"
                    onClick={() => handleSettingsClick(keywordList.id)}
                  >
                    <IoSettings />
                  </Button>

                  <Button
                    onClick={() => handleEditClick(keywordList)}
                    className="bg-[#626ed4] hover:bg-[#535eb4]col-span-1 flex justify-center items-center text-white px-4 rounded-[8px] duration-200 py-3"
                  >
                    <FaEdit />
                  </Button>

                  <Button
                    onClick={() => handleDeleteClick(keywordList.id)}
                    className="bg-[#626ed4] hover:bg-[#535eb4] col-span-1 flex justify-center items-center text-white px-4 rounded-[8px] duration-200 py-3"
                  >
                    <FaTrash />
                  </Button>
                </div>
                <div className="col-span-1 flex justify-center">
                  {buttonLoadingState[keywordList.id] ? (
                    <div className="flex justify-center items-center">
                      <SyncLoader color="#41d3fa" size={8} />
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSearchClick(keywordList)}
                      disabled={isSearchButtonDisabled}
                      className={`bg-[#41d3fa] col-span-1 flex justify-center items-center hover:bg-[#41BAFA] text-white px-4 rounded-[8px] duration-200 py-3 ${
                        isSearchButtonDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <FaSearch />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      {deleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay"></div>
          <div className="modal-container bg-[#1a1f2e] border-[1px] border-[#6e727d] text-white w-1/2 p-6 rounded-lg shadow-lg max-md:w-[95%]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4 ">Confirm delete</h2>
            </div>
            <p>Are you sure you want to delete this keyword?</p>
            <div className="mt-4 flex justify-end">
              <Button
                className="bg-[#626ed4] hover:bg-[#535eb4] px-4 py-1 duration-200 text-white rounded-[8px] mr-4"
                onClick={closeDeleteConfirmation}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-1 bg-[#626ed4] hover:bg-[#535eb4] duration-200 text-white rounded-[8px]"
                onClick={confirmDelete}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end items-center gap-3 pt-3 max-md:justify-center">
        {Array.from({ length: totalPages }, (v, i) => (
          <Button
            key={i}
            onClick={() => {
              setCurrentPage(i + 1);
              setActivePage(i + 1);
            }}
            className={`px-4 py-2 hover:bg-black text-white  rounded-[8px] border-[1px] border-[#6e727d] duration-200 ${
              activePage === i + 1 ? "bg-black text-white" : ""
            }`}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </Fragment>
  );
};

export default KeywordList;
