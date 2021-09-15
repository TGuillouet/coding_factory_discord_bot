import { availableCommands } from "./get-available-commands";
import { onUserJoinEvent } from "./guild-events/user-join-event";
import { logger } from "./loggers/logger";

import * as dotenv from "dotenv";
dotenv.config();

import client from "./discord-client";

client.on("ready", () => {
  logger.info("The discord bot is ready");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  logger.info(`Launching command: ${commandName}`);

  const command = availableCommands.get(commandName);

  if (!command) return;

  command.execute(interaction);
});

client.on("guildMemberAdd", onUserJoinEvent);
