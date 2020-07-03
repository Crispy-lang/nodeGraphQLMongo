import express from 'express'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import logger from 'morgan'
import mongoose from 'mongoose'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import schema from './schema.js'


const app = express()

// Mongo DB URL 
const mongoDB = "mongodb://127.0.0.1:27017/music"

//Connectiong to the database
mongoose.connect(mongoDB,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function(){
	console.log('DB connected Successfully')
})

// Start a connection
const db = mongoose.connection

db.on('orrer', console.error.bind(console, 'Mongo DB connection Error'))

// Add logging middleware
app.use(logger('dev'))

// Add body parser
app.use(bodyParser.json())

// Add GraphQL
app.use('/graphql', graphqlExpress({
	schema,
}))

app.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql'
}))

app.get('/index', function(req, res){
	res.status(201).json({
		message: "Index Page"
	})
})

let port = 2345

const server = createServer(app)

server.listen(port, err => {
	if(err) throw err
	console.log('App running on port:', port)
})