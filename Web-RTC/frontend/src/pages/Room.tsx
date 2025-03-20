import { useCallback, useEffect, useRef, useState } from "react";
import { useSocketContext } from "../Context/Socket";
import { usePeerContext } from "../Context/Peer";

function Room() {
    const { socket } = useSocketContext();
    const { peer, username, createNewOffer, createNewAnswer, setRemoteDesc, remoteStream, sendStream } = usePeerContext();
    const [remoteUser, setRemoteUserName] = useState<string>("");
    const myVideoCamRef = useRef<HTMLVideoElement>(null);
    const otherVideoCamRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        socket.on("new-user", handleJoinedUser);
        socket.on("incomming-call", handleIncommingCall);
        socket.on("call-accepted", handleCallAccepted);

        return () => {
            socket.off("new-user", handleJoinedUser);
            socket.off("incomming-call", handleIncommingCall);
            socket.off("call-accepted", handleCallAccepted);
        };
    }, [socket]);

    useEffect(() => {
        peer.addEventListener("negotiationneeded", handleNegotiation);
        peer.addEventListener("track", handleTrackEvent);

        return () => {
            peer.removeEventListener("negotiationneeded", handleNegotiation);
            peer.removeEventListener("track", handleTrackEvent);
        };
    }, [peer]);

    useEffect(() => {
        if (otherVideoCamRef.current && remoteStream) {
            otherVideoCamRef.current.srcObject = remoteStream;
            console.log("Remote stream set:", remoteStream);
        }
    }, [remoteStream]);

    useEffect(() => {
        GetUserCamAndAudio();
    }, []);

    async function GetUserCamAndAudio() {
        try {
            const userStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            sendStream(userStream);

            if (myVideoCamRef.current) myVideoCamRef.current.srcObject = userStream;

            // Add tracks only if they aren't already added
            if (!peer.getSenders().length) {
                userStream.getTracks().forEach(track => peer.addTrack(track, userStream));
            }

            sendStream(userStream);
        } catch (err) {
            console.error("Error accessing camera/mic:", err);
        }
    }

    const handleTrackEvent = (event: RTCTrackEvent) => {
        const [remoteStream] = event.streams;
        if (otherVideoCamRef.current) {
            otherVideoCamRef.current.srcObject = remoteStream;
            console.log("Remote stream received:", remoteStream);
        }
    };

    const handleNegotiation = useCallback(async () => {
        const localOffer = await createNewOffer();
        socket.emit("user-call", { username: remoteUser, SDP: localOffer });
    }, [createNewOffer, remoteUser, socket]);

    const handleCallAccepted = useCallback(async (data: any) => {
        const { By, SDP } = data;
        console.log(`Call accepted by ${By}`);
        await setRemoteDesc(SDP);
    }, [setRemoteDesc]);

    const handleIncommingCall = useCallback(async (data: any) => {
        const { from, SDP } = data;
        const ans = await createNewAnswer(SDP);
        socket.emit("call-accepted", { By: username, SDP: ans });
        setRemoteUserName(from);
    }, [createNewAnswer, socket, username]);

    const handleJoinedUser = useCallback(async ({ name }: { name: string }) => {
        setRemoteUserName(name);
        const SDP = await createNewOffer();
        peer.setLocalDescription(SDP);
        socket.emit("user-call", { username, SDP });
    }, [createNewOffer, peer, socket, username]);

    return (
        <div>
            <p>You are connected with {remoteUser || "No one yet"}</p>
            <video autoPlay ref={myVideoCamRef} muted playsInline></video>
            <video autoPlay ref={otherVideoCamRef} playsInline></video>
        </div>
    );
}

export default Room;
