const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const app = express();

require('./startup/config')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Comming soon...');
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));