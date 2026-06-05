const botToken = "8915016018:AAHmMiQWql1QWS8pmj9TBoY5XXFyphFJldU";
fetch(`https://api.telegram.org/bot${botToken}/getMe`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
