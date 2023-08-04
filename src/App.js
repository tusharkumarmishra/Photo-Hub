import useCustomHooks from "./Hooks/CustomHooks";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import CreateNewForm from "./Components/CreateNewForm";
import DisplayAllResults from "./Components/DisplayAllResults";
import NavBar from "./Components/NavBar";
import LoadingPage from "./Components/LoadingPage";

import { db } from "./FireBase/FireBase";
import { doc, collection, onSnapshot, addDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";

export default function App() {

  const { albums, setAlbums, loading, setLoading, helper, setHelper } = useCustomHooks();


  //~~~~~ helper when **editing an image** => {unsub2 : realTimeDataListner ,id : openAlbumId, name: nameOfAlbum , image: {imageData that you want to change} }
  //~~~~~ helper when **adding a new image** => {unsub2 : realTimeDataListner ,id : openAlbumId, name: nameOfAlbum }
  //~~~~~ helper when **when no any album is opened**   =>   ""

  const notify = (massage) => {
    toast.success(massage, {
      theme: "dark"
    })
  };




  //~ add new album function
  const addNewAlbum = async (album) => {
    setLoading(true);
    if (!album.name && album.name.length > 12) { //~ i set album name with max letters upto 12
      return;
    }
    await addDoc(collection(db, "landingPage"), album);//~ here album={name: albumName , url: albumTemplate} is added
    notify(`NewAlbum named "${album.name}" is added`)
    setLoading(false)
  }



  //~ onClick event on album
  const openAlbum = async (id, name) => {
    setLoading(true);
    const unsub2 = onSnapshot(collection(db, "landingPage", id, "imageCollection"), (snapShot) => {
      const updatedAlbums = snapShot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() }
      })
      setAlbums(updatedAlbums)
    })
    notify(`Album named "${name}" is opened`);
    console.log({ unsub2, id, name });
    setHelper({ unsub2, id, name });//~ i store snapshot reference , id of opened album, and name of open album
    setLoading(false);

  }



  //~ home/back btn
  const homeBtnHandler = async () => {
    setLoading(true);

    helper.unsub2();//~Stop listening to changes inside opened album/file (Detach a listener)
    setHelper("");//~ since no any album is open ,i set helper to an empty string

    const querySnapshot = await getDocs(collection(db, "landingPage"));
    const homePage = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }
    });
    setAlbums(homePage)
    notify(`You are in Home Page`);
    setLoading(false);
  }



  //~ add new image inside a particular album
  const addImageToAlbum = async (image) => {
    setLoading(true);

    if (!image.url) {//~ can you imagine image withou url
      setLoading(false)
      return;
    }

    await addDoc(collection(db, "landingPage", helper.id, "imageCollection"), image);
    notify(`NewImage named "${image.name}" is added to ${helper.name}`);
    setLoading(false)
  }




  //~ if you want to change/edit an image so start updating from here
  const startEditing = async (imageId) => {

    const image = await getDoc(doc(db, "landingPage", helper.id, "imageCollection", imageId));//~ fetch image detail to fill it inside form
    notify(`Now, Start editing image named "${image.data().name}"`);
    setHelper({ ...helper, image: { ...image.data(), id: image.id } });//~ i append this fetch data,inside helper object
  }



  //~ now you have make changes,continue to update it
  const updateImage = async (updatedImage) => {
    await updateDoc(doc(db, "landingPage", helper.id, "imageCollection", updatedImage.id), { name: updatedImage.name, url: updatedImage.url });
    const { id, unsub2, name } = helper;
    notify(`Image updated Sucessfully`);
    setHelper({ id, unsub2, name });//~ remove data ,what you add inside helper during startEditing 
  }



  const deleteImage = async (imageId) => {
    const { id, unsub2, name } = helper;//~ remove data ,what you add inside helper during startEditing
    setHelper({ id, unsub2, name });
    notify(`Sorry, you are not allowed to delete this item`);
    // await deleteDoc(doc(db, "landingPage", helper.id, "imageCollection", imageId));
  }



  return (
    <>
      <NavBar
        helper={helper}
        homeBtnHandler={homeBtnHandler}
      />
      {loading ? <LoadingPage />
        : <>
          <CreateNewForm
            addNewAlbum={addNewAlbum}
            addImageToAlbum={addImageToAlbum}
            helper={helper}
            updateImage={updateImage}
          />
          <DisplayAllResults
            albums={albums}
            openAlbum={openAlbum}
            addImageToAlbum={addImageToAlbum}
            helper={helper}
            deleteImage={deleteImage}
            startEditing={startEditing}
          />
        </>}
      <ToastContainer autoClose={10000} />
    </>
  );
}
