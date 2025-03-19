import { useEffect, useState } from "react";
import styles from "../Styles/Home.module.css";
import { useNavigate } from "react-router-dom";
import { usePeerContext } from "../Context/Peer";
import { useSocketContext } from "../Context/Socket";
import { BACKEND_URL } from "../scripts/socket";

const Home = () => {
    const [name, setName] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("");
    const [toogleJoinAndCreateRoom, setToogleJoinAndCreate] = useState<boolean>(false);
    const [optionsEnabled, setOptionsEnabled] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { socket } = useSocketContext();
    const { setUsername } = usePeerContext();
    const navigate = useNavigate();


    useEffect(() => {
        const timeoutId = setTimeout(() => setError(null), 2000);
        return () => clearTimeout(timeoutId);
    }, [error]);

    useEffect(() => {

        socket.on("creator-joined", (data: any) => handleJoinCreatedRoom(data));
        socket.on("user-joined", (data: any) => handleJoinRoom(data))

        return () => {
            socket.off("creator-joined", (data: any) => handleJoinCreatedRoom(data));
        }

    }, [socket]);



    function handleJoinCreatedRoom(data: any) {
        console.log("creator join");
      socket.emit("user-join" , {roomId });
        navigate(`room/${data.roomId}`);
        return;
    }

    function handleJoinRoom(data: any) {
        const { roomId } = data;
        navigate(`/room/${roomId}`);
    }

    const joinRoom = () => {
        if (!checkFields()) {
            setError("Fields cannot be empty");
            return;
        }
        setUsername(name);
        socket.emit("user-join", { name, roomId });

    };

    async function handleCreateNewRoom() {

        setUsername(name);
        const response = await fetch(`${BACKEND_URL}/rooms/create-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        })

        const result = await response.json();
        if (response.ok) {
            socket.emit("room-created", { name, roomId: result.roomId });
        }

    }

    function handleOptions(toogle: boolean) {

        setToogleJoinAndCreate(toogle);
        setName("");
        setOptionsEnabled(true);
    }


    const checkFields = () => name.trim() && roomId.trim();

    return (



        <div className={styles.InputContainer}>

            <div>
                <button onClick={() => setOptionsEnabled(false)} >back</button>
                <h1>VIDEO CALLING APP</h1>
            </div>
            {
                !optionsEnabled ?

                    <div>
                        <button onClick={() => handleOptions(true)} >CREATE ROOM</button>
                        <button onClick={() => handleOptions(false)} >JOIN ROOM</button>
                    </div>

                    :

                    <div>
                        {
                            toogleJoinAndCreateRoom ?

                                <div>
                                    <h1>CREATE ROOM</h1>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="enter your name" />
                                    <button onClick={handleCreateNewRoom} >create room</button>
                                </div>

                                :

                                <div
                                    style={{
                                        alignItems: "center",
                                        width: "300px",
                                        height: "200px",
                                        gap: "10px",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <h1>JOIN ROOM</h1>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                    <input
                                        type="text"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        placeholder="Enter room ID"
                                    />
                                    <button onClick={joinRoom} style={{ cursor: "pointer" }}>
                                        JOIN
                                    </button>
                                    {error && <p style={{ color: "red" }}>{error}</p>}
                                </div>
                        }

                    </div>

            }




        </div>
    );
};

export default Home;
