const token = "8915016018:AAHmMiQWql1QWS8pmj9TBoY5XXFyphFJldU";
const chatId = "8745161114";
fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: chatId, text: "hello" })
}).then(r=>r.json()).then(console.log);
