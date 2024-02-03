const express = require('express');
const cors = require('cors');
const blogRouter = require('./src/blogRouter');

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(blogRouter);

const PORT = 8000;

app.listen(PORT, (error) =>{
        if(!error)
            console.log("Server is Successfully Running, and App is listening on port "+ PORT)
        else
            console.log("Error occurred, server can't start", error);
    }
);


// CREATE TABLE blog (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(100) UNIQUE NOT NULL,
//     filePath VARCHAR(100) UNIQUE NOT NULL,
//     top_2_lines VARCHAR(200) NOT NULL,
//     created_at TIMESTAMP NOT NULL
// )
