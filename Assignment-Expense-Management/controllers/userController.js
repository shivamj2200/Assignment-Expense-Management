const bcrypt = require('bcrypt');
const Model = require('../models/usersModel');
const sendEmail = require('../services/email');
const redis = require('redis');
const redisPort = 6379;

// it is use the create or add a new data in the Databse
module.exports.create = async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const data = new Model({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(password, 10),
  });
  try {
    if (req.body.password !== req.body.password2) {
      return res.status(400).send('Passwords dont match');
    }
    let user = await Model.findOne({ email: req.body.email });
    if (user) return res.status(400).json('User already registered.');

    const dataToSave = await data.save();

    // sending Email

    if (dataToSave) {
      await sendEmail({
        email,
        subject: 'registered',
        message: 'Congratulations you are Registered',
      });
    }

    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get th single data with the help of id
module.exports.getOne = async function (req, res, next) {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get All the data with the help of id
module.exports.getAll = async function (req, res, next) {
  const limitValue = req.query.limit || 2;
  let skipValue = req.query.skip || 0;
  const key = 'getAll' + skipValue.toString() + limitValue.toString();
  try {
    const client = redis.createClient(redisPort);
    client.connect();
    // const data = await Model.find();
    // use redis for caching
    client.expire(key, 10);
    const data = await client.get(key);
    if (data) {
      res.json(JSON.parse(data));
    } else {
      Model.paginate({}, { page: req.query.skip, limit: req.query.limit });

      {
        skipValue = skipValue * limitValue;
        const data = await Model.find().limit(limitValue).skip(skipValue);
        //console.log(client);
        await client.set(key, JSON.stringify(data));
        return res.json(data);
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// updated the data

module.exports.edit = async function (req, res, next) {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: 'Data to update can not be empty!',
      });
    }
    const id = req.params.id;
    const data = await Model.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (!data) {
      res.status(404).send({
        message: `Cannot update model with id=${id}. Maybe model was not found!`,
      });
    } else res.send({ message: 'DATA was updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Deleted the data help of id
module.exports.delete = async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Sending forget password email link
exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const data = await Model.findOne({ email });
  if (data) {
    const resetUrl = `http://127.0.0.1:3000/api/resetpassword/${data._id}`;
    await sendEmail({
      email,
      subject: 'Reset password',
      message: `please click on the link ${resetUrl} for reset your password.Otherwise ignore this email`,
    });
    res.status(200).json({
      message: 'Email has been send for reset your password',
    });
  } else {
    res.status(400).json({
      message: 'Email Does not exist',
    });
  }
};

// Reset password by the link
exports.resetPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Model.findById(id);
    if (req.body.newpassword === req.body.confirmpassword) {
      const password = await bcrypt.hash(req.body.newpassword, 10);
      const data = await Model.updateOne(
        { _id: id },
        { $set: { password } },
        { new: true }
      );
      if (data) {
        await sendEmail({
          email: doc.email,
          subject: 'Password Change',
          message: `Congratulations Your password Sucessfully Change`,
        });
        res.status(200).json({
          message: 'Congratulations Your password Sucessfully Change',
        });
      } else {
        res.status(200).json({
          message: 'invalid user',
        });
      }
    } else {
      res.status(200).json({
        message: 'Password does not match',
      });
    }
  } catch (err) {
    console.log(err.message);
    next();
  }
};
