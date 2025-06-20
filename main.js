const express = require('express');
const userRouter = require('./users/user.route');
const blogRouter = require('./blogs/blogs.route');    
const authRouter = require('./auth/auth.route');
const isAuth = require('./middlewares/isAuth');
const cors = require('cors');
const upload = require('./config/cloudinary.config');
const dotenv = require('dotenv');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swagger = require('./docs/swagger');
const connectToDb = require('./db/connectToDb');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const app = express();

app.use(errorHandler);

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));


app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/blogs', isAuth, blogRouter); 

app.post('/upload', upload.single('image'), (req, res) => {
  res.send(req.file);
});


const specs = swaggerJSDoc(swagger);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));




const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDb();
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
};

startServer();
