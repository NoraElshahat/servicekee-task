const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const moment = require('moment');

//to convert body of request to json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/chapters', (req, res) => {
  const { startDate, days, sessions } = req.body;

  let currentDay = new Date(startDate);
  const weekdays = {
    1: 6,
    2: 7,
    3: 1,
    4: 2,
    5: 3,
    6: 4,
    7: 5,
  };

  const studyDays = days
    .sort((a, b) => a - b)
    .map((day) => {
      return weekdays[day];
    });

  function getDateFormat(date) {
    return moment(date).format('DD-MM-YYYY');
  }

  function getDayy(index) {
    if (!index) {
      return getDateFormat(currentDay.toLocaleDateString());
    }
    const number =
      studyDays.find((d, i) => i > studyDays.indexOf(currentDay.getDay())) ||
      studyDays[0];
    let day = number - currentDay.getDay();
    if (day < 0) {
      day += 7;
    }

    currentDay.setDate(currentDay.getDate() + day);
    return getDateFormat(currentDay.toLocaleDateString());
  }

  let index = 0;
  let result = {};
  for (chapter = 1; chapter <= 30; chapter++) {
    result['chapter ' + chapter] = [];

    for (session = 1; session <= sessions; session++) {
      result['chapter ' + chapter].push(getDayy(index));
      if (index == 0) {
        index++;
      }
    }
  }
  res.send(result);
});

app.listen(5000, () => {
  console.log('Server is Ready to handle your requests');
});
