import { useEffect, useState } from "react";
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

const apiKey = import.meta.env.VITE_STREAM_APIKEY;
const userId = "kissa";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoia2lzc2EifQ.E3FSq7f5ZfsDCPshJsOU4okn9pf-y8AxYVEQvNNe14s";

const filters = { members: { $in: [userId] } };
const options = { presence: true, state: true };
const sort = { last_message_at: -1 };


const App = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("messaging dark");

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: { id: userId },
  });

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

  if (!client) return <div>Loading...</div>;

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
            <ChannelList sort={sort} filters={filters} options={options} />
          </div>
        </aside>
        <main className="w-full h-full sm:h-[710px] overflow-hidden flex flex-col relative">
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
                <MessageList
                  additionalMessageInputProps={{
                    urlEnrichmentConfig: { enrichURLForPreview: true },
                  }}
                />
              </div>
              <div className={`border-t border-gray-700 ${theme === "messaging dark" ? "bg-gray-950":" bg-slate-100"}  absolute bottom-0 w-full  z-50`}>
                <MessageInput
                  Input={() => <CustomMessageInput theme={theme} />}
                />
              </div>
            </Window>
            <Thread />
          </Channel>
        </main>
      </div>
    </Chat>
  );
};

export default App;
