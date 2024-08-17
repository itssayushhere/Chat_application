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
  const [channels, setChannels] = useState([]);
  //// Create or Login client with useCreateChatClient
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: state.userData,
  });
  ////useEffect for fetching user in the api
  useEffect(() => {
    async function getAllUsers() {
      try {
        const users = await client.queryUsers({});
        console.log(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    if (client) {
      getAllUsers();
    }
  }, [client]);
  ////load total channels user logged in
  const handleChannelLoaded = (loadedChannels) => {
    setChannels(loadedChannels);
  };

  if (!client) return <div>Loading...</div>;
  ////HandleLogout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <Chat client={client} theme={theme}>
      <header
        className={`p-4 sm:py-[15px] rounded border-2 border-white border-opacity-55 sm:flex hidden font-mono font-bold items-center justify-between ${
          theme === "messaging light"
            ? "bg-white text-black"
            : "bg-[#353534] text-white"
        }`}
      >
        <div className="flex items-center space-x-2">
          <FaMessage className="text-2xl text-blue-600" />
          <h1 className="text-xl font-semibold animate-pulse">StreamLine</h1>
          <button
            className="p-2 text-xs border font-bold font-mono rounded-lg"
            onClick={handleLogout}
          >
            LOGOUT
          </button>
        </div>
        <button
          className="text-2xl rounded"
          onClick={() =>
            setTheme(
              theme === "messaging light" ? "messaging dark" : "messaging light"
            )
          }
        >
          {theme === "messaging light" ? "🌙" : "☀️"}
        </button>
      </header>
      <div className="flex">
        <aside className="sm:h-[710px] hidden-scrollbar border-r border-gray-700 bg-gray-800">
          <div className="h-full overflow-auto hidden-scrollbar">
            <ChannelList
              sort={sort}
              filters={filters}
              options={options}
              onChannelLoaded={handleChannelLoaded}
            />
          </div>
        </aside>
        <main className="w-full h-full sm:h-[710px] overflow-hidden flex flex-col relative">
          {channels.length === 0 ? ( 
            <div className="flex justify-center items-center min-h-screen bg-black">
              <div>
                <h1 className="text-white p-3">No, Channels right now. </h1>
                <div className="flex flex-col gap-2">
                  <button
                    className="p-4 bg-blue-600 text-white rounded-lg"
                    onClick={() => console.log("Create a new channel")}
                  >
                    Create a New Channel
                  </button>
                  <button className="p-4 bg-green-500 text-white rounded-lg">
                    Join new Channel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Channel enrichURLForPreview>
              <Window>
                <div className="flex items-center justify-between relative">
                  <div className="absolute z-50 right-5 sm:hidden">
                    <button
                      className={`text-2xl rounded ${
                        theme === "messaging light" ? "" : ""
                      }`}
                      onClick={() =>
                        setTheme(
                          theme === "messaging light"
                            ? "messaging dark"
                            : "messaging light"
                        )
                      }
                    >
                      {theme === "messaging light" ? "🌙" : "☀️"}
                    </button>
                  </div>
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
                  />
                )}
                <div className="sm:h-[575px] h-[550px] overflow-auto hidden-scrollbar">
                  <MessageList />
                </div>
                <div
                  className={`border-t border-gray-700 ${
                    theme === "messaging dark" ? "bg-gray-950" : " bg-slate-100"
                  }  absolute bottom-0 w-full  z-50`}
                >
                  <MessageInput
                    Input={() => <CustomMessageInput theme={theme} />}
                  />
                </div>
              </Window>
              <Thread />
            </Channel>
          )}
        </main>
      </div>
    </Chat>
  );
};

export default App;
