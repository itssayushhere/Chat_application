/* eslint-disable react/prop-types */
import { useChannelStateContext, useMessageContext } from "stream-chat-react";
import { useState } from "react";
import ReactLoading from "react-loading";
import uploadCloudinary from "./utils/uploadCloudinary.js";
import InputMembers from "./Component/InputMembers.jsx";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  addMembersToChannel,
  updateimageChannel,
} from "./Functions/ChannelEdit.jsx";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown, Space } from "antd";
export default function ChannelInfo({ close, user, data }) {
  const { channel } = useChannelStateContext();
  const channelMembers = Object.values(channel?.state?.members || {});
  // Finding who's not members and add to members functions
  const newdata = channelMembers.map((item) => item.user.id);
  const notmembers = data.filter((item) => !newdata.includes(item.id));
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [adding, setAdding] = useState(false);
  // Handle Image
  const [imageLoading, setImageLoading] = useState(false);
  const handleImage = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    const data = await uploadCloudinary(file);
    await updateimageChannel(channel, data.url);
    setImageLoading(false);
  };

  // Handle Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 3;
  const totalPage = Math.ceil(channelMembers.length / membersPerPage);
  const currentMembers = channelMembers.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  );
  const addToCurrentPage = () => {
    if (currentPage !== totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  ////Kickout Members
  const [removing, setRemoving] = useState(false);
  const handleKickoutMembers = async (kickingout) => {
    const result = window.confirm("Are You Really Sure?");
    try {
      if (result) {
        await channel.removeMembers([kickingout]);
        alert("successfull");
      } else {
        return null;
      }
    } catch (error) {
      alert("Unsuccessfull", error);
    }
  };

  const avatar = (username) => {
    // Trim any extra spaces and split the username
    const split = username.trim().split(" ");

    // Extract initials
    let name;
    if (split.length === 1) {
      name = split[0][0].toUpperCase();
    } else {
      const [firstName, lastName] = split;
      name = firstName[0].toUpperCase() + lastName[0].toUpperCase();
    }

    return (
      <div className="w-9 h-9 border border-black flex items-center justify-center rounded-full bg-blue-900">
        {name}
      </div>
    );
  };

  // Add members
  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      return setAdding(false);
    } else {
      await addMembersToChannel(channel, selectedMembers);
      setAdding(false);
    }
  };
  const handleleaveChannel = async () => {
    const result = window.confirm("Are You Really Sure?");
    try {
      if (result) {
        await channel.removeMembers([user]);
        console.log("successfull");
        window.location.reload();
      } else {
        return null;
      }
    } catch (error) {
      console.log("Unsuccessfull", error);
    }
  };

  const isOwner = channelMembers.find((m) => m.role === "owner");
  const deleteChannel = async (channelId) => {
    if (isOwner.user_id !== user) {
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this channel Because this action is not reversible?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/channel/delete/${channelId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Channel deleted successfully");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete channel: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Error deleting channel:", err);
      alert("An error occurred while trying to delete the channel");
    }
  };
  // Check if the current user is the owner

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handlePopup = () => {
    return (
      <div>
        {isOwner?.user_id !== user && (
          <button
            className="w-full bg-red-600 p-2 text-white rounded"
            onClick={() => {
              handleleaveChannel();
              setDropdownVisible(false); // Close the dropdown
            }}
          >
            Leave
          </button>
        )}
        {isOwner?.user_id === user && (
          <div className="flex flex-col p-1 bg-black rounded">
            <button
              className="w-fit bg-gray-600 p-2 text-white rounded mb-2 mx-auto"
              onClick={() => {
                deleteChannel(channel?.data?.id);
                setDropdownVisible(false); 
              }}
            >
              Delete Channel🗑️
            </button>
            <button
              className="w-fit p-2 text-white rounded bg-red-600 mx-auto"
              onClick={() => {
                setRemoving(true);
                setDropdownVisible(false); 
              }}
            >
              KickOut Members
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 flex items-center justify-center bg-black opacity-65 text-transparent">
        hello
      </div>
      <div className="bg-gray-950 bg-opacity-90 text-white p-2 rounded-xl shadow-lg border-2 shadow-black w-full border-opacity-10 border-white z-50 overflow-y-scroll hidden-scrollbar relative h-fit  max-w-sm ">
        <div className="h-fit">
          <div className="text-xl flex flex-row items-center justify-between py-2 px-4 font-bold font-mono text-white mb-3  rounded-xl bg-blue-500  text-center ">
            <Dropdown
              trigger={["click"]}
              open={dropdownVisible}
              onOpenChange={(flag) => setDropdownVisible(flag)}
              dropdownRender={handlePopup}
            >
              <button onClick={(e) => e.preventDefault()}>
                <Space>
                  <BsThreeDotsVertical className="text-black" />
                </Space>
              </button>
            </Dropdown>
            <div className="flex flex-col">
              <h1 className="text-center font-bold font-mono text-black">
                {channel?.data?.name}
              </h1>
              <h1 className="text-xs p-[2px]">
                {channel.data.type === "team"
                  ? "Public Channel"
                  : "Private Channel"}
              </h1>
            </div>
            <button
              onClick={() => close()}
              className="text-red-700 font-extrabold text-2xl "
            >
              <IoCloseCircleOutline />
            </button>
          </div>
          <div
            className={`${
              isOwner?.user_id === user
                ? "h-[530px]   overflow-y-scroll hidden-scrollbar"
                : "h-fit"
            }`}
          >
            <div className="w-[200px] h-[240px] flex items-center justify-center mx-auto overflow-clip bg-black rounded-lg">
              <div>
                {channel.data.image ? (
                  <div>
                    {imageLoading ? (
                      <ReactLoading color="blue" />
                    ) : (
                      <div className="w-full flex flex-col">
                        <img
                          src={channel?.data?.image}
                          alt="Channel Image"
                          className="w-full h-[200px] object-cover mx-auto border rounded-xl border-black border-opacity-80"
                        />
                        <div>
                          {isOwner?.user_id === user && (
                            <div className="relative w-full h-7 mx-auto">
                              <input
                                type="file"
                                name="photo"
                                id="customFile"
                                onChange={handleImage}
                                accept="image/*"
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <label
                                htmlFor="customFile"
                                className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 bg-gray-900 bg-opacity-70 text-headingColor font-semibold rounded-lg text-center cursor-pointer justify-center"
                              >
                                <h1 className="w-full  opacity-80">Change</h1>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full ">
                    {isOwner?.user_id === user ? (
                      <div>
                        {imageLoading ? (
                          <ReactLoading color="blue" />
                        ) : (
                          <div className="flex items-center gap-2 justify-center w-full flex-col">
                            <div className="relative w-[200px] h-[260px]">
                              <input
                                type="file"
                                name="photo"
                                id="customFile"
                                onChange={handleImage}
                                accept="image/*"
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <label
                                htmlFor="customFile"
                                className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 bg-gray-900 bg-opacity-70 text-headingColor font-semibold text-center rounded-lg cursor-pointer justify-center"
                              >
                                <h1 className="w-fit p-2 opacity-80">
                                  Upload Channel Image
                                </h1>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div> No Channel Photo </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <h1 className=" italic font-mono font-normal opacity-80">
                Description:
              </h1>
              <h1 className="text-wrap italic font-mono font-normal opacity-80">
                {channel?.data?.description || "No Description"}
              </h1>
            </div>
            <div className="flex flex-col w-full h-fit">
              <h1 className="font-semibold">Members:</h1>
              <div className="flex flex-col w-full h-[190px] items-center justify-center m-auto">
                {currentMembers &&
                  currentMembers.map((m) => (
                    <div
                      key={m.user_id}
                      className="w-full  rounded-xl bg-black bg-opacity-90 px-2 py-1 flex items-center justify-between my-1"
                    >
                      <div className="flex gap-2 items-center">
                        <div>
                          {m.user.image && (
                            <img
                              src={m.user.image}
                              alt="User_image"
                              width={30}
                              height={30}
                              className="w-30 h-30 object-cover overflow-hidden rounded-lg"
                            />
                          )}
                          {!m.user.image && avatar(m.user.username)}
                        </div>
                        <div className="flex flex-col ">
                          <h1 className="w-44 text-sm">{m?.user?.username}</h1>
                          <div className="flex flex-wrap text-[10px] items-center justify-between w-full">
                            <h6 className="ml-3">~{m.user.name}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="flex  items-center">
                        <div>
                          {m.role === "owner" && (
                            <h6 className="text-white font-mono font-light bg-green-700 rounded-lg px-1 text-xs">
                              admin
                            </h6>
                          )}
                        </div>
                        <div>
                          {m.role !== "owner" && removing && (
                            <button
                              type="button"
                              className="text-white px-2 rounded-lg bg-red-600"
                              onClick={() => handleKickoutMembers(m.user_id)}
                            >
                              Kick
                            </button>
                          )}
                        </div>
                        <div className="px-2">
                          {m.user_id === user ? (
                            "You"
                          ) : (
                            <h1>{m.user.online ? "🟢" : " ⚪️"}</h1>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {totalPage !== 0 && totalPage !== 1 && (
                <div className="flex items-center justify-between">
                  <div>
                    {currentPage !== 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-5 bg-black rounded-lg border-white border-opacity-70 ml-2 border"
                      >
                        {"<-"}
                      </button>
                    )}
                  </div>
                  {currentPage !== totalPage && (
                    <button
                      type="button"
                      onClick={addToCurrentPage}
                      className="px-5 bg-black rounded-lg border-white border-opacity-70 mr-2 border"
                    >
                      {"->"}
                    </button>
                  )}
                </div>
              )}
            </div>
            {isOwner?.user_id === user && (
              <div>
                {adding && (
                  <InputMembers
                    allUsers={notmembers}
                    selectedMembers={selectedMembers}
                    setSelectedMembers={setSelectedMembers}
                  />
                )}
                <div className="mt-2 flex items-center gap-2">
                  {!removing && adding ? (
                    <button
                      className="w-full bg-blue-500 p-2 rounded text-black font-bold"
                      onClick={handleAddMembers}
                    >
                      Save
                    </button>
                  ) : (
                    !removing && (
                      <button
                        className="w-full bg-green-500 p-2 rounded text-black font-bold"
                        onClick={() => setAdding(true)}
                      >
                        Add Members
                      </button>
                    )
                  )}
                  {removing && (
                    <button
                      type="button"
                      className="w-full bg-blue-500 p-2 rounded text-black font-bold"
                      onClick={() => setRemoving(false)}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
