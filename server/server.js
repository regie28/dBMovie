import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { auth } from "./middleware/auth.js";
import { isAdmin } from "./middleware/isAdmin.js";
import { corsOptions } from "./config/corsOptions.js";
import { generateJWT } from "./jwt/jwtGenerator.js";
import bcrypt from "bcryptjs";
//import { userRouter } from './routes/user.js';
//import { commentRouter } from './routes/comment.js';
//import { likeRouter } from './routes/likes.js';
//import { favoriteRouter } from './routes/favorites.js';
import dotenv from 'dotenv';
import { connectDatabase } from "./pool.js";
dotenv.config();

const app = express();
const pool = connectDatabase();


app.get("/",(req, res) => {
    res.send("<h1 style='text-align: center'>Test</h1>");
})

app.use(cors({ corsOptions }));
app.use(express.json()); //req.body
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(helmet.contentSecurityPolicy({directives: { "img-src":["'self'"],},}));
app.use(helmet.frameguard({action: 'deny'}));
app.use(helmet.xssFilter());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));


if(process.env.NODE_ENV === 'production'){

    app.use(express.static("client/build"));
}

app.get("/",(req, res) => {
    res.send("<h1 style='text-align: center'>Test</h1>");
})

//Routes

//Login User
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query(
            "SELECT * FROM public.users WHERE email = $1",[email]
        );
        if (user.rows.length === 0 ){
            return res.status(401).json("Email or Password doesn't match")
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if(!validPassword){
            return res.status(401).json("Email or Password doesn't match");
        }

        const token = generateJWT(user.rows[0]);
       res.cookie("access_token",token, {
            httpOnly: true,
        });
        return res.json({token});
        } catch (error){
            console.log(error);
            res.status(500).send({
                message: "Unathorized",
            });
        }
    });

//Add New User/Register New User
app.post('/api/users/register', async(req, res) => {
    try {
        const { fname, lname, email, password } = req.body;

        const emailExist = await pool.query(
            `SELECT * FROM public.users WHERE email = $1`,[email]
        );
        if(emailExist.rows.length !== 0){
            return res.status(401).json("Email already exists");
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password, salt);

        //Add User to Database
        const newUser = await pool.query(`
        INSERT INTO public.users(fname, lname, email, password)
        VALUES ($1, $2, $3, $4) RETURNING *`,[fname, lname, email, hashedPassword]
        );
        //Generate Token
        const accessToken = generateJWT(newUser.rows[0]);
        console.log("Access Token", accessToken);

        //Refresh Token
        //const refreshToken = refreshToken(newUser.rows[0]);
        //console.log("Refresh Token", refreshToken);

        res.cookie("access_token", accessToken,{
            httpOnly: true,
        }).json({accessToken})
    } catch(error){
        console.log(error);
        res.status(500).send(error.message);
    }
});

// Update User Account Information
app.put('/api/users/update/:id', auth, async (req, res) => {
    try {
      const { id } = req.params;
      const { fname, lname, email, password } = req.body;

      const user = await pool.query(`SELECT * FROM public.users WHERE id = $1`, [id]);

      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
          // Check if the current user is the account owner or an admin
    if (req.user.id !== user.rows[0].id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to update this user account' });
      }

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query(`
        UPDATE public.users
        SET fname=$1, lname=$2, email=$3, password=$4
        WHERE id=$5`,
        [fname, lname, email, hashedPassword, id]
      );

      res.status(200).json({ message: 'User account updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  });

//Verify User
app.get('/api/users/auth', auth, async(req, res, next)=> {
    try {
        res.json({
            authenticated: true,
            role: req.user.role,

        });
    } catch (error){
        console.log(error);
        res.status(500).sendStatus({
            message: "Unauthorized",
        })
    }
});

//Get User Profile
app.get('/api/users/profile/:id', auth, async(req, res) => {
    try{
        const user =await pool.query(
            `SELECT * FROM public.users WHERE id = $1`,[req.params.id]
        );
        res.json(user.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Unauthorized",
        })
    }
});

//Get All Users
app.get('/api/users/list', auth, isAdmin, async(req, res) => {
    try {
        const user = await pool.query(
            `SELECT fname, email FROM public.users`,
        );
        return res.json(user.rows);
    } catch (error){
        console.log(error);
        res.status(500).send({
            message: "Error retrieving Users",
        });
    }
});

//Logout User
app.get('/api/users/logout', (req, res) => {
    try{
        res.clearCookie("access_token", null).send({
            authenticated: false,
            message: "Logout successfully",
        });
    } catch(error){
        console.log(error);
    }
});


//Create/Add Comment
app.post('/api/comment/add', async (req, res, next) => {
    try {
      const { post_id, content, response_to } = req.body;
      const writer_id = req.user.id;
      const comment_date = new Date();

      const addComment = await pool.query(
        `INSERT INTO public.comment (writer_id, post_id, content, response_to, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [writer_id, post_id, content, response_to, comment_date]
      );

      const commentId = addComment.rows[0].id;

      res.json({ id: commentId });
    } catch(error) {
      console.log(error);
      res.status(500).send("Unauthenticated");
    }
  });

//Read/View All Comments
app.get('/api/comment/view/:id', async (req, res) => {
    try{
        const commentView = await pool.query(
            `SELECT * FROM public.comment`
        );
        res.status(200).json(commentView.rows);
    } catch(error) {
        console.log(error.message);
        res.status(500).send({
            message: "Unauthenticated"
        })
    }
});

//Update Comment
app.put('/api/comment/update/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment_update = req.params.updatedAt
        console.log("Updated: ",comment_update)

        const commentUpdate = await pool.query(
            `UPDATE public.comment SET content = $1, WHERE id = $2`,
            [content, id, comment_update]
        );
        if(commentUpdate.rowCount === 0){
            return res.status(404).json({
               error:"Comment not found or user is not authorized to update this comment"
            });
        }
        res.status(200).send(commentUpdate.rows)
    } catch (error){
        console.error(error.message);
    }
});

//Delete Comment
app.delete('/api/comments/:id', auth, async(req, res)=> {
    try {
        const  { id } = req.params;
        const { writer_id } = req.user;
        const deleteComment = await pool.query(
            `DELETE FROM public.comment WHERE id = $1 AND writer_id = $2`,[id, writer_id]
        );
        if(deleteComment.rowCount === 0){
            return res.status(403).json("You are not authorized to delete this comment!");
        }
        res.json({ message: "Comment deleted successfully"});
    } catch(error){
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

//app.get('/api/likes',)

//Create a favorite
app.post('/api/favorite/add', auth, async(req, res, next) => {
    try {
        const {
            movie_id,
            movie_title,
            movie_post,
            movie_runtime
        } = req.body

        const user_id = req.user.id
        const favoriteDate = new Date()
        console.log("Date: ", favoriteDate);

        const addFavorites = await pool.query(
            `INSERT INTO public.favorite(user_from, movie_id, movie_title, movie_post, movie_runtime, created_at)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,[user_id, movie_id, movie_title, movie_post, movie_runtime, favoriteDate]
        )
        res.json(addFavorites.rows[0])
    } catch (error){
        console.log(error);
        console.error(error.message);
    }
});

//Read/View all favorites
app.get('/api/favorites/:id', auth, async (req, res) => {
    try {
        const favoritesList = await pool.query(
            `SELECT * FROM favorites WHERE id = $1`,[req.favorites.id]
        );
        res.status(200).json(favoritesList.rows);
        }catch (error){
        console.error(err.message);
    }
});

//Update Favorite List
app.put('api/favorites/update', auth, async(req, res) => {
    try {
        const { id } = req.params;
        const { movie_id } = req.body;

        const user_from = req.user.id
        const updateList = new Date();
        console.log("Date updated: " + updateList)
        const updateFavorites = await pool.query(
            `UPDATE public.favorites SET movie_id = $1 WHERE id = $2`,
            [id, user_from, movie_id, updateList]
        );
        if(updateFavorites.rows.length === 0){
            return res.json(
                "You are not to update this comment"
            );
        }
        res.status(200).send(updateFavorites.rows);
    } catch (error){
    console.error(err.message);
}
});

app.delete('api/favorites/:id', auth, async(req, res) => {
        try {
            const { id } = req.params;
            const { user_from } = req.user;
            const deleteMovielist = await pool.query(
                `DELETE FROM public.favorites WHERE id = $1 AND user_from = $2`,[id, user_from]
            );
            if(deleteMovielist.rows.length === 0){
                return res.json("You are not authorized to delete this!");
            }
        } catch(error){
            console.error(err.message);
        }
    });

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});




export {
    app
}