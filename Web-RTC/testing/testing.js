const peer = new RTCPeerConnection({
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478"
            ]
            ]
        }
});

peer.createDataChannel("dummy");

peer.createOffer()
.then(async (SDP) => { 

   await peer.setRemoteDescription(SDP);
   const answer = await peer.createAnswer();
 console.log(SDP)
})
.catch(error => console.log(error));

