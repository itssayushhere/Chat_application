import { useEffect, useState } from "react";
import { useChannelStateContext } from "stream-chat-react";

// eslint-disable-next-line react/prop-types
export default function ChannelInfo({ close, user }) {
  const { channel } = useChannelStateContext();
  const members = Object.values(channel?.state?.members || {});

  // Prepare list of member names excluding the current user and include only online members
  console.log(members);
  const [displayMembers,setDisplayMembers] = useState(null)
  useEffect(()=>{
      let  UserLabel
      const User = members.find((m) => m.user.id !== user);
    if(User === undefined || null){
         setDisplayMembers('')
    }else{
         UserLabel = `${User?.user?.name} ${
          User?.user?.online === false ? "(offline)" : "(online)"
        }`;
        // displayMembers = ` ${UserLabel}`;
        setDisplayMembers(`${UserLabel}`)
    }
  },[members, user])
console.log(displayMembers)
  // Combine the list of member names with the current user label
//   const displayMembers = ` ${UserLabel}`;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-950 bg-opacity-90 text-white p-2 rounded shadow-lg border-2 border-opacity-50 border-white">
        <div className="w-full">
          <p className="text-xl flex flex-col items-center justify-center py-2 px-16 font-bold font-mono text-gray-100 mb-3 border rounded-xl bg-black bg-opacity-40">
            {channel?.data?.name}
            <span className="text-xs border p-[2px] rounded-lg bg-black">
              Type: {channel?.data?.type}
            </span>
          </p>
          <p>
            <img
              src={channel?.data?.image}
              alt="Channel Image"
              height={200}
              width={200}
              className="mx-auto border rounded-xl border-black border-opacity-80"
            />
          </p>
          <p className="flex flex-col text-center">
            <span className="font-semibold">Members:</span>
            <span>{displayMembers !=='' && displayMembers }{displayMembers !=='' && ','} You</span>
          </p>
          <button
            onClick={() => close()}
            className="mt-2 p-2 bg-red-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
