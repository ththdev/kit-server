import { gql, ApolloError } from 'apollo-server-express'
import { getRepository } from 'typeorm'
import User from '../entity/User'
import Collection from '../entity/Collection'
import * as collection from './collection'
import jwt from 'jsonwebtoken'

import { getGoogleProfile } from '../lib/social/google'

export const typeDefs = gql`
    type User {
        id: ID!
        name: String
		email: String
		profilePhoto: String
		isAdmin: Boolean
		strategy: String
        created_at: Date
		updated_at: Date
		collections: [Collection]
    }

    scalar Date

	type Token {
		token: String
		name: String
	}

    type Query {
        users: [User]
		userById(id: String): User
    }

    type Mutation {
        register(
			name: String!,
			email: String!,
			strategy: String!,
			isAdmin: Boolean,
			profilePhoto: String
		): Boolean
        editUser(id: ID!, name: String): User
        deleteUser(id: ID): Boolean
		googleLogin(
			name: String!,
			email: String!,
			googleId: String!,
			profilePhoto: String,
		): Token
    }
`

export const resolvers = {
	User: {
		collections: async (parent: User) => {
			const collectionRepo = getRepository(Collection)
			const collections = await collectionRepo.find({ 
				relations: ["member"],
				where: {
					member: {
						id: parent.id
					}
				}
			});
			
			return collections
		}	
	},
    Query: {
        users: async () => {
            const userRepo = getRepository(User);
            const users = await userRepo.find()
			
            return users
        },
		userById: async (_:any, args: any) => {
			const { id } = args;
			const userRepo = getRepository(User);
			const user = await userRepo.find(id);
			
			return user
		}
    },
    Mutation: {
        register: async (_:any, args: any) => {
            const {
				name,
				email,
				strategy,
				isAdmin,
				profilePhoto
			} = args;
            const userRepo = getRepository(User);
			const collectionRepo = getRepository(Collection)
			
			const newUser = new User();
			newUser.name = name;
			newUser.email = email;
			newUser.profilePhoto = profilePhoto;
			newUser.isAdmin = isAdmin;
			newUser.strategy = strategy;
			
			await userRepo.save(newUser)
			
			// Create Void Collection
			const createdUser = await userRepo.findOne({ name: name })
			
			const voidCollection = new Collection();
			voidCollection.name = "Void"
			voidCollection.creator_id = createdUser.id
			voidCollection.member = createdUser
			
			await collectionRepo.save(voidCollection);
			
            return true
        },
        editUser: async(_:any, args: any) => {
            const { id, name, email, gender } = args;
            const userRepo = getRepository(User);
            const user = await userRepo.findOne(id);
            if(!user) throw new ApolloError('Could not find user');

            user.name = name

            await userRepo.save(user)
            const updatedUser = await userRepo.findOne(id)
            return updatedUser
        },
        deleteUser: async (_:any, args: any) => {
            const { id } = args;
            const userRepo = getRepository(User)
            const user = await userRepo.findOne(id)

            if (!user) throw new ApolloError('Could not find user')

            await userRepo.remove(user);
            return true 
        },
		googleLogin: async (_:any, args: any) => {
			const { name, email, googleId, profilePhoto } = args;
			const userRepo = getRepository(User);
			const exist = await userRepo.findOne({ email: email, googleId: googleId });
			
			// Login Process
			if (exist) {
				const token = jwt.sign({
					id: exist.id,
					exist: 3000
				}, process.env.PRIVATE_KEY);
				
				return token
			} 
			
			// Register Process
			const newUser = new User();
			newUser.name = name;
			newUser.email = email;
			newUser.profilePhoto = profilePhoto;
			newUser.googleId = googleId;
			newUser.strategy = "Google"
			
			try {
				await userRepo.save(newUser);
				
				const registered = await userRepo.findOne({ googleId });
				const token = jwt.sign({
					id: registered.id,
					exist: 3000
				}, process.env.PRIVATE_KEY);
				
				return token
			} catch (e) {
				
			}
			
			
			throw new ApolloError('You need to register');
		}
    }
}