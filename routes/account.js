const express = require('express');
const accountRoute = express.Router();
const accountController = require('../controller/account')
const {authToken} = require('../middleware/authnticate')


accountRoute.post("/",accountController.addAccount);
accountRoute.get("/",accountController.getAllAccount);
accountRoute.get("/:id",accountController.getAccount);
accountRoute.put("/:id",accountController.updateAccount);
accountRoute.delete("/:id",accountController.removeAccount);
accountRoute.post("/login",accountController.login);






module.exports = {
    accountRoute
}