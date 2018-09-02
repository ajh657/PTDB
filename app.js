var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var DataJson = require("./Data.json");

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: DataJson.DBIP,
    user: DataJson.DBU,
    password: DataJson.DBP,
    database: DataJson.DBN
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

sleep(1000);

for (let index = 1; index < 803; index++) {
    var Data = GetData(`https://pokeapi.co/api/v2/pokemon/${index}/`);

    console.log(Data)


    if (Data.types.length == 2) {
        var sql = "INSERT INTO Data (Pid, name, type, type2, height, weight, NormalPicture, ShinyPicture) VALUES (??, ?? , ??, ??, ??, ??, ??, ??)";
        var inserts = [connection.escape(Data.id), connection.escape(Data.name), connection.escape(Data.types[0]), connection.escape(Data.types[1]), connection.escape(Data.height), connection.escape(Data.weight), connection.escape(Data.sprites[4]), connection.escape(Data.sprites[6])];
    } else {
        var sql = "INSERT INTO Data (Pid, name, type, height, weight, NormalPicture, ShinyPicture) VALUES (??, ?? , ??, ??, ??, ??, ??)";
        var inserts = [connection.escape(Data.id), connection.escape(Data.name), connection.escape(Data.types[0]), connection.escape(Data.height), connection.escape(Data.weight), connection.escape(Data.sprites[4]), connection.escape(Data.sprites[6])];
    }

    sql = mysql.format(sql, inserts);

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log(Data);
        console.log(results);
    });
    sleep(3000);
}

connection.end();

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function GetData(theUrl) {
    var data;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    data = JSON.parse(xmlHttp.responseText)
    return data;
}