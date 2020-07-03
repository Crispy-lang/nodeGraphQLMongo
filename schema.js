import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInt,
} from 'graphql'

import User from './model'
import subscriptions from './subscriptions/index'


exports UserType = new GraphQLObjectType({
	name: 'User',
	fields:{
		id: {
			type: GraphQLID
		},
		firstName:{
			type: GraphQLString,
			resolve: (root) => {
				return root.first_name
			}
		},
		lastName: {
			type: GraphQLString,
			resolve: (root) => {
				return root.last_name
			}
		},
		dateOfBirth: {
			type: GraphQLString,
			resolve: (root) =>{
				return root.dob
			}
		},
		email: { 
			type: GraphQLString,
			resolve: (root) => {
				return root.email
			}
		 },
		 age: {
		 	type: GraphQLString
		 }
	}
})



const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'This is the Root Query',
	fields: {
		users: {
			type: GraphQLList(UserType),
			resolve: (root, args, context, info) =>  {
				return User.find().exec()
			}
		},
		user: {
			type: GraphQLList(UserType),
			args: {
				email: { type: GraphQLNonNull(GraphQLString) },
			},
			resolve: ( _, args, context, info ) =>{
				return User.find({email: args.email}).exec()
			}
		}

	} 
})


const mutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "...",
	fields:{
		addUser:{
			type: UserType,
			args:{
				first_name: { type: GraphQLNonNull(GraphQLString) },
				last_name: { type: GraphQLNonNull(GraphQLString), resolve: (root) => root.first_name },
				email: { type: GraphQLNonNull(GraphQLString) },
				age: { type: GraphQLNonNull(GraphQLInt) },
				dob: { type: GraphQLNonNull(GraphQLString) }
			},
			resolve: (root, args, context, info) => {				
				const person = User(args)
				return person.save()
			}
		},updateUser:{
			type: UserType,
			args:{
				id: {type: GraphQLNonNull(GraphQLID)},
				first_name: {type: GraphQLString},
				last_name: {type: GraphQLString},
				age: {type: GraphQLInt},
				email: {type: GraphQLString}
			},
			resolve: (root, args, context, info) => {
				const {id, ...update} = args
				return new Promise((resolve, reject) =>{
					User.findByIdAndUpdate(id, update,{new: true},(err, user) => {
						if(err) throw new Error('Err Exist')
						resolve(user)
					})
				})
			}
		},deleleUser: {
			type: GraphQLString,
			args: {
				id: { type: GraphQLNonNull(GraphQLString) }
			},
			resolve: (root, args, context, info) => { 
				return new Promise((resolve, reject) =>{
					User.deleteOne({_id: args.id}, function(err, delUser){
						if (err) reject(err)
						resolve('User deleted')
					})
				})
			}
		}
	}
})

const subscription = new GraphQLObjectType({
	name: 'Subscriptions',
	description: '...',
	fields: subscriptions
})


export default new GraphQLSchema({
	query: QueryType,
	mutation: mutationType,
	subscription: subscription
})