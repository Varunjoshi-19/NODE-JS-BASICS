import { useContext, createContext, ReactNode, useMemo, useState, useEffect, useCallback } from "react";


type ContextPayloadType = {
    peer: RTCPeerConnection;
    username: string
    remoteStream: MediaStream | null;
    setUsername: Function;
    createNewOffer: () => any;
    createNewAnswer: (offer: any) => any;
    setRemoteDesc: (offer: any) => Promise<void>;
    sendStream: (stream: MediaStream) => void;
}

const PeerContext = createContext<ContextPayloadType | undefined>(undefined);


export function usePeerContext() {
    const context = useContext(PeerContext);
    if (!context) {
        throw new Error("Peer context not avaliable ");
    }
    return context;
}


export const PeerProvider = ({ children }: { children: ReactNode }) => {



    const [username, setUsername] = useState<string>("");

    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);



    const peer = useMemo(() => {

        return new RTCPeerConnection({

            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ]
        })

    }, []);


    useEffect(() => {

        const handleTrackEvent = (ev: any) => {
            const stream = ev.streams;
            console.log("this is the remote stream ", stream[0]);
            setRemoteStream(stream[0]);
        };

        peer.addEventListener("track", handleTrackEvent);

        return () => {
            peer.removeEventListener("track", handleTrackEvent);
        };
    }, [peer]);


    async function createNewOffer() {
        const offer = await peer.createOffer();
        peer.setLocalDescription(offer);
        return offer;

    }

    async function createNewAnswer(offer: any) {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;

    }


    async function setRemoteDesc(offer: any) {
        await peer.setRemoteDescription(offer);

    }


    function sendStream(stream: MediaStream) {

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

    }




    return (
        <PeerContext.Provider value={{ username, remoteStream, setUsername, peer, createNewOffer, createNewAnswer, setRemoteDesc, sendStream }} >
            {children}
        </PeerContext.Provider>
    )
}