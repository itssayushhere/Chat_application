/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { FaMessage } from "react-icons/fa6";
import CustomMessageInput from "./CustomComponent/CustomMessageInput.jsx"; // Import the CustomMessageInput
import ChannelInfo from "./ChannelInformation";
import "./App.css";
import { AuthContext } from "./Context/AuthContext.jsx";
import ReactLoading from "react-loading";
import Night from "./assets/image/night.png";
import JoinChannel from "./Functions/JoinChannel.jsx";
import { MdAddCircleOutline } from "react-icons/md";
import ClientAddChanel from "./Functions/ClientAddChanel.jsx";
const App = () => {
  ////context variable and action
  const { state, dispatch } = useContext(AuthContext);
  ////Variable for creating or joining client
  const apiKey = import.meta.env.VITE_STREAM_APIKEY;
  const userId = state?.userData?.id;
  const token = state?.token;
  ////Channel filters options and sort
  const filters = { members: { $in: [userId] } };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 };
  ////useStates for handling various things
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("messaging dark");
  const [joinChannel, setJoinChannel] = useState(false);
  //// Create or Login client with useCreateChatClient
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: state.userData,
  });
  ////useEffect for fetching user in the api
  const [channels, setChannels] = useState([]);
  const [connecting,setConnecting] = useState(true)
  const [alluser,setAlluser] = useState([])
  useEffect(() => {
    async function getAllUsers() {
      try {
        const channel = await client.queryChannels({ members: { $in: [userId] } });
        const user = await client.queryUsers({})
        setChannels(channel);
        setAlluser(user.users)
        setConnecting(false)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    if (client) {
      getAllUsers();
    }
  }, [client]);
  ////load total channels user logged in
  if (!client || connecting )
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black">
        <ReactLoading color="white" />
      </div>
    );
  ////HandleLogout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  ////CustomListContainer
  const CustomListContainer = (props) => {
    return (
      <div className=" w-full h-full flex flex-col items-center justify-between ">
        <div>
          <header
            className={`flex p-2 px-10 shadow-md border-2 border-black rounded-md mx-1 my-2 text-white  bg-blue-600 font-mono font-bold shadow-black`}
          >
            <div className="flex items-center space-x-2">
              <FaMessage className="text-2xl text-blue-200 animate-pulse" />
              <h1 className="text-xl font-semibold animate-pulse">
                StreamLine
              </h1>
            </div>
          </header>
          <div>{props.children}</div>
          <div className="p-2 flex flex-col items-center justify-center text-2xl">
            <button type="button" onClick={() => setJoinChannel(true)}>
              <MdAddCircleOutline />
            </button>
          </div>
        </div>
        <div className="w-full flex items-center justify-between p-2 py-3">
          <button
            className={`p-2 text-xs border-2 border-black font-bold font-mono rounded-lg bg-blue-600 text-white shadow-sm shadow-black`}
            onClick={handleLogout}
          >
            LOGOUT
          </button>
          <button
            className="text-2xl rounded"
            onClick={() =>
              setTheme(
                theme === "messaging light"
                  ? "messaging dark"
                  : "messaging light"
              )
            }
            >
            {theme === "messaging light" ? (
              <img src={Night} alt="moon" width={30} />
            ) : (
              "☀️"
            )}
          </button>
        </div>
      </div>
    );
  };
  ////Return or Render
  return (
    <Chat client={client} theme={theme}>
      <div className="flex flex-grow">
        { !connecting && channels.length !== 0 && (
          <aside className=" hidden-scrollbar border-r border-gray-700 bg-gray-800">
            <div className="h-full overflow-auto hidden-scrollbar">
              <ChannelList
                sort={sort}
                filters={filters}
                options={options}
                List={CustomListContainer}
              />
            </div>
          </aside>
        )}
        <main className="w-full  h-full flex flex-col overflow-hidden relative">
          { channels.length === 0 ? (
            <div
              className={`${
                theme === "messaging light" ? "bg-white" : "bg-black"
              } w-full flex flex-col justify-center items-center relative`}
            >
              <header
                className={`flex items-center justify-between shadow-md border-2 border-black text-white bg-blue-600 font-mono font-bold shadow-black m-3 w-full fixed top-0 px-4 py-2`}
              >
                <div className="flex items-center space-x-4">
                  <FaMessage className="text-2xl text-blue-200 animate-pulse" />
                  <h1 className="text-xl font-semibold animate-pulse">
                    StreamLine
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className={`p-2 text-xs border-2 border-black font-bold font-mono rounded-lg bg-blue-600 text-white shadow-sm shadow-black`}
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </button>
                  <button
                    className="text-2xl rounded"
                    onClick={() =>
                      setTheme(
                        theme === "messaging light"
                          ? "messaging dark"
                          : "messaging light"
                      )
                    }
                  >
                    {theme === "messaging light" ? (
                      <img src={Night} alt="moon" width={30} />
                    ) : (
                      "☀️"
                    )}
                  </button>
                </div>
              </header>

              <div
                className={`flex justify-center items-center min-h-screen ${
                  theme === "messaging light" ? "bg-white" : "bg-black"
                }`}
                style={{ paddingTop: "80px" }} 
              >
                <div>
                  <h1
                    className={`${
                      theme === "messaging light" ? "text-black" : "text-white"
                    } p-3`}
                  >
                    No, Channels right now.
                  </h1>
                  <div className="flex flex-col gap-2">
                    <button
                      className="p-4 bg-blue-600 text-white rounded-lg"
                      onClick={() => console.log("Create a new channel")}
                    >
                      Create a New Channel
                    </button>
                    <button
                      className="p-4 bg-green-500 text-white rounded-lg"
                      onClick={() => setJoinChannel(true)}
                    >
                      Join Channel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Channel enrichURLForPreview>
              <Window>
                <div className="flex items-center justify-between relative">
                  <div className="w-full flex relative">
                    <button
                      className="absolute left-[52px] top-2 z-50 bg-transparent text-transparent py-4 px-24"
                      onClick={() => setOpen(open === true ? false : true)}
                    >
                      Hello
                    </button>
                    <div className="w-full ">
                      <ChannelHeader />
                    </div>
                  </div>
                </div>
                {open && (
                  <ChannelInfo
                    close={() => setOpen(false)}
                    user={client?.user?.id}
                    data = {alluser}
                  />
                )}
                <div className="flex-grow overflow-auto hidden-scrollbar">
                  <MessageList />
                </div>
                <div
                  className={`border-t border-gray-700 ${
                    theme === "messaging dark" ? "bg-gray-950" : " bg-slate-100"
                  }  sticky bottom-0 w-full  `}
                >
                  <MessageInput
                    Input={() => <CustomMessageInput theme={theme} />}
                  />
                </div>
              </Window>
              <Thread />
            </Channel>
          )}
          {channels.length === 0
            ? joinChannel && (
                <JoinChannel
                  close={() => setJoinChannel(false)}
                  client={client}
                />
              )
            : joinChannel && (
              <div className="absoulte inset-0 z-50">
              <ClientAddChanel  close={()=>setJoinChannel(false)}/>
              </div>
            )}
        </main>
      </div>
    </Chat>
  );
};

export default App;
