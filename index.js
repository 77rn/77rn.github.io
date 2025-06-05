const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());

let allIngestions = [];

app.post("/ingest", (req, res) => {
  const { ids, priority } = req.body;

  if (!ids || !priority || !Array.isArray(ids)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  let ingestion_id = uuidv4(); // generate random id
  let batches = [];
  let batchSize = 3;

  for (let i = 0; i < ids.length; i += batchSize) {
    let batch = {
      batch_id: uuidv4(),
      ids: ids.slice(i, i + batchSize),
      status: "yet_to_start"
    };
    batches.push(batch);
  }

  let record = {
    ingestion_id: ingestion_id,
    priority: priority,
    status: "yet_to_start",
    batches: batches
  };

  allIngestions.push(record);

  res.json({ ingestion_id: ingestion_id });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
