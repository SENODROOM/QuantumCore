const router  = require("express").Router();
const { getAllRepoFiles } = require("../lib/github");
const { enqueue, shouldProcess } = require("../lib/queue");

router.post("/", async (req, res) => {
  const { files, all } = req.body || {};
  let toProcess = [];

  if (all) {
    const allFiles = await getAllRepoFiles();
    toProcess = allFiles.filter(shouldProcess);
  } else if (Array.isArray(files) && files.length) {
    toProcess = files.filter(shouldProcess);
  } else {
    return res.status(400).json({ error: "Provide { files: [...] } or { all: true }" });
  }

  const queued = enqueue(toProcess, null, "manual");
  res.json({ message: "Queued successfully", fileCount: queued });
});

module.exports = router;
