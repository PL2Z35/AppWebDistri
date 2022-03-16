const express = require("express");
const pool = require("../db/database");
const router = express.Router();
const { google } = require("googleapis");
const bcrypt = require("bcrypt");
const newUser = new Object();

router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.post("/login", async (req, res) => {
  const { user, pass } = req.body;
  const persons = await pool.query("select * from person");
  const person = search(persons, user, pass);
  const personscsv = await readCsv();
  for (let i = 0; i < personscsv.length; i++) {
      if(compare(personscsv[i].id,person.id)){
        newUser.name = personscsv[i].name;
        newUser.date = personscsv[i].date;
      }
  }
  if (person != null) {
    newUser.user = user;
    newUser.pass = pass;
    res.redirect("/person");
  } else {
    res.redirect("/login");
  }
});

router.get("/person", (req, res) => {
  res.render("pages/person", newUser);
});

router.post("/person", (req, res) => {
  res.redirect("/login");
});

function compare(data, dataEncrypt) {
  return bcrypt.compareSync(data, dataEncrypt);
}

function search(persons, user, pass) {
  for (let i = 0; i < persons.length; i++) {
    if (compare(user, persons[i].user) && compare(pass, persons[i].pass)) {
      return persons[i];
    }
  }
  return null;
}

async function readCsv() {
  const results = [];
  const auth = new google.auth.GoogleAuth({
    keyFile: __dirname + "/credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "1oC0UWEcWEsViyPTg-CsL5GfYJpu6nZ1CGAgBG3kkE1Y";
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "person",
  });
  const personsCsv = getRows.data.values;
  let cont = 0;
  for (let i = 1; i < personsCsv.length; i++) {      
      results[cont]= {
        id: personsCsv[i][0],
        name: personsCsv[i][1],
        date: personsCsv[i][2],
      };
      cont++;
  }
  return results;
}

module.exports = router;
