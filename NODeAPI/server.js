import { app } from "./app.js";
import { connectDB } from "./data/database.js";
import dotenv from "dotenv";

dotenv.config({ path: "./data/config.env" });

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
});
