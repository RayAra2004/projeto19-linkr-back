import express from "express";
import cors from "cors";
import router from "./routes/index.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    