import express from 'express'
import logger from 'morgan'
import mongoose from 'mongoose'
import graphQLHTTP from 'express-graphql'
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

// Add GraphQL
app.use('/graphql', graphQLHTTP({
	schema,
	graphiql: true
}))

app.get('/index', function(req, res){
	res.status(201).json({
		message: "Index Page"
	})
})

let port = 2345

app.listen(port, ()=> {
	console.log('App running on port:', port)
})