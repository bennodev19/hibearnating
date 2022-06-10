import type {NextApiRequest, NextApiResponse} from 'next';
import sharp from 'sharp';
import axios from 'axios';
import {appConfig} from "../../config";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    // Ignore non POST requests
    if (req.method !== 'POST') {
        res.status(405).json({message: "Only POST requests allowed!"});
        return;
    }

    try {
        const content = req.body;
        const inputBuffer = Buffer.from(content.buffer, 'base64');

        // Remove background
        const removedBackgroundBuffer = await removeBackground(inputBuffer);

        // Blend image with frozen image
        let finalBuffer = await compositeWithFrozen(removedBackgroundBuffer);

        // Check whether response is smaller than 5mb (serverless function response limit)
        // and reduce image size if necessary
        const imageSizeInMb = finalBuffer.byteLength / 1024 / 1024;
        if (imageSizeInMb > 5) {
            const factor = 5 / imageSizeInMb;
            finalBuffer = await sharp(finalBuffer).resize(appConfig.imageDims * factor, appConfig.imageDims * factor).toBuffer()
        }

        // Send Response
        res.send({
            buffer: finalBuffer.toString('base64')
        });
    } catch (e) {
        console.log("Error", e)
        res.status(400).json({message: 'Something went wrong', e});
    }
}

async function compositeWithFrozen(input: Buffer): Promise<Buffer> {
    // Fetch frozen asset from 'public' folder (Note relative path doesn't work)
    const frozenBufferResponse = await axios({
        url: `${appConfig.imageBaseUrl}/frozen.png`,
        responseType: 'arraybuffer'
    });
    const frozenBuffer = frozenBufferResponse.data as Buffer;

    // Blend frozen image with provided image (using sharp as jimp doesn't offer a proper composite functionality)
    return sharp(input)
        .png()
        .resize(appConfig.imageDims, appConfig.imageDims)
        .composite([
            {
                input: frozenBuffer,
                blend: 'hard-light',
            },
        ]).toBuffer();
}

async function removeBackground(input: Buffer): Promise<Buffer> {
    // TODO Make bg transparent!!
    //  https://stackoverflow.com/questions/11472273/how-to-edit-pixels-and-remove-white-background-in-a-canvas-image-in-html5-and-ja
    // https://github.com/oliver-moran/jimp/issues/395

    return input;
}

// https://stackoverflow.com/questions/53550932/dotenv-values-not-loaded-in-nextjs
export const config = {
    api: {
        bodyParser: {
            sizeLimit: `${appConfig.maxImageSize}mb`
        }
    }
}

type RequestData = {
    buffer: string
}

type ResponseData = {
    buffer: string
} | {
    message: string;
    e?: any;
};