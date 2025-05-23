import express from "express";
import { errorHandler } from "./middlewares/errorHandler.js";
import cuisinesRouter from "./routes/cuisines.js";
import restaurantsRouter from "./routes/restaurants.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use("/restaurants", restaurantsRouter);
app.use("/cuisines", cuisinesRouter);

app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
