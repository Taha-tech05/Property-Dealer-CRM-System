import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let socket;

export function useSocket(room, onEvent) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!socket) {
      socket = io({ path: "/socket.io" });
    }

    // Wait for connection before joining
    const joinRoom = () => socket.emit("join", room);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    const handler = (data) => onEventRef.current(data);

    socket.on("lead:new", (data) => handler({ type: "lead:new", data }));
    socket.on("lead:assigned", (data) => handler({ type: "lead:assigned", data }));
    socket.on("lead:updated", (data) => handler({ type: "lead:updated", data }));
socket.on("lead:deleted", (data) => handler({ type: "lead:deleted", data }));

    return () => {
      socket.off("connect", joinRoom);
      socket.off("lead:new");
      socket.off("lead:assigned");
      socket.off("lead:updated");
      socket.off("lead:deleted");
    };
  }, [room]);
}