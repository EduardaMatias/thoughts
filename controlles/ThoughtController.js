const Thought = require('../models/Thought');
const User = require('../models/User');

const { Op } = require('sequelize');

module.exports = class ThoughtController {
  static async showThoughts(req, res) {
    let search = '';

    if (req.query.search) {
      search = req.query.search;
    }

    let order = 'DESC';

    if (req.query.order === 'old') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }

    const thoughtsData = await Thought.findAll({
      include: User,
      where: { title: { [Op.like]: `%${search}%` } },
      order: [['createdAt', order]],
    });

    const thoughts = thoughtsData.map((result) => result.get({ plain: true }));

    let thoughtsQty = thoughts.length;

    if (thoughtsQty === 0) {
      thoughtsQty = false;
    }

    res.render('thoughts/home', { thoughts, search, thoughtsQty });
  }

  static async dashboard(req, res) {
    const userid = req.session.userid;

    const user = await User.findOne({
      where: { id: userid },
      include: Thought,
      plain: true,
    });

    if (!user) {
      return res.redirect('/login');
    }

    const thoughts = user.Thoughts.map((result) => result.dataValues);

    let emptyThoughts = false;

    if (thoughts.length === 0) {
      emptyThoughts = true;
    }

    res.render('thoughts/dashboard', { thoughts, emptyThoughts });
  }

  static createThought(req, res) {
    res.render('thoughts/create');
  }

  static async createThoughtPost(req, res) {
    const thought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Thought.create(thought);

      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async editThought(req, res) {
    const id = req.params.id;

    const thought = await Thought.findOne({ where: { id: id }, raw: true });

    res.render('thoughts/edit', { thought });
  }

  static async editThoughtPost(req, res) {
    const id = req.params.id;

    const thought = {
      title: req.body.title,
    };

    try {
      await Thought.update(thought, { where: { id: id } });

      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async removeThought(req, res) {
    const id = req.params.id;
    const UserId = req.session.userid;

    try {
      await Thought.destroy({ where: { id: id, UserId: UserId } });

      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (err) {
      console.log(err);
    }
  }
};
