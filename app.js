import express from "express";
import env from "dotenv";
import expressLayout from "express-ejs-layouts";
import methodOverride from "method-override";
import mainRoutes from './server/routes/main.js';
import Adminroutes from './server/routes/admin.js';
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
// import connectDB from "./server/config/db.js";
import { jai, connectDB } from "./server/config/db.js";
import bodyParser from "body-parser";
import session from "express-session";
import isActiveRoute from "./server/config/routeHelper.js";
const app = express();
env.config();
const PORT = process.env.PORT; // Correctly assign PORT value  


//process.env.PORT ||
jai();
connectDB();


// Static files in the public folder  
app.use(express.static('public'));

// Set up templating engine  
app.use(expressLayout);
app.set('layout', './layouts/main');

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;



console.log("hey");

//connect to db

//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
//method override
app.use(methodOverride('_method'));

//cookie parser
app.use(cookieParser());
//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

// Use main routes  
app.use('/', mainRoutes);
app.use('/', Adminroutes);


// Start listening on the specified port  
app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});


// // Error handling middleware (optional but recommended)  
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });