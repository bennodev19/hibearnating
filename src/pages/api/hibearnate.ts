import type {NextApiRequest, NextApiResponse} from 'next';
import sharp from 'sharp';
import {Buffer} from "buffer";
import axios from 'axios';
import {appConfig} from "../../config";

type RequestData = {
    buffer: string
}

type ResponseData = {
    buffer: string
} | {
    message: string;
    e?: any;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    // Ignore non POST requests
    if (req.method !== 'POST') {
        res.status(405).json({message: "Only POST requests allowed!"});
    }

    try {
        const content = req.body;
        const imageBuffer = Buffer.from(content.buffer, 'base64');

        // Fetch frozen asset from 'public' folder (Note relative path doesn't work)
        const frozenBufferResponse = await axios({
            url: `${appConfig.imageBaseUrl}/frozen.png`,
            responseType: 'arraybuffer'
        });
        const frozenBuffer = frozenBufferResponse.data as Buffer;

        // Blend frozen image with provided image
        const output = await sharp(imageBuffer)
            .png()
            .composite([
                {
                    input: frozenBuffer,
                    blend: 'hard-light',
                },
            ]);
        const buffer = await output.toBuffer();

        res.send({
            buffer: buffer.toString('base64')
        });
    } catch (e) {
        console.log("Error", e)
        res.status(400).json({message: 'Something went wrong', e});
    }
}