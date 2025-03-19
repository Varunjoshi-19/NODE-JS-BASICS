import { useContext, createContext, ReactNode, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "../scripts/socket";

interface SocketProviderProps {
  children: ReactNode;
}

type ContextPayloadType = {
  socket: Socket;
};

const socketContext = createContext<ContextPayloadType | null>(null);

export const useSocketContext = () => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("Socket context is undefined or probably null");
  }
  return context;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const socket = useMemo(() =>  {
     return io(BACKEND_URL);
  }, []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};
