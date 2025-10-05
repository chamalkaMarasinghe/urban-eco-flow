import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useCallback, useState } from "react";
import imageCompression from "browser-image-compression";

import app from "../config/firebaseConfig";
import { maximumImagesUploadingSizes } from "../constants/commonConstants";

const useFirebaseFileUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFilesToFirebase = useCallback(
        async (uploadedFiles, folderName, maxSize = maximumImagesUploadingSizes.size_300KB) => {
            setIsLoading(true);
            setError(null);
            try {
                const storage = getStorage(app);
                const uploadedUrls = await Promise.all(
                    uploadedFiles.map((file) => {
                        return new Promise(async (resolve, reject) => {

                            let compressedFile = file;

                            // NOTE:  Compress the image
                            if (file.type.startsWith("image/")) {                          
                                compressedFile = await imageCompression(file, {
                                    maxSizeMB: maxSize, // max 300 KB
                                    useWebWorker: true,
                                });
                            }

                            const fileName = new Date().getTime() + file.name;
                            const storageRef = ref(
                                storage,
                                `${folderName}/${fileName}`
                            );
                            const metadata = {
                                contentType: file.type,
                                cacheControl: 'public,max-age=432000,must-revalidate' // 5 days cache cache
                            };
                            const uploadTask = uploadBytesResumable(
                                storageRef,
                                compressedFile,
                                metadata
                            );
                            uploadTask.on(
                                "stage_changed",
                                null,
                                (error) => reject(error),
                                async () => {
                                    try {
                                        const downloadURL =
                                            await getDownloadURL(
                                                uploadTask.snapshot.ref
                                            );
                                        console.log(downloadURL);
                                        resolve(downloadURL);
                                    } catch (urlError) {
                                        reject(urlError);
                                    }
                                }
                            );
                        });
                    })
                );
                return { success: true, uploadedUrls };
            } catch (uploadError) {
                setError(uploadError);
                return { success: false, error: uploadError };
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return [uploadFilesToFirebase, isLoading, error];
};

export default useFirebaseFileUpload;
