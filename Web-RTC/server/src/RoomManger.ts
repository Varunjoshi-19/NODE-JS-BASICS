import { Request, Response } from "express";
import crypto from "crypto";
export const nameToRoomIdMapping = new Map();
export const roomIdToNameMapping = new Map();


export class RoomManger {





    public static createRoom(req: Request, res: Response) {

        const { name } = req.body;
        if (!name || name == "") {
            res.status(404).json({ error: "name is required" })
            return;
        }

        try {
            const roomId = crypto.randomBytes(20).toString("hex");

            roomIdToNameMapping.set(roomId, name);
            nameToRoomIdMapping.set(name ,roomId);

            res.status(200).json({ success: true, roomId: roomId });

        }
        catch (error: any) {
            res.status(505).json({ error: `Internal error failed to create room ` })
            console.log(error.message);
        }

    }



}