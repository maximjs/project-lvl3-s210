'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import path from 'path';

var app = (0, _express2.default)();

app.set('port', process.env.PORT || 5000);

app.use(_express2.default.static('./dist'));
app.set('views', './dist');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('index');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0FBQ0E7O0FBRUEsSUFBTSxNQUFNLHdCQUFaOztBQUVBLElBQUksR0FBSixDQUFRLE1BQVIsRUFBaUIsUUFBUSxHQUFSLENBQVksSUFBWixJQUFvQixJQUFyQzs7QUFFQSxJQUFJLEdBQUosQ0FBUSxrQkFBUSxNQUFSLENBQWUsUUFBZixDQUFSO0FBQ0EsSUFBSSxHQUFKLENBQVEsT0FBUixFQUFpQixRQUFqQjtBQUNBLElBQUksR0FBSixDQUFRLGFBQVIsRUFBdUIsS0FBdkI7O0FBRUEsSUFBSSxHQUFKLENBQVEsR0FBUixFQUFhLFVBQUMsT0FBRCxFQUFVLFFBQVYsRUFBdUI7QUFDbEMsV0FBUyxNQUFULENBQWdCLE9BQWhCO0FBQ0QsQ0FGRDs7QUFJQSxJQUFJLE1BQUosQ0FBVyxJQUFJLEdBQUosQ0FBUSxNQUFSLENBQVgsRUFBNEIsWUFBTTtBQUNoQyxVQUFRLEdBQVIsQ0FBWSw2QkFBWixFQUEyQyxJQUFJLEdBQUosQ0FBUSxNQUFSLENBQTNDO0FBQ0QsQ0FGRCIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbi8vIGltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5cbmFwcC5zZXQoJ3BvcnQnLCAocHJvY2Vzcy5lbnYuUE9SVCB8fCA1MDAwKSk7XG5cbmFwcC51c2UoZXhwcmVzcy5zdGF0aWMoJy4vZGlzdCcpKTtcbmFwcC5zZXQoJ3ZpZXdzJywgJy4vZGlzdCcpO1xuYXBwLnNldCgndmlldyBlbmdpbmUnLCAnZWpzJyk7XG5cbmFwcC5nZXQoJy8nLCAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcbiAgcmVzcG9uc2UucmVuZGVyKCdpbmRleCcpO1xufSk7XG5cbmFwcC5saXN0ZW4oYXBwLmdldCgncG9ydCcpLCAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdOb2RlIGFwcCBpcyBydW5uaW5nIG9uIHBvcnQnLCBhcHAuZ2V0KCdwb3J0JykpO1xufSk7XG4iXX0=