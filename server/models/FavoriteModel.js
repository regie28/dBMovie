/*import dotenv from 'dotenv';
dotenv.config();
import { connectDatabase } from "../pool.js";

const pool = connectDatabase();

class Favorite {
  constructor(user_from, movie_id, movie_title, movie_post, movie_runtime, id) {
    this.user_from = user_from;
    this.movie_id = movie_id;
    this.movie_title = movie_title;
    this.movie_post = movie_post;
    this.movie_runtime = movie_runtime;
    this.id = id;
  }

  static async create(favorite) {
      const { user_from, movie_id, movie_title, movie_post, movie_runtime } = favorite;
      const query = 'INSERT INTO favorites (user_from, movie_id, movie_title, movie_post, movie_runtime) VALUES ($1, $2, $3, $4, $5) RETURNING id';
      const values = [user_from, movie_id, movie_title, movie_post, movie_runtime];

      const { rows } = await pool.query(query, values);

      return new Favorite(user_from, movie_id, movie_title, movie_post, movie_runtime, rows[0].id);
    }

    static async deleteById(id) {
      const query = 'DELETE FROM favorites WHERE id = $1';
      const values = [id];

      await pool.query(query, values);
    }

    static async findByUserAndMovie(user_from, movie_id) {
      const query = 'SELECT * FROM favorites WHERE user_from = $1 AND movie_id = $2';
      const values = [user_from, movie_id];

      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return null;
      }

      const { movie_title: movie_title, movie_post: movie_post, movie_runtime: movie_runtime, id } = rows[0];

      return new Favorite(user_from, movie_id, movie_title, movie_post, movie_runtime, id);
    }

    static async findByUser(user_from) {
      const query = 'SELECT * FROM favorites WHERE user_from = $1';
      const values = [user_from];
      const { rows } = await pool.query(query, values);

      return rows.map(({ user_from: user_from, movie_id: movie_id, movie_title: movie_title, movie_post: movie_post, movie_runtime: movie_runtime, id }) =>
        new Favorite(user_from, movie_id, movie_title, movie_post, movie_runtime, id)
      );
    }

    static async countByMovie(movie_id) {
      const query = 'SELECT COUNT(*) FROM favorites WHERE movie_id = $1';
      const values = [movie_id];

      const { rows } = await pool.query(query, values);
      return parseInt(rows[0].count);
    }
  }

  export {
      Favorite
  }
*/