const core = require('@actions/core');
const TelegramBot = require('node-telegram-bot-api');

async function run() {
  try {
    // Obtenim les variables d'entorn
    const telegramToken = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;
    const name = core.getInput('name');

    if (!telegramToken || !chatId) {
      throw new Error('Falten variables d\'entorn TELEGRAM_TOKEN o CHAT_ID.');
    }

    // Creem el bot de Telegram
    const bot = new TelegramBot(telegramToken);

    // Missatge a enviar
    const message = `Workflow executado correctamente despues del ultimo commit. Saludos ${name}`;

    // Enviem el missatge a Telegram
    await bot.sendMessage(chatId, message);

    // Missatge d'èxit
    console.log('Missatge enviat.');
  } catch (error) {
    core.setFailed(`Error enviant el missatge: ${error.message}`);
  }
}

run();
