import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChats";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const {
    userChats,
    isUserChatsLoading,
    updateCurrentChat,
    currentChat,
  } = useContext(ChatContext);

  

  const handleChatClick = (chat) => {
    updateCurrentChat(chat);
  };

  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-center">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div onClick={() => handleChatClick(chat)} key={index}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <Stack>
            <ChatBox />
          </Stack>
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
