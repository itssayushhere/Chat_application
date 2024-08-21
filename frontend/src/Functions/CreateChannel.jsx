/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";
import uploadCloudinary from "../utils/uploadCloudinary";
import ReactLoading from "react-loading";
import InputMembers from "../Component/InputMembers"; // Import the InputMembers component

const CreateChannel = ({ client, userId, close }) => {
  const [channelName, setChannelName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [fetchChannel, setFetchChannel] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [channelType, setChannelType] = useState("messaging");

  // Create Channel Function
  const createChannel = async () => {
    const channel = client.channel(
      channelType,
      `${userId}_${channelType}_${fetchChannel.length + 1}`,
      {
        name: channelName,
        members: [...selectedMembers, userId],
        image: image ? image : "",
        description: description ? description : "",
      }
    );
    await channel.create();
    window.location.reload();
    close();
  };

  // Effect Hook for Fetching Users
  useEffect(() => {
    async function getAllUsers() {
      try {
        const { users } = await client.queryUsers({});
        const user = users.filter((item) => item.id !== userId);
        const channel = await client.queryChannels({
          members: { $in: [userId] },
        });
        setFetchChannel(channel);
        setAllUsers(user);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    if (client) {
      getAllUsers();
    }
  }, [client]);

  // Handle Image Upload
  const handleImage = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    const data = await uploadCloudinary(file);
    setImage(data.url);
    setImageLoading(false);
  };

  // Component Render
  return (
    <div className="p-4 bg-white shadow-lg rounded-md z-50 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create a New Channel</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Channel Name
        </label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="Enter channel name"
        />
      </div>

      {/* Render InputMembers Component */}
      <InputMembers
        allUsers={allUsers}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Channel Description
        </label>
        <textarea
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter channel description"
        />
      </div>

      <div className="mb-4 flex items-center">
        <label className="block text-sm font-medium text-gray-700">
          Channel Type
        </label>
        <select
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={channelType}
          onChange={(e) => setChannelType(e.target.value)}
        >
          <option value="messaging">Private</option>
          <option value="team">Public</option>
        </select>
      </div>

      <div className="flex flex-row items-center justify-center w-full mb-2">
        {imageLoading ? (
          <ReactLoading color="blue" />
        ) : (
          <div className="flex items-center gap-2 justify-center w-full flex-col">
            {image && (
              <img
                src={image}
                width={50}
                height={50}
                alt="Uploaded"
                className="object-cover rounded-full overflow-hidden w-10 border-2 h-10 border-blue-800"
              />
            )}
            <div className="relative w-[290px] h-[30px]">
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
                className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[14px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer justify-center"
              >
                Choose Channel Photo
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full gap-2">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full"
          onClick={() => close()}
        >
          Cancel
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
          onClick={createChannel}
        >
          Create Channel
        </button>
      </div>
    </div>
  );
};

export default CreateChannel;
