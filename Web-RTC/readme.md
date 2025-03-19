# what is web RTC ? 

# ANS -> (web real time communication) => that allow one user browser to transfer any type of data like video, audio , text etc . sharing data directly between browser or application with needing a server in between them.

# Signaling: Peers exchange connection details via a server ( websocket server ).
# ICE Process: Finds the best connection path (direct or relayed).
# P2P Setup: Direct connection between peers is established.
# E2E Encryption: All media and data are encrypted automatically.
# Communication: Real-time audio, video, or data flows securely! 

# TCP =>  transmission control protocol 
# UDP =>  User datagram protocol 
# TURN => Traversal Using Relays around NAT
# STUN => Session Traversal Utilities for NAT
# ICE =>  Intractivity Connection Establishment
# NAT => Network address translation 
# SDP => Session Description Protocol

# STUN: Helps peers discover their public IPs and establish direct P2P connections.
# TURN: Acts as a relay when direct P2P isn’t possible, ensuring reliable connections.
# WebRTC prefers STUN (direct), falling back to TURN (relay) only if needed