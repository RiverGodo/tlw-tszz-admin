
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static('dist/dist'));

//开启单页路由跳转
app.use(function (req, res) {
    res.sendFile(path.dirname(require.main.filename) + '/dist/index.html');
});

var PORT = parseInt(process.env.port || 7042);
if (process.argv[2] === 'prod') {
  PORT = 7042
} else {
  PORT = 7531
}
app.listen(PORT, function () {
    console.log('Node app is running, port:', PORT, '\n\n\n\n\n\n');
});
