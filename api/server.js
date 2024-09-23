const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const bodyParser=require('body-parser')

const app=express()
dotenv.config()
const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth',require('./routes/auth'))


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})