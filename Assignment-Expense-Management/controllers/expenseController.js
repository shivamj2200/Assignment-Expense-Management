const Model = require('../models/expenseModel');
const tokenModel = require('../models/tokenModel');
const expense = require('../models/expenseModel');
const redis = require('redis');
const redisPort = 6379;

// it is use the create or add a new data in the Databs
module.exports.create = async function (req, res, next) {
  let data;
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization.split(' ')[1];
    // console.log(authorization);
    tokenModel.findOne({ token: authorization }, function (err, user1) {
      if (err) return handleErr(err);
      data = new Model({
        name: req.body.name,
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        userID: user1.userID,
        category: req.body.category,
      });
      try {
        const dataToSave = data.save();
        dataToSave.then(function (result) {
          res.status(200).json(result); // "Some User token"
        });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  }
};

module.exports.expenseOne = async function (req, res, next) {
  try {
    let userID;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      tokenModel.findOne({ token: authorization }, async function (err, user1) {
        if (err) return handleErr(err);
        userID = user1.userID;
        const limitValue = req.query.limit || 2;
        let skipValue = req.query.skip || 0;
        const key =
          userID.toString() + skipValue.toString() + limitValue.toString();
        const client = redis.createClient(redisPort);
        // console.log(client);
        client.connect();
        // const data = await Model.find();
        // use redis for caching
        client.expire(key, 60000);

        // const data = await client.get(key);
        if (data) {
          res.json(JSON.parse(data));
        } else {
          {
            skipValue = skipValue * limitValue;
            expense
              .find({ userID })
              .limit(limitValue)
              .skip(skipValue)
              .exec()
              .then(async (data) => {
                //bcrypt password
                await client.set(key, JSON.stringify(data));
                return res.json(data);
              });
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.expenseAll = async function (req, res, next) {
  //   router.get('/getAll', async (req, res) => {
  const limitValue = req.query.page || 2;
  let skipValue = req.query.skip || 0;
  const key = 'expenseAll' + skipValue.toString() + limitValue.toString();
  try {
    const client = redis.createClient(redisPort);
    // console.log(client);
    client.connect();
    client.expire(key, 2);
    // const data = await Model.find();
    // use redis for caching
    const data = await client.get(key);

    if (data) {
      res.json(JSON.parse(data));
    } else {
      skipValue = skipValue * limitValue;
      const data = await expense.find().limit(limitValue).skip(skipValue);
      await client.set(key, JSON.stringify(data));
      return res.json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete expense if you entered wrong

module.exports.expensedelete = async function (req, res, next) {
  try {
    let userId;
    const id = req.params.id;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;

        expense.findOne({ userID: userId }, function (err, user2) {
          if (err) return handleErr(err);
          userId = user2._id;
          console.log(userId);
          console.log(id);
          if (userId.toString() == id) {
            async function asyncCall() {
              const data = await expense.findByIdAndDelete(req.params.id);
              res.send(`Document with ${data.name} has been deleted..`);
            }
            asyncCall();
          } else {
            res.send(`param or token invalid..`);
          }
        });
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//update the expense the expense sheet has
module.exports.expenseUpdate = async function (req, res, next) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    let userId;
    if (req.headers && req.headers.authorization) {
      const authorization = req.headers.authorization.split(' ')[1];
      // console.log(authorization);
      tokenModel.findOne({ token: authorization }, function (err, user1) {
        if (err) return handleErr(err);
        userId = user1.userID;

        expense.findOne({ userID: userId }, function (err, user2) {
          if (err) return handleErr(err);
          userId = user2._id;
          // console.log(userId)
          // console.log(id)
          if (userId == id) {
            async function asyncCall() {
              const result = await expense.findByIdAndUpdate(
                id,
                updatedData,
                options
              );

              res.send(result);
            }
            asyncCall();
          }
        });
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.me = function (req, res) {
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization.split(' ')[1];
    Model.find({ token: authorization })
      .exec()
      .then((user) => {
        console.log(user[0]._id);
      });
  }
};
