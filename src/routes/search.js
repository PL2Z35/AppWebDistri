const express = require("express");
const router = express.Router();
const { google } = require("googleapis");
const parse = require("csv-parser");
const fs = require("fs");
const pool = require("../db/database");
const bcrypt = require("bcrypt");

router.get("/search", async (req, res) => {
  const persons = await pool.query("select * from person");
  const results = await readCsv(persons);
  res.render("pages/search", { results });
});

router.get("/", async (req, res) => {
  const persons = await pool.query("select * from person");
  const results = await readCsv(persons);
  res.render("pages/search", { results });
});

router.post("/search/add/:id", async (req, res) => {
  const { id } = req.params;
  const { user, pass } = req.body;
  const newUser = {
    id,
    user,
    pass
  };
  newUser["id"] = encrypt(newUser.id);
  newUser["user"] = encrypt(newUser.user);
  newUser["pass"] = encrypt(newUser.pass);
  const persons = await pool.query("select * from person");
  var cont = 0;
  for (let i = 0; i < persons.length; i++) {
    if (compare(user, persons[i].user)) {
      cont++;
    }
  }
  if (cont == 0) {
    await pool.query("insert into person set ?", [newUser]);
  }
  res.redirect("/search");
});

async function readCsv(persons) {
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
  const personsCsv = getRows.data.values; i  iijb bv vb b bv vbbbbbbbbbbbbbbbbbbbbbbv       bv                                                                                              bv v bb b bvvb vb           v b kmni n  b b b  bv ubv  bv bvbv bvbvbv 
  let cont = 0;
  for (let i = 1; i < personsCsv.length; i++) {
    if(persons.length==0){
      results[cont] = {
        id: personsCsv[i][0],
        name: personsCsv[i][1],
        date: personsCsv[i][2],
        aux: "false",
      };
      cont ++;
    }
    for (let j = 0; j < persons.length; j++) {
      if (compare(personsCsv[i][0], persons[j].id)) {
        results[cont] = {
          id: personsCsv[i][0],
          name: personsCsv[i][1],
          date: personsCsv[i][2],
          aux: "true",
        };
        cont ++;
        break;
      }
      if (j == (persons.length - 1)) {
        results[cont] = {
          id: personsCsv[i][0],
          name: personsCsv[i][1],
          date: personsCsv[i][2],
          aux: "false",
        };
        cont ++;
      }
    }
  }
  return results;
}

function encrypt(data) {
  return bcrypt.hashSync(data, 5);
}

function compare(data, dataEncrypt) {
  return bcrypt.compareSync(data, dataEncrypt);
}

module.exports = router;
