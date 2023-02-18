/*import dotenv from 'dotenv';
dotenv.config();
import { connectDatabase } from "../pool.js";

const pool = connectDatabase()

class DisLike {
  constructor(user_id, comment_id){
    this.user_id = user_id;
    this.comment_id = comment_id;
  }

  async save(){
    const query = {
      text : 'INSERT INTO dislike (user_id, comment_id) VALUES ($1, $2) RETURNING *',
       values : [this.user_id, comment_id]
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  static async deleteLike(id){
    const query = {
      text: 'DELETE FROM dislike WHERE id = $1 RETURNING *',
      values : [id]
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  static async getLikeById(id){
    const query = {
      text: 'SELECT * FROM dislike WHERE id = $1',
      values: [id]
    }
    const { rows } = await pool.query(query);
    return rows[0];
  }
}

export {
  DisLike
}*/