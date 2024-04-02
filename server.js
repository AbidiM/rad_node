const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const writeRead = require('./routes/writeRead');
const updateDelete = require('./routes/updateDelete');
const udRoute = require('./routes/updateDelete');
app.use('/cr', writeRead);
app.use('/ud', updateDelete);
app.use('/', function (req, res, next) {
    console.log('this api is working');
    res.sendStatus(404);
});

app.listen(PORT, () =>
    console.log('this Server running on port: ' + PORT
    ));