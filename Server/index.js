
const cors = require('cors');
var nodemailer = require('nodemailer');
const mysql = require('mysql2');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
const port = 3306;
app.use(express.json())

const Gemail = process.env.EMAIL;
const pwd = process.env.PWD;
// MySQL configuration
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });

const db = mysql.createConnection({
  host: 'bwb8u1x5x2gcqitylp1v-mysql.services.clever-cloud.com',
  user:'usajedrghqgmfjf1',
  password: 'FrP5K9mutf4VdnrmxRvF',
  database: 'bwb8u1x5x2gcqitylp1v'
});



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/vote', upload.single('image'), (req, res) => {
  const imageUrl = '/uploads/' + req.file.filename;
  const { name, email, mobile } = req.body;

  // You can save the name, email, mobile, and imageUrl to a database or any other storage

  const imgLink = req.protocol + '://' + req.get('host') + imageUrl;
  console.log(req.body)
  console.log(imgLink)


 // Create the table if it doesn't exist
 db.query(`
 CREATE TABLE IF NOT EXISTS votes (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   emails JSON NOT NULL,
   mobiles JSON NOT NULL,
   vote INT NOT NULL,
   imageLinks JSON
 )
`, (err) => {
 if (err) {
   console.error('Error creating table:', err);
   return res.status(500).json({ message: 'Internal server error' });
 }

 db.query("SELECT * FROM votes WHERE JSON_SEARCH(emails, 'one', ?) IS NOT NULL", [email], (err, result) => {
   if (err) {
     console.error('Error querying database:', err);
     return res.status(500).json({ message: 'Internal server error' });
   }

   if (result.length > 0) {
     res.json({ message1: 'Already used email' });
   } else {
     db.query('SELECT * FROM votes WHERE name = ?', [name], (err, result) => {
       if (err) {
         console.error('Error querying database:', err);
         return res.status(500).json({ message: 'Internal server error' });
       }

       if (result.length === 0) {
         const emails = [email];
         const mobiles = [mobile];
         const imageLinks = [imgLink];

         db.query('INSERT INTO votes (name, emails, mobiles, vote, imageLinks) VALUES (?, ?, ?, 1, ?)', [name, JSON.stringify(emails), JSON.stringify(mobiles), JSON.stringify(imageLinks)], (err, insertResult) => {
           if (err) {
             console.error('Error inserting new entry:', err);
             return res.status(500).json({ message: 'Internal server error' });
           }
           res.json({ message: 'New entry added with vote = 1' });
         });
       } else {
         const updatedVote = result[0].vote + 1;
         let emails, mobiles, imageLinks;

         try {
           emails = result[0].emails;
         } catch (error) {
           console.log(error);
           emails = [];
         }

         try {
           mobiles = result[0].mobiles;
         } catch (error) {
           console.log(error);
           mobiles = [];
         }

         try {
           imageLinks = result[0].imageLinks;
         } catch (error) {
           console.log(error);
           imageLinks = [];
         }

         if (!emails.includes(email)) {
           emails.push(email);
         }
         if (!mobiles.includes(mobile)) {
           mobiles.push(mobile);
         }
         if (imgLink) {
           imageLinks.push(imgLink);
         }

         db.query('UPDATE votes SET vote = ?, emails = ?, mobiles = ?, imageLinks = ? WHERE name = ?', [updatedVote, JSON.stringify(emails), JSON.stringify(mobiles), JSON.stringify(imageLinks), name], (err, updateResult) => {
           if (err) {
             console.error('Error updating entry:', err);
             return res.status(500).json({ message: 'Internal server error' });
           }
           res.json({ message: 'Entry updated with increased vote count' });
         });
       }
     });
   }
 });
});
});



 


db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});





 


// GET endpoint to retrieve all votes
app.get('/votes', (req, res) => {
  db.query('SELECT * FROM votes', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }
    res.json(results);
    console.log(results)
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
