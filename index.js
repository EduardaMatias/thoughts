const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();

const conn = require('./db/conn');

const thoughtsRoutes = require('./routes/thoughtsRoutes');
const authRoutes = require('./routes/authRoutes');

const Thought = require('./models/Thought');
const User = require('./models/User');

const ThoughtController = require('./controlles/ThoughtController');
const AuthController = require('./controlles/AuthController');

const port = 3000;

const hbs = exphbs.create({
  partialsDir: 'views/partials',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: 'session',
    secret: 'root',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expirex: new Date(Date.now() + 360000),
      httpOnly: true,
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use(express.static('public'));

app.use('/thoughts', thoughtsRoutes);
app.use('/', authRoutes);

app.get('/', ThoughtController.showThoughts);

conn
  .sync()
  .then(() => {
    console.log(`✅Rodando em http://localhost:${port}`);
    app.listen(port);
  })
  .catch((err) => {
    console.log(`❌Erro ao rodar: \n ${err}`);
  });
