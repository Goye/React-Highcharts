const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const chalk = require('chalk');
const faker = require('faker');

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('port', process.env.PORT || 3000);
//app.use(express.static(path.join(__dirname, 'public')));

app.get('/data/:key', function(req, res) {
    const key = req.params.key;
    const result = {};
    let maxNum = getRandomInt(3,6);
    result['name'] = key;
    result['data'] = [];

    for (let i=0; i <= maxNum; i++) {
        result.data.push({
            name: faker.company.companyName(),
            y: getRandomInt(1,50),
            drilldown: true
        });
    }
    res.json(result);
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

http.createServer(app).listen(app.get('port'), function () {
    console.log(chalk.cyan(
        '+============================================================+\n' +
        '|                          Server                            |\n' +
        '+============================================================+\n' +
        'Listening on :' + app.get('port')
    ));
});
