const TelegramBot = require('node-telegram-bot-api');
//Устанавливаем токен, который выдавал нам бот
const token = "1171334235:AAHVIhDmJcdSLhMgDCPZNtY2v-tQ4plW0tw";
const bot = new TelegramBot(token, { polling: true });


//Переменная для хранения заметок
const notes = [];

const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Инструкция', callback_data: '1' }],
      ]
    })
  };

bot.onText(/start/, function (msg, match) {
    bot.sendMessage(msg.chat.id, 'Нажмите на кнопку, чтоб узнать как использовать бота', options);
});

bot.on('callback_query', function (msg) {
    bot.sendMessage(msg.from.id, 'Для начала работы, Вам необходимо указать сообщение в таком формате: /напомни (через пробел, указать что нужно сделать), затем через пробел написать "в" и время в формате 00:00');
});





bot.onText(/напомни (.+) в (.+)/, function (msg, match) {
    const userId = msg.from.id;
    const text = match[1];
    const time = match[2];

    notes.push({ 'uid': userId, 'time': time, 'text': text });

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню, если не сдохну :)');
});





//Таймер каждую секунду проверяет записи, которые совпадают с конкретным временем
setInterval(function(){
    for (var i = 0; i < notes.length; i++) {
    const curDate = new Date().getHours() + ':' + new Date().getMinutes();
    if (notes[i]['time'] === curDate) {
      bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
      notes.splice(i, 1);
    }
  }
}, 1000);