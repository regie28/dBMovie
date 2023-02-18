import { Router } from 'express';
import { Like } from "../models/LikesModel.js";
import { DisLike } from "../models/DislikeModel.js";
const likeRouter = Router();

likeRouter.post("/getLikes", async (req, res) => {
  let variable = {}
  if (req.body.movieId) {
    variable = { movie_id: req.body.movieId }
  } else {
    variable = { comment_id: req.body.commentId }
  }

  try {
    const likes = await Like.find(variable).exec();
    res.status(200).json({ success: true, likes });
  } catch (err) {
    res.status(400).send(err);
  }
});

likeRouter.post("/getDislikes", async (req, res) => {
  let variable = {}
  if (req.body.movieId) {
    variable = { movie_id: req.body.movieId }
  } else {
    variable = { comment_id: req.body.commentId }
  }

  try {
    const dislikes = await DisLike.find(variable).exec();
    res.status(200).json({ success: true, dislikes });
  } catch (err) {
    res.status(400).send(err);
  }
});

likeRouter.post("/upLike", async (req, res) => {
    let variable = {}
    if (req.body.movieId) {
      variable = { movie_id: req.body.movieId, user_id: req.body.userId }
    } else {
      variable = { comment_id: req.body.commentId, user_id: req.body.userId }
    }


    const like = new Like(variable);

    try {
      await like.save();
      await DisLike.findOneAndDelete(variable).exec();
      res.status(200).json({ success: true });
    } catch (err) {
      res.json({ success: false, err });
    }
  });


  likeRouter.post("/unLike", async (req, res) => {
  let variable = {}
  if (req.body.movieId) {
    variable = { movie_id: req.body.movieId, user_id: req.body.userId }
  } else {
    variable = { comment_id: req.body.commentId, user_id: req.body.userId }
  }

  try {
    const result = await Like.findOneAndDelete(variable).exec();
    if (result) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Document not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
});

likeRouter.post("/upDislike", async (req, res) => {
    const { movieId, userId, commentId } = req.body;
    const variable = movieId ? { movieId, userId } : { commentId, userId };
    try {
      const disLike = new Dislike(variable);
      disLike.save((err) => {
        if (err) return res.json({ success: false, err });
        Like.findOneAndDelete(variable)
          .exec((err) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true })
          })
      })
    } catch (err) {
      res.json({ success: false, err });
    }
  });

export {
  likeRouter
}

