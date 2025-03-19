import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./Styles/global.css"
import { SocketProvider } from "./Context/Socket.tsx"
import { PeerProvider } from "./Context/Peer.tsx";
createRoot(document.getElementById('root')!).render(

   <SocketProvider>
      <PeerProvider>
         <App />
      </PeerProvider>
   </SocketProvider>
)
