import { Box, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import filledFolder from '../assets/filledFolder.png'
import emptyFolder from '../assets/emptyFolder.png'
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentPath } from "../utils/selectors";
import { SET_CURRENT_PATH, SET_FOLDERS, SET_IMAGES } from "../utils/actions";
import axios from "axios";

export default function Folder({folder}){
    const currentPath = useSelector(selectCurrentPath);
    const dispatch = useDispatch();
    const [innerFolders, setInnerFolders] = useState([])
    const [innerImages, setInnerImages] = useState([])

    const navigateToFolder = async () => {
        dispatch({
            type: SET_CURRENT_PATH,
            currentPath: currentPath + `/${folder.name}`
        })
        console.log(folder.contents)
        dispatch({
            type: SET_FOLDERS,
            folders: folder.contents.folders
        })
        dispatch({
            type: SET_IMAGES,
            images: folder.contents.images
        })
    }

    useEffect(() => {
        setInnerFolders(folder.contents.folders)
        setInnerImages(folder.contents.images)
    }, [])

    return (
        <Stack width={'fit-content'} gap={0} cursor={'pointer'} onClick={navigateToFolder}>
            {console.log(folder)}
            <img src={innerFolders.length === 0 && innerImages.length === 0 ? emptyFolder : filledFolder} style={{height: '100px'}}/>
            <Text mt={'-10px'} color={'white'}>{folder.name}</Text>
        </Stack>
    )
}