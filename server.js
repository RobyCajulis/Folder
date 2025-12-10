const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// SQLite DB
const db = new sqlite3.Database('./portfolio.db', err => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed INTEGER DEFAULT 0)`);
  db.run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, desc TEXT, img TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS contact_messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, message TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)`);

  // Default admin
  db.get("SELECT * FROM admin WHERE username = ?", ["admin"], (err, row) => {
    if (!row) db.run("INSERT INTO admin(username,password) VALUES(?,?)", ["admin","1234"]);
  });
});

// Routes
app.get('/', (req,res)=>res.sendFile(path.join(__dirname,'index.html')));

// ---------------- Tasks ----------------
app.get('/api/tasks', (req,res)=>db.all("SELECT * FROM tasks",[],(err,rows)=>res.json(rows)));
app.post('/api/tasks', (req,res)=>db.run("INSERT INTO tasks(title) VALUES(?)",[req.body.title],function(){res.json({id:this.lastID,title:req.body.title,completed:0});}));
app.put('/api/tasks/:id',(req,res)=>db.run("UPDATE tasks SET completed = 1 - completed WHERE id = ?",[req.params.id],()=>res.json({message:"Toggled"})));
app.delete('/api/tasks/:id',(req,res)=>db.run("DELETE FROM tasks WHERE id=?",[req.params.id],()=>res.json({message:"Deleted"})));

// ---------------- Projects ----------------
app.get('/api/projects',(req,res)=>db.all("SELECT * FROM projects",[],(err,rows)=>res.json(rows)));

// Add admin auth middleware
function auth(req,res,next){
  const token = req.headers['authorization'];
  if(token==='admin-token') next();
  else res.status(403).json({error:'Unauthorized'});
}

app.post('/api/projects', auth, (req,res)=>{
  const { title, desc, img } = req.body;
  db.run("INSERT INTO projects(title,desc,img) VALUES(?,?,?)",[title,desc,img],function(){res.json({id:this.lastID,...req.body});});
});

app.delete('/api/projects/:id', auth, (req,res)=>{
  db.run("DELETE FROM projects WHERE id=?",[req.params.id],()=>res.json({message:"Deleted"}));
});

// ---------------- Contact ----------------
app.post('/api/contact',(req,res)=>db.run("INSERT INTO contact_messages(name,email,message) VALUES(?,?,?)",[req.body.name,req.body.email,req.body.message],()=>res.json({message:"Message sent!"})));

app.get('/api/messages', auth, (req,res)=>db.all("SELECT * FROM contact_messages",[],(err,rows)=>res.json(rows)));
app.delete('/api/messages/:id', auth, (req,res)=>db.run("DELETE FROM contact_messages WHERE id=?",[req.params.id],()=>res.json({message:"Deleted"})));

// ---------------- Admin ----------------
app.post('/api/admin/login',(req,res)=>{
  const { username,password } = req.body;
  db.get("SELECT * FROM admin WHERE username=? AND password=?",[username,password],(err,row)=>{
    if(row) res.json({success:true, token:'admin-token'});
    else res.json({success:false, message:"Invalid credentials"});
  });
});

app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));
