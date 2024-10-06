// import express from "express";
import { Router } from "express";
const router = Router();
import Post from "../model/Post.js";
import User from "../model/User.js";
const adminLayout = "../views/layouts/admin"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;



//check login function

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' })
    }
}







// get admin login

router.get("/admin", async(req, res) => {

    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog creater with Nodejs,express and mongodb"
        }

        // const data= await Post.find();
        res.render('admin/index', { locals, layout: adminLayout });

    } catch (err) {
        console.log(err);
    }
});

//admin login


router.post("/admin", async(req, res) => {

    try {
        const username1 = req.body.username;
        const password = req.body.password;
        console.log(username1 + "  AND  " + password);
        const user = await User.find({ username: username1 })
        console.log(user[0].password);
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentiails" })
        }

        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentiails" })
        }
        console.log(process.env.JWT_SECRET)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });

        res.redirect("/dashboard")


    } catch (err) {
        console.log(err);
    }
});


//  post  admin register 

router.post("/register", async(req, res) => {

    try {
        const username = req.body.username;
        const password = req.body.password;

        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: "user created" });

        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: "user already in use" })
            }
            res.status(500).json({ message: "Internal servor error" })
        }




    } catch (err) {
        console.log(err);
    }
});


//get check login

router.get("/dashboard", authMiddleware, async(req, res) => {
    try {

        const locals = {
            title: "Dashboard",
            description: "Simple Blog creater with Nodejs,express and mongodb"
        }
        const data = await Post.find({});
        res.render("admin/dashboard", {
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
})

//get admin add new post
router.get("/add-post", authMiddleware, async(req, res) => {
        try {

            const locals = {
                title: "Add Post",
                description: "Simple Blog creater with Nodejs,express and mongodb"
            }
            const data = await Post.find({});
            res.render("admin/add-post", {
                locals,
                data,
                layout: adminLayout
            });
        } catch (error) {
            console.log(error);
        }
    })
    //admin add new post post method

router.post("/add-post", authMiddleware, async(req, res) => {
        try {

            console.log(req.body);
            try {
                const newPost = new Post({
                    title: req.body.title,
                    body: req.body.body,
                });

                await Post.create(newPost);
                res.redirect("/dashboard");

            } catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    })
    // edit post get 
router.get('/edit-post/:id', authMiddleware, async(req, res) => {
    try {

        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        };

        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }

});





// admin edit post using put route

router.put("/edit-post/:id", authMiddleware, async(req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }
})

/// admin delete post

router.delete('/delete-post/:id', authMiddleware, async(req, res) => {

    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }

});

// admin logout

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
});


export default router;