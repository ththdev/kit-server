import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import schema from './graphql/schema'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import cors from 'cors'

import indexRouter from './routes/api'
import authRouter from './routes/api/auth'

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(morgan("dev"))
app.use(session({ secret: 'mysecret' }))
app.use('*', cors());

// routes
app.use('/', indexRouter);
app.use('/', authRouter);

// ApolloServer
const apollo = new ApolloServer({
	schema,
});

apollo.applyMiddleware({ app });

export default app;




