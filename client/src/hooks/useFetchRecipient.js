import { useEffect, useState } from "react";
import { baseURL, getRequest } from "../utils/services";

const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((id) => id !== user?._id);

  useEffect(() => {
    const getUsers = async () => {
      if (!recipientId) return;
      const response = await getRequest(`${baseURL}/users/find/${recipientId}`);
      if (response.error) {
        setError(error);
        return;
      }
      setRecipientUser(response);
    };
    getUsers();
  }, [recipientId]);
  return { recipientUser };
};

export { useFetchRecipientUser };
