import mongoose from "mongoose";

const jai = () => {
        console.log("jai mata di");
    }
    // const anotherFunction = () => {
    //     // Implementation of another function  
    // };
const connectDB = async() => {

    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {


        });
        console.log(`DataBase connected: ${ conn.connection.host }`);

        console.log('Database connected successfully');
    } catch (error) {
        console.log(error)
    }
}


// async function connectToDatabase() {
//     try {
//         await mongoose.connect('mongodb://username:password@localhost:27017/mydatabase', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds  
//         });
//     } catch (err) {
//         console.error('Database connection error:', err);
//     }
// // }

// connectToDatabase();



export { connectDB, jai };