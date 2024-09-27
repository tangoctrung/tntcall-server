const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const job = require("./cron/cron");

job.start();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();
app.use(express.json());

app.get("", (req, res) => {
  res.json({
    "message": "Server is running..."
  })
})


const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});