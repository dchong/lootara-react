import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImages = async (
  files: FileList,
  folder: string
): Promise<string[]> => {
  const urls: string[] = [];

  for (const file of Array.from(files)) {
    const fileRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    urls.push(url);
  }

  return urls;
};
