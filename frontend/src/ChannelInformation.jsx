/* eslint-disable react/prop-types */
import { useChannelStateContext } from "stream-chat-react";
import { useState } from "react";
import ReactLoading from "react-loading";
import uploadCloudinary from "./utils/uploadCloudinary.js";
import InputMembers from "./Component/InputMembers.jsx";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  addMembersToChannel,
  updateimageChannel,
} from "./Functions/ChannelEdit.jsx";

export default function ChannelInfo({ close, user, data, reloadheader }) {
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

  // Add members
  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      return setAdding(false);
    } else {
      await addMembersToChannel(channel, selectedMembers);
      setAdding(false);
    }
  };
  // Check if the current user is the owner
  const isOwner = channelMembers.find((m) => m.role === "owner");
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 flex items-center justify-center bg-black opacity-65 text-transparent">
        hello
      </div>
      <div className="bg-gray-950 bg-opacity-90 text-white p-2 rounded shadow-lg border-2 w-fit border-opacity-50 border-white z-50 overflow-y-scroll hidden-scrollbar relative h-fit">
        <div className="h-fit relative ">
          <div className="h-0 sticky top-2 z-50 flex items-center justify-end">
            <button
              onClick={() => close()}
              className="text-red-600 text-lg bg-white border-black border rounded"
            >
              <IoCloseCircleOutline />
            </button>
          </div>
          <div className="text-xl flex flex-col items-center justify-center py-2 px-20 font-bold font-mono text-gray-100 mb-3 border rounded-xl bg-black bg-opacity-40">
            {channel?.data?.name}
            <h1 className="text-xs border p-[2px] rounded-lg bg-black">
              Type: {channel.data.type === "team" ? "Public" : "Private"}
            </h1>
          </div>
          <div
            className={`${
              isOwner?.user_id === user
                ? "h-[560px] overflow-y-scroll hidden-scrollbar"
                : "h-fit"
            }`}
          >
            <div className="w-[200px] h-[260px] flex items-center justify-center mx-auto overflow-clip border rounded">
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
                            <div className="relative w-full h-10 mx-auto">
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
                                <h1 className="w-full  opacity-80">
                                  Change Image
                                </h1>
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

            <div className="flex flex-col w-full h-fit">
              <h1 className="font-semibold">Members:</h1>
              <div className="flex flex-col w-full h-[190px] items-center justify-center m-auto">
                {currentMembers &&
                  currentMembers.map((m) => (
                    <div
                      key={m.user_id}
                      className="w-full border rounded-xl bg-black bg-opacity-90 px-2 py-1 flex items-center justify-between my-1"
                    >
                      <div className="flex gap-2 items-center">
                        <div>
                          <img
                            src={
                              m.user.image
                                ? m.user.image
                                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQttE9sxpEu1EoZgU2lUF_HtygNLCaz2rZYHg&s"
                            }
                            alt="User_image"
                            width={30}
                            height={30}
                            className="w-30 h-fit object-cover rounded-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h1>{m.user.name}</h1>
                          <div className="flex flex-wrap text-[10px] items-center justify-between w-full">
                            <div>
                              {m.role === "owner" && (
                                <h6 className="text-white font-mono font-light bg-green-700 rounded-lg px-1">
                                  admin
                                </h6>
                              )}
                            </div>
                            <h6>~{m.user.username}</h6>
                          </div>
                        </div>
                      </div>
                      {m.user_id === user ? (
                        "(Yourself)"
                      ) : (
                        <h1>{m.user.online ? "(Online)" : "(Offline)"}</h1>
                      )}
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
                  {adding ? (
                    <button
                      className="w-full bg-green-500 p-2 rounded"
                      onClick={handleAddMembers}
                    >
                      Saving
                    </button>
                  ) : (
                    <button
                      className="w-full bg-green-500 p-2 rounded"
                      onClick={() => setAdding(true)}
                    >
                      Add Members
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
