import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import axios from 'axios';
import { appConfig } from '../../config';
import Jimp from 'jimp';
import { RGBA } from '@jimp/core';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  // Ignore non POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Only POST requests allowed!' });
    return;
  }

  try {
    const content = req.body;
    const inputBuffer = Buffer.from(content.buffer, 'base64');

    // Remove background
    const removedBackgroundBuffer = await removeBackground(inputBuffer);
    if (removedBackgroundBuffer == null) {
      res.status(500).json({ message: 'Failed to remove background!' });
      return;
    }

    // Blend image with frozen image
    let finalBuffer = await compositeWithFrozen(removedBackgroundBuffer);

    // Check whether response is smaller than 5mb (serverless function response limit)
    // and reduce image size if necessary
    const imageSizeInMb = finalBuffer.byteLength / 1024 / 1024;
    if (imageSizeInMb > 5) {
      const factor = 5 / imageSizeInMb;
      finalBuffer = await sharp(finalBuffer)
        .resize(appConfig.imageDims * factor, appConfig.imageDims * factor)
        .toBuffer();
    }

    // Send Response
    res.send({
      buffer: finalBuffer.toString('base64'),
    });
  } catch (e) {
    console.log('Error', e);
    res.status(400).json({ message: 'Something went wrong', e });
  }
}

async function compositeWithFrozen(input: Buffer): Promise<Buffer> {
  // Fetch frozen asset from 'public' folder (Note relative path doesn't work)
  const frozenBufferResponse = await axios({
    url: `${appConfig.imageBaseUrl}/frozen.png`,
    responseType: 'arraybuffer',
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
    ])
    .toBuffer();
}

// Inspired by: https://github.com/oliver-moran/jimp/issues/395
async function removeBackground(input: Buffer): Promise<Buffer | null> {
  // Buffer to Jimp Image
  const image = await Jimp.read(input);

  // Target color should be the background color
  // and is thus received from the first pixel
  const targetColor: RGBA = Jimp.intToRGBA(image.getPixelColor(0, 0));

  // Transparent
  const replaceColor: RGBA = { r: 0, g: 0, b: 0, a: 0 };

  // Calculates the distance between two colors
  const colorDistance = (c1: RGBA, c2: RGBA) =>
    Math.sqrt(
      Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2) +
        Math.pow(c1.a - c2.a, 2),
    );

  const threshold = 32; // Replace colors under this threshold. The smaller the number, the more specific it is.

  // Replace target with replaceColor based on the distance
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
    const thisColor = {
      r: image.bitmap.data[idx + 0],
      g: image.bitmap.data[idx + 1],
      b: image.bitmap.data[idx + 2],
      a: image.bitmap.data[idx + 3],
    };

    if (colorDistance(targetColor, thisColor) <= threshold) {
      image.bitmap.data[idx + 0] = replaceColor.r;
      image.bitmap.data[idx + 1] = replaceColor.g;
      image.bitmap.data[idx + 2] = replaceColor.b;
      image.bitmap.data[idx + 3] = replaceColor.a;
    }
  });

  // Jimp Image to Buffer
  return new Promise<Buffer | null>((resolve) => {
    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
      resolve(buffer || null);
    });
  });
}

// https://stackoverflow.com/questions/53550932/dotenv-values-not-loaded-in-nextjs
export const config = {
  api: {
    bodyParser: {
      sizeLimit: `${appConfig.maxImageSize}mb`,
    },
  },
};

type RequestData = {
  buffer: string;
};

type ResponseData =
  | {
      buffer: string;
    }
  | {
      message: string;
      e?: any;
    };
