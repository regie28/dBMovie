/*import { DataTypes, Model } from 'sequelize';
import { connectDatabase } from '../pool.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const pool = connectDatabase();

const saltRounds = 10;

class User extends Model {
  async hashPassword() {
    if (!this.password) return;

    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }

  generateToken() {
    const token = jwt.sign(this.email, process.env.JWT_SECRET_KEY,{expiresIn: "1hr"});
    this.token = token;
    return token;
  }
}

User.init({
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  fname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
  },
  token: {
    type: DataTypes.STRING,
  },
  tokenExp: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
});

User.beforeSave(async (user, options) => {
  if (user.changed('password')) {
    await user.hashPassword();
  }
});

User.findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

User.findById = async (id) => {
  return await User.findOne({ where: { id } });
};

User.findByToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY,{expiresIn: "1hr"});
  return await User.findOne({ where: { email: decoded, token } });
};

User.deleteById = async (id) => {
  await User.destroy({ where: { id } });
};

export { User };




import dotenv from 'dotenv';
dotenv.config();
import { connectDatabase } from "../pool.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const pool = connectDatabase();

const saltRounds = 10;

class User {
  constructor({ fname, lname, email, password, role = 0, image, token, tokenExp }) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.password = password;
    this.role = role;
    this.image = image;
    this.token = token;
    this.tokenExp = tokenExp;
  }

  async save() {
    const query = {
      text: 'INSERT INTO users(fname, lname, email, password, role, image, token, tokenExp) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      values: [this.fname, this.lname, this.email, this.password, this.role, this.image, this.token, this.tokenExp]
    };

    const { rows } = await pool.query(query);
    return rows[0];
  }

  async hashPassword() {
    if (!this.password) return;

    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async comparePassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }

  generateToken() {
    const token = jwt.sign(this.email, process.env.JWT_SECRET_KEY,{expiresIn: "1hr"});
    this.token = token;
    return token;
  }

  static async findByEmail(email) {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email]
    };

    const { rows } = await pool.query(query);
    return rows[0];
  }

  static async findById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    };

    const { rows } = await pool.query(query);
    return rows[0];
  }

  static async findByToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY,{expiresIn: "1hr"});
    const query = {
      text: 'SELECT * FROM users WHERE email = $1 AND token = $2',
      values: [decoded, token]
    };

    const { rows } = await pool.query(query);
    return rows[0];
  }

   static async deleteById(id){
        const query = {
            text: 'DELETE FROM users WHERE id = $1',
            values: [id]
        };

        await pool.query(query);
  }
}

export {
    User
}*/