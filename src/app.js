const express=require("express");
const mongoose=require('mongoose');
const {config}=require("dotenv");
const bodyParser=require("body-parser");
config();

const bookRoutes=require('./routes/book.route');


//Usamos express para los middelware
const app=express();
app.use(bodyParser.json());



//Aca conectamos la base de datos
const port=process.env.PORT||3000;
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME})
    .then(() => console.log('Database connected successfully'))
    .catch((error) => console.error('Database connection error:', error));
const db=mongoose.connection;
app.use('/books',bookRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})