import { useChatContext } from "stream-chat-react";

const UserInformation = () => {
    const {client} = useChatContext()
    console.log(client) 
  return (
    <div>UserInformation</div>
  )
}

export default UserInformation