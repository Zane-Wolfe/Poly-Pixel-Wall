const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./animationsDB.db', sqlite3.OPEN_READWRITE,(err) => {
  if(err) {
    console.error(err.message);
    }
    console.log('Connected to DB');
});

// sql = `INSERT INTO animatonsTemp(file_name) VALUES (?)`;
// db.run(sql,["Test"],(err)=>{
//     if (err) return console.error(err.message);
// });

db.run("CREATE TABLE animationsTemp(id INTEGER PRIMARY KEY, code)");


