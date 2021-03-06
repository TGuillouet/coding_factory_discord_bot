import * as express from "express";
import { logger } from "./../loggers/logger";
import { getUserName } from "./../connectors/google-connector";
import { guildId, baseRoleId, guestRoleId } from "../configs/discord-config";
import client from "./../discord-client";

const app = express();
app.use(express.json());
app.use("/assets", express.static("assets"));

app.set("view engine", "ejs");

app.get("/oauth2/redirect", async (request: express.Request, response: express.Response) => {
  const username = await getUserName(request.query.code as string);
  response.render("index", { username });
});

app.post("/change-status", async (request: express.Request, response: express.Response) => {
  const guild = await client.guilds.fetch(guildId);
  if (!guild) {
    response.status(404).json({ success: false, message: "Le serveur spécifié n'existe pas" });
    return;
  }

  const role = await guild.roles.fetch(baseRoleId);
  const guestRole = await guild.roles.fetch(guestRoleId);
  if (!guild) {
    response.status(404).json({ success: false, message: "Les rôle spécifiés dans la configuration n'existent pas" });
    return;
  }

  const { userId, fullname } = request.body;

  const user = await guild.members.fetch(userId);
  await user.setNickname(fullname);
  await user.roles.remove(guestRole);
  await user.roles.add(role);

  response.json({ success: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`The web server started on port ${port}`);
});
