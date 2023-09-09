const Model = require('../models/categoryModel');

module.exports.categoryCreate = async function (req, res, next) {
  const data = new Model({
    name: req.body.name,
    description: req.body.description,
  });
  try {
    const dataToSave = await data.save();
    // console.log(dataToSave);
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.categoryAll = async function (req, res, next) {
  //   router.get('/getAll', async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.categoryUpdate = async function (req, res, next) {
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

module.exports.categorydelete = async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
