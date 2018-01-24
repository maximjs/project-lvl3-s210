import express from 'express';
import axios from 'axios';
import path from 'path';

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('./dist'));

app.get('/', (request, response) => {
  response.sendfile(path.join(__dirname, 'dist/index.html'));
});

app.get('/api/rss', (request, response) => {
  axios.get(request.query.url)
    .then(resp => response.send(resp.data));
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
