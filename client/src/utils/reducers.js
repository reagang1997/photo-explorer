import { SET_CURRENT_PATH, SET_FOLDERS, SET_IMAGES } from "./actions";

// reducers/someReducer.js
const initialState = {
  currentPath: "/photos",
  folders: [],
  images: [],
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_PATH:
      return {
        ...state,
        currentPath: action.currentPath,
      };
    case SET_FOLDERS:
      return {
        ...state,
        folders: action.folders,
      };
    case SET_IMAGES:
      return {
        ...state,
        images: action.images,
      };
    default:
      return state;
  }
};

export default reducers;
