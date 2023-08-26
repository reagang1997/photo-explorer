const router = require("express").Router();
const jsPath = require("path");
const fs = require("fs");
const multer = require('multer');
const os = require('os')

const HOME_DIR = os.homedir()

function readFolderContents(folderPath) {
  const files = fs.readdirSync(folderPath);
  const folders = [];
  const emptyFolders = [];
  const images = [];

  files.forEach((file) => {
    const filePath = jsPath.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const contents = readFolderContents(filePath);
      const newFolder = {
        name: file,
        contents: readFolderContents(filePath), // Recursively read nested folders
      };
      folders.push(newFolder);
    } else if (
      stats.isFile() &&
      [".jpg", ".jpeg", ".png", ".gif"].includes(
        jsPath.extname(file).toLowerCase()
      )
    ) {
      images.push(file);
    }
  });
  return { folders, images };
}

router.get("/directory", (req, res) => {
  const folderName = req.query.folderName;
  console.log(folderName);
  const folderPath = jsPath.join(HOME_DIR, `/${folderName}`);
  console.log(folderPath);
  try {
    const result = readFolderContents(folderPath);
    console.log(result);
    res.send({ folders: result.folders, images: result.images });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error reading directory");
  }
});

router.put("/setCurrentPath", (req, res) => {
  const currentPath = req.query.currentPath;
  req.session.currentPath = currentPath;
  res.sendStatus(200);
});

router.get("/currentPath", (req, res) => {
  let currentPath = req.session.currentPath;
  if (currentPath == undefined) {
    currentPath = "/home";
  }
  console.log("Current Path: ", currentPath);
  res.send(currentPath);
});

router.post("/createFolder", (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res
        .status(400)
        .json({ error: "Path is required in the request body." });
    }

    fs.mkdir(
      jsPath.join(HOME_DIR,`${path}`),
      { recursive: true },
      (error) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "An error occurred while creating the directory." });
        }

        res.status(201).json({ message: `Directory created at ${path}` });
      }
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

router.put("/renameFolder", async (req, res) => {
  try {
    let { oldPath, newName } = req.body;
    console.log(req.body);
    if (!oldPath || !newName) {
      return res.status(400).json({
        error: "Old path and new name are required in the request body.",
      });
    }

    // Clean up path by removing leading slash
    oldPath = oldPath.startsWith("/") ? oldPath.slice(1) : oldPath;
    newName = newName.startsWith("/") ? newName.slice(1) : newName;

    const newPath = jsPath.join(HOME_DIR, jsPath.dirname(oldPath), newName);

    fs.rename(`/Users/reagangrunwald/Personal/pve-stuff/photo-explorer/server/${oldPath}`, newPath, (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "An error occurred while renaming the folder." });
      }

      res.status(200).json({ message: "Folder renamed successfully." });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while renaming the folder." });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get the dynamic upload path from the request query or body
    const dynamicUploadPath = req.query.uploadPath || req.body.uploadPath;
    if (!dynamicUploadPath) {
      return cb(new Error('Missing dynamic upload path.'));
    }

    const uploadPath = jsPath.join(HOME_DIR, dynamicUploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('photo'), (req, res) => {
  console.log(req.file)
  console.log(req.body)
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send('File uploaded successfully.');
});

module.exports = router;
