const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
var hbs = exphbs.create({});
const path = require('path')

const app = express();

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(morgan('dev'));
app.use(require('./routes/login'));
app.use(require('./routes/search'));
app.use(express.static(path.join(__dirname, 'public')))

app.listen(app.get('port'), () => {
    console.log("server ", app.get('port'))
});

hbs.handlebars.registerHelper('if_equal', function(a, b, opts) {
  if (a == b) {
      return opts.fn(this)
  } else {
      return opts.inverse(this)
  }
})

