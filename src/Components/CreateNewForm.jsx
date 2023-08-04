import { useEffect, useRef } from "react";
import css from "../CSS/CreateNewForm.module.css"

export default function CreateNewForm(props) {

    const { helper, addNewAlbum, addImageToAlbum, updateImage } = props;

    const albumNameRef = useRef();
    const albumTemplatesRef = useRef();

    useEffect(() => {
        //~ when you edit any image, so previous data willl be filled inside input field
        albumNameRef.current.value = helper.image ? helper.image.name : "";
        albumTemplatesRef.current.value = helper.image ? helper.image.url : "";

    }, [helper])//~and i have added this data inside helper, when startEditing() get called


    function clearInputField() {
        albumNameRef.current.value = ""
        albumTemplatesRef.current.value = ""
    }

    //~~~~~ helper when **editing an image** => {unsub2 : realTimeDataListner ,id : openAlbumId, name: nameOfAlbum , image: {imageData that you want to change} }
    //~~~~~ helper when **adding a new image** => {unsub2 : realTimeDataListner ,id : openAlbumId, name: nameOfAlbum }
    //~~~~~ helper when **when no any album is opened**   =>   ""

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const name = albumNameRef.current.value;
        const url = albumTemplatesRef.current.value;

        helper.image ? updateImage({ name, url, id: helper.image.id })//~ when editing an image
            : !helper ? addNewAlbum({ name, url })//~when helper is empty
                : addImageToAlbum({ name, url });//~ when adding new image

        clearInputField();
    }


    return (
        <div className={css.newAlbumForm}>
            <form onSubmit={onSubmitHandler}>

                <input ref={albumNameRef}
                    type="text"
                    className={css.albumName}
                    maxLength={12}
                    placeholder={helper.image ? "New Image Name" : helper ? "Image Name" : "Album Name"}
                    required />

                <input ref={albumTemplatesRef}
                    type="url"
                    className={css.albumUrl}
                    placeholder={helper.image ? "New Image URL" : helper ? "Image Url" : "Album Template URL"} />

                <button>{helper.image ? "Edit" :"Add"}</button>
            </form>
        </div>
    );
}
