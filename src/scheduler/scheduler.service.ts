/**
 * Data Model Interfaces
 * Libraries
 */
const schedule = require('node-schedule');
const axios = require('axios');
import { ChannelManager, Client, Intents, Channel } from "discord.js";
import { selfPing } from "../app-health/app-health.service";
import { getScholars } from "../scholars/scholars.service";

/**
 * Call Repository
 */


/**
 * Service Methods
 */

export class JobScheduler {
  discordClient: Client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES
    ]
  });

  constructor(_discordClient: Client) {
    this.discordClient = _discordClient;
  }

  async start() {
    console.info("job initiated....");
    // Create a method that returns a rule based on the environment. (e.g. on staing)
    const rule = new schedule.RecurrenceRule();
    rule.hour = `${process.env.jobHour}`;
    // rule.minute = 39;
    rule.tz = `${process.env.TZ}`;
    const job = schedule.scheduleJob(rule, async () => {
      console.info("job started....");
      try {
        const axieScholarRoleId = process.env.axieScholarRoleId;
        //  execute jobs
        const scholars = await getScholars();
        const channel = this.discordClient.channels.cache.get(`${process.env.discordChannelId}`);
        if (channel?.isText()) {
          channel.send("Hey, this is a test from node-scheduler from the server.");
        }
      } catch (error) {

      }
    });
  }

  async startSelfPingJob() {
    console.info("starting self ping jobg");
    const job = schedule.scheduleJob('*/1 * * * *', function () {
      selfPing();
    });
  }
}
