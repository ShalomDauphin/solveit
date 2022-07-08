const express = require("express");
const accountRoutes = express.Router();
const fs = require("fs");

const path = "./useraccount.json";

const saveAccountData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(path, stringifyData);
};

const getAccountData = () => {
  const jsonData = fs.readFileSync(path);
  return JSON.parse(jsonData);
};

// reading the data from json

accountRoutes.get("/account", (req, res) => {
  fs.readFileSync(path, "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});

accountRoutes.post("/account/addaccount", (req, res) => {
  try {
    if (!getAccountData) throw Error("we hve a problem of fiding and acc");
    var existAccounts = getAccountData();
    const newAccountId = Math.floor(1000000 + Math.random() * 900000);
    existAccounts[newAccountId] = req.body;
    console.log(existAccounts);

    saveAccountData(existAccounts);
    res.send({ success: true, message: "Account created successfully" });
  } catch (e) {
    res.status(401).json({
      Error: error.message,
    });
  }
});

// get all created accounts from the json file

accountRoutes.get("/account/list", (req, res) => {
  const accounts = getAccountData();
  res.send(accounts);
});

//update using patch method
accountRoutes.patch("/account/:id", (req, res) => {
  var existingAccounts = getAccountData();
  fs.readFile(path, "utf-8", (err, data) => {
    const accountId = req.params["id"];
    existingAccounts[accountId] = req.body;

    saveAccountData(existingAccounts);
    res.send(`account with is ${accountId} has been updated`);
  });
});

// delete

accountRoutes.delete("/account/delete/:id", (req, res) => {
  fs.readFile(
    path,
    "utf-8",
    (err, data) => {
      var existingAccounts = getAccountData();

      const userId = req.params["id"];
      delete existingAccounts[userId];
      saveAccountData(existingAccounts);
      res.send(`accounts with ${userId} has been deleted`);
    },
    true
  );
});
module.exports = accountRoutes;
