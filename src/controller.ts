import {errorToast, IMAGE_URL, IS_LOADING, parseFile} from "./core";
import {Buffer} from "buffer";
import axios from "axios";
import {appConfig} from "./config";

export async function onDrop(acceptedFiles: File[]) {
    IS_LOADING.set(true);

    if (acceptedFiles.length <= 0) {
        errorToast("You need to provide at least on file!");
        IS_LOADING.set(false);
        return;
    }

    // Parse first dropped file to buffer
    const fileBuffer = await parseFile(acceptedFiles[0]);
    if (fileBuffer == null) {
        errorToast("Failed to parse file!");
        IS_LOADING.set(false);
        return;
    }

    const fileSizeInMb = fileBuffer.byteLength / 1024 / 1024;
    console.log("File Size", fileSizeInMb)
    if(fileSizeInMb > appConfig.maxImageSize){
        errorToast(`File with ${fileSizeInMb.toFixed(2)}mb exceeded the max file size of ${appConfig.maxImageSize}mb!`);
        IS_LOADING.set(false);
        return;
    }

    try {
        // Edit provided image in backend
        const response = await axios.post('/api/hibearnate', {buffer: fileBuffer.toString('base64')});
        const data = response.data;
        const imageBuffer = Buffer.from(data.buffer, 'base64')

        // Setup image url to be linked in the UI
        const blob = new Blob([imageBuffer]);
        const url = URL.createObjectURL(blob);
        IMAGE_URL.set(url);
    } catch (e) {
        console.log("Error", e);
        errorToast("Something went wrong!");
    }

    IS_LOADING.set(false);
}

export function onDownload(imageUrl: string) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.setAttribute("download", "image.png"); //or any other extension
    document.body.appendChild(link);
    link.click();
}