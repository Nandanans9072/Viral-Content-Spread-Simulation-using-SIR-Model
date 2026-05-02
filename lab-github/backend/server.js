const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',  require('./routes/auth'));
app.use('/api/pr',    require('./routes/pullrequests'));
app.use('/api/repos', require('./routes/repos'));

app.get('/', (req, res) => {
  res.json({ message: 'Backend running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));