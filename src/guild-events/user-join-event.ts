import { GuildMember, MessageActionRow, MessageButton } from "discord.js";
import { logger } from "./../loggers/logger";
import { createGoogleUrl } from "./../connectors/google-connector";

const onUserJoinEvent = async (newMember: GuildMember): Promise<void> => {
  logger.info(`${newMember.displayName} joined the server`);

  const channel = await newMember.createDM();

  await channel.send(`Hey ${newMember.displayName}`);
  await channel.send("Avant de pouvoir rejoindre ce serveur, on aimerai te poser quelques questions !");
  await channel.send("Première question, c'est quoi ton nom ? (Cela va servir à te renommer sur le serveur)");

  // Send a google authentication URL to the user
  const googleUrl = createGoogleUrl(newMember.user.id);
  const messageButton = new MessageButton().setLabel("Connexion google").setStyle("LINK").setURL(googleUrl);
  const actionRow = new MessageActionRow().addComponents(messageButton);
  await channel.send({
    content:
      "Connectez-vous avec google pour vérifier votre appartenance à l'Essiee-IT (Sans confirmation, vous resterez avec le rôle 'Guest')",
    components: [actionRow],
  });
};

export { onUserJoinEvent };