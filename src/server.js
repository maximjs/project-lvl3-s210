import express from 'express';
import axios from 'axios';
// import path from 'path';

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('./dist'));
app.set('views', './dist');
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/api/rss', (request, response) => {
  axios.get(request.query.url)
    .then(resp => response.send(resp.data));
  console.log(request.query.url);
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
