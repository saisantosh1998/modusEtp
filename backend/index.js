const app = require("./app");
const config = require("./config/config");
let server = app;

server.listen(config.port || 3000, () => {
  console.log(`Server Listening at PORT ${config.port || 3000}`);
});
