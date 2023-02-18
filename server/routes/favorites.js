/*import { Router } from 'express';
import { Favorite } from "../models/FavoriteModel.js";

const favoriteRouter = Router();

favoriteRouter.post("/favoriteNumber", async (req, res) => {
    try {
      const subscribe = await Favorite.findAll({ where: { movieId: req.body.movie_id } });
      res.status(200).json({ success: true, subscribeNumber: subscribe.length });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  favoriteRouter.post("/favorited", async (req, res) => {
    try {
      const subscribe = await Favorite.findAll({
        where: { movieId: req.body.movie_id, userFrom: req.body.user_from }
      });
      let result = false;
      if (subscribe.length !== 0) {
        result = true;
      }
      res.status(200).json({ success: true, subscribed: result });
    } catch (err) {
      res.status(400).send(err);
    }
  });

  favoriteRouter.post("/addToFavorite", async (req, res) => {
    try {
      await Favorite.create(req.body);
      res.status(200).json({ success: true });
    } catch (err) {
      res.json({ success: false, err });
    }
  });

  favoriteRouter.post("/removeFromFavorite", async (req, res) => {
    try {
      const doc = await Favorite.destroy({ where: { movieId: req.body.movie_id, userFrom: req.body.user_from } });
      res.status(200).json({ success: true, doc });
    } catch (err) {
      res.status(400).json({ success: false, err });
    }
  });

  favoriteRouter.post("/getFavoredMovie", async (req, res) => {
    try {
      const favorites = await Favorite.findAll({ where: { userFrom: req.body.user_from } });
      res.status(200).json({ success: true, favorites });
    } catch (err) {
      res.status(400).send(err);
    }
  });

export {
  favoriteRouter
}*/