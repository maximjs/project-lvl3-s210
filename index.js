import express from 'express';
// import path from 'path';

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('./dist'));
app.set('views', './dist');
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.render('index');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
