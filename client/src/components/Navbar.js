import {
  Box,
  Button,
  Icon,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useForceUpdate,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentPath, selectFolders } from "../utils/selectors";
import {
  MdArrowDownward,
  MdArrowDropDown,
  MdCreateNewFolder,
  MdHome,
} from "react-icons/md";
import { SET_CURRENT_PATH, SET_FOLDERS } from "../utils/actions";
import { AiOutlineCloudUpload } from "react-icons/ai"; // You can import an appropriate icon

import axios from "axios";

const darkStyle = {
  backgroundColor: "rgb(44, 44, 44)",
  color: "rgb(161, 161, 161)",
};

export default function Navbar() {
  const currentPath = useSelector(selectCurrentPath);
  const folders = useSelector(selectFolders);

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [editedText, setEditedText] = useState("");
  const tmpPath = useRef("");
  const [refresh, setRefresh] = useState(true)

  const handleRename = () => {
    setIsEditing(true); // Enter editing mode when Rename Folder is clicked
  };

  const handleTextChange = (event) => {
    setEditedText(event.target.value);
  };

  const handleSave = async () => {
    setIsEditing(false);
    const response = await axios.put("http://192.168.1.130:8080/api/renameFolder", {
      oldPath: currentPath,
      newName: editedText,
    });
    let currentFolderName = currentPath.split("/");
    currentFolderName = currentFolderName[currentFolderName.length - 1];
    let tmpCurrentPath = currentPath.replace(currentFolderName, editedText);
    console.log(tmpCurrentPath);
    dispatch({
      type: SET_CURRENT_PATH,
      currentPath: tmpCurrentPath,
    });
  };

  function countUntitled() {
    let count = 0;
    if (folders.length > 0) {
      folders.forEach((f) => count++);
    }
    return count;
  }
  const createFolder = async () => {
    const untitledCount = countUntitled();
    const response = await axios.post(`http://192.168.1.130:8080/api/createFolder`, {
      path: `${currentPath}/Untitled${untitledCount}`,
    });
    const newFolder = {
      name: `Untitled${untitledCount}`,
      contents: {
        folders: [],
        images: [],
      },
    };
    const newFolders = [...folders, newFolder];
    dispatch({
      type: SET_FOLDERS,
      folders: newFolders,
    });
  };

  const forceUpdate = useForceUpdate()

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);
    console.log(formData);
    try {
      const response = await axios.post("http://192.168.1.130:8080/api/upload", formData, {
        params: {
          uploadPath: currentPath,
        },
      });
      if (response.status === 200) {
        console.log("File uploaded successfully.");
        window.location.reload();

      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Box bg={"rgb(28, 28, 28)"} height={"60px"}>
      <Stack direction={"row"} gap={0} width={"70%"} m={"auto"} mt={"8px"}>
        {currentPath.split("/").map((part, index) => {
          tmpPath.current += part;
          if (index === 0) {
            return <></>;
          }

          if (index === 1) {
            return (
              <Button
                style={darkStyle}
                border={"1px"}
                borderColor={"blackAlpha.900"}
                borderRadius={0}
                borderLeftRadius={"6px"}
                onClick={() =>
                  dispatch({ type: SET_CURRENT_PATH, currentPath: "/home" })
                }
              >
                <Icon as={MdHome} mr={1} boxSize={"5"} />
                {part}
              </Button>
            );
          }

          if (index === currentPath.split("/").length - 1) {
            return (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={!isEditing && <Icon as={MdArrowDropDown} />}
                  borderRadius={0}
                  border={"1px"}
                  borderColor={"blackAlpha.900"}
                  borderLeft={0}
                  borderRightRadius={"6px"}
                  leftIcon={!isEditing && part === "home" ? <MdHome /> : <></>}
                  style={darkStyle}
                >
                  {isEditing ? (
                    <Input
                      value={editedText}
                      onChange={handleTextChange}
                      onBlur={handleSave}
                      autoFocus // Automatically focus the input when editing starts
                      variant={"unstyled"}
                      width={""}
                    />
                  ) : (
                    part
                  )}
                </MenuButton>
                <MenuList borderColor="blackAlpha.900" style={darkStyle}>
                  <MenuItem
                    bgColor="rgb(44, 44, 44)"
                    _hover={{ backgroundColor: "blackAlpha.500" }}
                    onClick={createFolder}
                  >
                    <Icon boxSize={5} mr={1} as={MdCreateNewFolder} />
                    New Folder
                  </MenuItem>
                  <MenuItem
                    bgColor="rgb(44, 44, 44)"
                    _hover={{ backgroundColor: "blackAlpha.500" }}
                    onClick={handleRename}
                  >
                    Rename Folder
                  </MenuItem>
                </MenuList>
              </Menu>
            );
          }
          return (
            <Button
              style={darkStyle}
              borderRadius={0}
              border={"1px"}
              borderLeft={0}
              borderColor={"blackAlpha.900"}
              onClick={() => {
                const newPath = currentPath
                  .split("/")
                  .slice(0, index + 1)
                  .join("/");

                dispatch({
                  type: SET_CURRENT_PATH,
                  currentPath: newPath,
                });
              }}
            >
              {part}
            </Button>
          );
        })}
        <Button
          leftIcon={<AiOutlineCloudUpload size={"23px"} />}
          colorScheme="whiteAlpha"
          variant="solid"
          as="label"
          htmlFor="file-input"
          ml={"auto"}
          cursor={"pointer"}
        >
          Upload
          <input
            id="file-input"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />{" "}
        </Button>
      </Stack>
    </Box>
  );
}
