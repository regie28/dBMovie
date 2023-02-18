/*import dotenv from 'dotenv';
dotenv.config();
import { connectDatabase } from "../pool.js";

const pool = connectDatabase();

class Comment {
    constructor(writer, postId, response_to, content){
        this.writer = writer;
        this.postId = postId;
        this.response_to = response_to;
        this.content = content;
    }

    static async create(comment) {
        const { writer, postId, response_to, content } = comment;
        const query = 'INSERT INTO comments (writer, post_id, response_to, content) VALUES ($1, $2, $3, $4) RETURNING id';
        const values = [writer, postId, response_to, content];

        const { rows } = await pool.query(query, values);

        return new Comment(writer, postId, response_to, content, rows[0].id);
      }
      static async findById(id) {
        const query = 'SELECT * FROM comments WHERE id = $1';
        const values = [id];
        const { rows } = await pool.query(query, values);
        if (rows.length === 0) {
          return null;
        }

        const { writer, post_id: postId, response_to: response_to, content } = rows[0];

        return new Comment(writer, postId, response_to, content, id);
      }

    static async delete(id, writer) {
      const query = 'DELETE FROM comments WHERE id = $1 AND writer = $2 RETURNING *';
      const values = [id, writer];

      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return null;
      }

      const { writer: deletedWriter, post_id: postId, response_to: responseTo, content } = rows[0];

      return new Comment(deletedWriter, postId, responseTo, content, id);
    }
  }

    export {
        Comment
    }*/