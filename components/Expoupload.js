import { ref, uploadBytesResumable, getDownloadURL , getStorage,} from "firebase/storage";

const uploadImage = async (photo, setPhoto) => {
    const storage = getStorage();
  const storageRef = ref(storage, "images/" + new Date().toLocaleString() + photo.slice(137, 260));
  const response = await fetch(photo);
  const blob = await response.blob();
  const uploadTask = uploadBytesResumable(storageRef, blob);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
        default:
          break;
      }
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);
        setPhoto(downloadURL);
      });
    }
  );
};

export default uploadImage;
