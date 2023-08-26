import logo from "./logo.svg";
import "./App.css";
import { Box, Container, Grid, GridItem, Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ContentView from "./components/ContentView";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios'
import { SET_FOLDERS, SET_IMAGES } from "./utils/actions";
import { selectCurrentPath } from "./utils/selectors";


function App() {

  const currentPath = useSelector(selectCurrentPath);
  const dispatch = useDispatch()

  async function getFolder(){
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
    getFolder()
  }, [currentPath])

  return (
    <div className="App">
      <Stack width={'100%'} height={'100%'} gap={0}>
        <Navbar />
        <Stack direction="row" gap={0} width={'100vw'} height={'100vh'}>
          <Box style={{width: '25%', height:'100%'}} bg={"rgb(36,36,36)"} m={0}>
            <Sidebar />
          </Box>
          <Box style={{width: '75%'}} bg={"rgb(30,30,30)"} m={0}>
            <ContentView />
          </Box>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
