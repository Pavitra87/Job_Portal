const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const bodyParser=require('body-parser')

const app=express()
dotenv.config()
const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth',require('./routes/authRoutes'))
app.use('/api/jobProvider',require('./routes/jobProviderRoutes'))
app.use('/api/jobSeeker',require('./routes/jobSeekerRoutes'))
app.use('/api/jobCategory',require('./routes/jobCategoryRoutes'))
app.use('/api/jobListings',require('./routes/jobListingRoutes'))
app.use('/api/jobApplications',require('./routes/jobApplicationRoutes'))
app.use('/api/searching',require('./routes/jobSearchRoute'))


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})


//inapp