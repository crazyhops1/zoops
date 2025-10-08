import { useEffect, useState } from "react";
import { api } from "../protact-route/api";
import { useSelector } from "react-redux";

export const useMessageCount = () => {
  const socket = useSelector((state) => state.socket.socket);
  const [countData, setCountData] = useState([]);

  // 1️⃣ Fetch initial message counts from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/message/get-message-count");
        if (response.status === 200 && response.data.success) {
          setCountData(response.data.data || []); // fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching message count:", error);
      }
    };

    fetchData();
  }, []);

  // 2️⃣ Listen for real-time updates via socket
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (updatedCounts) => {
      if (!updatedCounts || !Array.isArray(updatedCounts.conversationCount)) return;

      setCountData((prev) => {
        // If prev is empty, just set the updated counts
        if (prev.length === 0) return updatedCounts.conversationCount;

        // Merge existing with updated
        const merged = prev.map((oldItem) => {
          const match = updatedCounts.conversationCount.find(
            (u) => u._id === oldItem._id
          );
          return match ? { ...oldItem, unreadCount: match.unreadCount } : oldItem;
        });

        
        const newItems = updatedCounts.conversationCount.filter(
          (u) => !prev.some((p) => p._id === u._id)
        );
        return [...merged, ...newItems];
      });
    };

  
    socket.on("updateCounts", handleUpdate);

    return () => {
      socket.off("updateCounts", handleUpdate);
    };
  }, [socket]);

  return countData;
};
