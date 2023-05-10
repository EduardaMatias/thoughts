const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login');
  }

  static register(req, res) {
    res.render('auth/register');
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    console.log(password, confirmpassword);

    if (password != confirmpassword) {
      req.flash('message', 'As senhas não coincidem, tente novamente!');
      return res.render('auth/register');
    }

    const checkUser = await User.findOne({ where: { email: email } });

    if (checkUser) {
      req.flash('message', 'O email já está em uso, tente novamente!');
      return res.render('auth/register');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      req.session.userid = createdUser.id;

      req.flash('message', 'Cadastro realizado com sucesso!');
      req.session.save(() => {
        return res.redirect('/');
      });
    } catch (err) {
      console.log(err);

      return res.render('auth/register');
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash('message', 'Usuário não encontrado, tente novamente!');
      return res.render('auth/login');
    }

    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      req.flash('message', 'Senha incorreta, tente novamente!');
      return res.render('auth/login');
    }

    try {
      req.session.userid = user.id;

      req.flash('message', 'Login realizado com sucesso!');
      req.session.save(() => {
        return res.redirect('/');
      });
    } catch (err) {
      console.log(err);
      return res.render('auth/login');
    }
  }
};
