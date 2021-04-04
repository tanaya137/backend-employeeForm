const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
var cors = require('cors');
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
    'DELETE',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));
const User = require("./model/user.model").User;
const typeorm = require("typeorm");
typeorm.createConnection().then(function (connection) {

  app.get('/user/getList', async function (req, res) {
    let userRepository = connection.getRepository(User);
    const userList = await userRepository.find();
    res.status(200).send({ isSuccess: true, data: userList });
  });

  app.get('/user/get/:id', async function (req, res) {
    let userRepository = connection.getRepository(User);
    const user = await userRepository.findOne({ id: req.params.id });
    if (user) {
      res.status(200).send({ isSuccess: true, data: user });
    } else {
      res.status(200).send({ isSuccess: true, message: "User not found" });
    }
  });

  app.post('/user/create', async function (req, res) {
    console.log("test", req.body)
    const user = req.body;
    let userRepository = connection.getRepository(User);
    user.created_on = new Date();
    const insertedObj = await userRepository.save(user);
    res.status(200).send({ isSuccess: true, data: insertedObj });
  });

  app.post('/user/update', async function (req, res) {
    const user = req.body;
    let userRepository = connection.getRepository(User);
    if(req.body.id){
      const insertedObj = await userRepository.save(user);
      res.status(200).send({ isSuccess: true, data: insertedObj });
    }
    // const insertedObj = await userRepository.update(user);
  });

  app.delete('/user/delete/:id', async function (req, res) {
    const data = req.params.id;
    let userRepository = connection.getRepository(User);
    const user = await userRepository.delete(data);
    // await userRepository.delete(user);
    console.log(user)
    res.status(200).send({ isSuccess: true });
  });

  app.listen(3000);
  console.log("Express application is up and running on port 3000");

}).catch(function (error) {
  console.log("Error: ", error);
});