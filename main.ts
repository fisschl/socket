import "@std/dotenv/load";
import { handleTranslate } from "./router/translate.ts";
import { handleVariables } from "./router/variables.ts";
import { io } from "./utils/io.ts";

io.on("connection", (socket) => {
  handleTranslate(io, socket);
  handleVariables(io, socket);
});

io.listen(4000);
