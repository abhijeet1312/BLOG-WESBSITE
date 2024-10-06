// import express from "express";
import { Router } from "express";
const router = Router();
import Post from "../model/Post.js";
import Contact from "../model/contact.js";





//definitton of routes will be starting from here

//get home routes 
router.get('', async(req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }

});


//get post routes by id

router.get('/post/:id', async(req, res) => {

    try {
        let slug = req.params.id


        const data = await Post.findById({ _id: slug });
        const locals = {
            title: data.title,
            description: data.body,
        }

        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error);
    }

});


//post search item

router.post('/search', async(req, res) => {

    try {
        const locals = {
            title: "search",
            description: "simple blog creates with nodejs ",
        }

        let searchTerm = req.body.searchTerm;
        console.log(searchTerm);

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const data = await Post.find({
            $or: [{
                    title: { $regex: new RegExp(searchNoSpecialChar, 'i') }
                },
                {
                    body: { $regex: new RegExp(searchNoSpecialChar, 'i') }
                }
            ]
        });

        res.render("search", { data, locals })



    } catch (error) {
        console.log(error);
    }

});
router.get('/about', (req, res) => {
    res.render('about', { currentRoute: "/about" });
});
router.get('/contact', (req, res) => {
    res.render('contact', { currentRoute: "/contact" });
});
router.get('/admin', (req, res) => {
    res.render('admin', { currentRoute: "/admin" });
});
router.post('/send-message', async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    try {

        console.log(req.body);
        const name1 = req.body.name;
        const email1 = req.body.email;
        const message1 = req.body.message;
        try {
            const newContact = new Contact({
                username: name1,
                email: email1,
                message: message1
            });

            await Contact.create(newContact);
            res.redirect("/contact");

        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }

    res.render('contact', { currentRoute: "/contact" });
});

export default router;








// function insertPostData() {
//     Post.insertMany([{
//             title: "Building a blog",
//             body: "This is the body text"

//         },
//         {
//             title: "Deployment of Node.js applications",
//             body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//         },
//         {
//             title: "Authentication and Authorization in Node.js",
//             body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//         },
//         {
//             title: "Understand how to work with MongoDB and Mongoose",
//             body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//         },
//         {
//             title: "build real-time, event-driven applications in Node.js",
//             body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//         },
//         {
//             title: "Discover how to use Express.js",
//             body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//         },
//         {
//             title: "Asynchronous Programming with Node.js",
//             body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//         },
//         {
//             title: "Learn the basics of Node.js and its architecture",
//             body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//         },
//         {
//             title: "NodeJs Limiting Network Traffic",
//             body: "Learn how to limit netowrk traffic."
//         },
//         {
//             title: "Learn Morgan - HTTP Request logger for NodeJs",
//             body: "Learn Morgan."
//         },

//     ])
// }

// insertPostData();