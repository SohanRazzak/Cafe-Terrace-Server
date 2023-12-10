import express, { application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


// connect database


// basic code

app.get('/', (req, res)=>{
    res.send("Hello World!")
})

app.listen(port, ()=> console.log(`Server running on ${port}`))