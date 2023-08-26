import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Folder from "./Folder";
import axios from "axios";
import { SET_FOLDERS, SET_IMAGES } from "../utils/actions";
import { selectCurrentPath, selectFolders, selectImages } from "../utils/selectors";
import { Stack } from "@chakra-ui/react";
import Image from "./Image";

export default function ContentView() {
  const currentPath = useSelector(selectCurrentPath);
  const folders = useSelector(selectFolders);
  const images = useSelector(selectImages);
  console.log(folders);
  const dispatch = useDispatch();
  async function getCurrentDirectory() {
    const response = await axios.get(
      `http://localhost:8080/api/directory?folderName=${currentPath}`
    );
    dispatch({
      type: SET_FOLDERS,
      folders: response.data.folders,
    });
    dispatch({
      type: SET_IMAGES,
      images: response.data.images,
    });
  }

  useEffect(() => {
    getCurrentDirectory();
  }, []);

  return (
    <Stack gap={10} direction={"row"} m={"25px"} wrap={'wrap'}>
      {folders ? folders.map((f) => <Folder folder={f} />) : <></>}
      {images ? images.map((i) => <Image image={i}/>) : <></>}
    </Stack>
  );
}
