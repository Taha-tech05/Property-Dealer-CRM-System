"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Singleton socket connection shared across the app
let socketInstance = null;

function getSocket() {
  if (!socketInstance) {
    socketInstance = io({ path: "/socket.io", autoConnect: true });
  }
  return socketInstance;
}

export function useSocket(room, onEvent) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    // Don't connect if no room provided (e.g. session not loaded yet)
    if (!room) return;

    const socket = getSocket();

    const joinRoom = () => socket.emit("join", room);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    // Use stable named handlers so we can cleanly remove them
    const handleNew = (data) => onEventRef.current({ type: "lead:new", data });
    const handleAssigned = (data) => onEventRef.current({ type: "lead:assigned", data });
    const handleUpdated = (data) => onEventRef.current({ type: "lead:updated", data });
    const handleDeleted = (data) => onEventRef.current({ type: "lead:deleted", data });

    socket.on("lead:new", handleNew);
    socket.on("lead:assigned", handleAssigned);
    socket.on("lead:updated", handleUpdated);
    socket.on("lead:deleted", handleDeleted);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("lead:new", handleNew);
      socket.off("lead:assigned", handleAssigned);
      socket.off("lead:updated", handleUpdated);
      socket.off("lead:deleted", handleDeleted);
    };
  }, [room]);
}