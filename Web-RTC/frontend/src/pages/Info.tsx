
function Info() {

    function handleGetPeerDetails() {

        const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

        console.log(peerConnection);

    }

    return (
        <div>
            <button onClick={handleGetPeerDetails} >get peer details</button>
        </div>
    )
}

export default Info
