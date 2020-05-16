import { gql, ApolloError } from 'apollo-server-express'
import { getRepository } from 'typeorm'
import User from '../entity/User'
import Kit from '../entity/Kit'
import * as kit from './kit'
import jwt from 'jsonwebtoken'
import { decode } from 'punycode'

export const typeDefs = gql`
    type User {
        id: ID!
        name: String
		email: String
		kakaoId: String,
		googleId: String,
		profileImage: String
		isAdmin: Boolean
        created_at: Date
		updated_at: Date
		Kits: [Kit]
    }

    scalar Date

	type Token {
		token: String
	}

    type Query {
        users: [User]
		userById(id: String!): User
		currentUser(token: String!): User
    }

    type Mutation {
        register(name: String!, email: String!, password: String!, isAdmin: Boolean, profileImage: String): Token,
        editUser(id: ID!, name: String): User
        deleteUser(id: ID): Boolean
		googleLogin(name: String!, email: String, googleId: String!, profileImage: String): Token
		kakaoLogin(name: String!, email: String, kakaoId: String!, profileImage: String): Token
    }
`

export const resolvers = {
	User: {
		Kits: async (parent: User) => {
			const KitRepo = getRepository(Kit)
			const Kits = await KitRepo.find({ 
				relations: ["member"],
				where: {
					member: {
						id: parent.id
					}
				}
			});
			
			return Kits
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
		},
		currentUser: async (_:any, args: any) => {
			const { token } = args;
			const userRepo = getRepository(User);
			
			// desieralize token
			const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
			const user = await userRepo.findOne({ id: decoded.id });

			if (!user) return new ApolloError("Can't find user");

			return user
		}
    },
    Mutation: {
        register: async (_:any, args: any) => {
            const { name, email, password, isAdmin, profileImage } = args;
            const userRepo = getRepository(User);
			
			const newUser = new User();
			newUser.name = name;
			newUser.email = email;
			newUser.password = password;
			newUser.profileImage = profileImage;
			newUser.isAdmin = isAdmin;

			try {
				await userRepo.save(newUser);

				const registered = await userRepo.findOne({ email });
				const token = jwt.sign({
					id: registered.id,
					exist: 3000
				}, process.env.PRIVATE_KEY);

				return token
			} catch (e) {
				throw new ApolloError("Sorry, Can't Register");
			}
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
			const { name, email, googleId, profileImage } = args;
			const userRepo = getRepository(User);
			const exist = await userRepo.findOne({ googleId });

			// Login Process
			if (exist) {
				const token = jwt.sign({
					id: exist.id,
					exist: 3000
				}, process.env.PRIVATE_KEY);

				return { token }
			}

			// Register Process
			const newGoogleUser = new User();
			newGoogleUser.name = name;
			newGoogleUser.email = email;
			newGoogleUser.profileImage = profileImage;
			newGoogleUser.googleId = googleId

			try {
				await userRepo.save(newGoogleUser);

				const registered = await userRepo.findOne({ googleId });
				const token = jwt.sign({
					id: registered.id,
					exist: 3000
				}, process.env.PRIVATE_KEY);

				return { token }
			} catch (e) {
				throw new ApolloError("Sorry, Can't Register");
			}
		},
		kakaoLogin: async (_:any, args: any) => {
			const { name, email, kakaoId, profileImage } = args;
			const userRepo = getRepository(User);
			const exist = await userRepo.findOne({ kakaoId });

			// Login Process
			if (exist) {
				const token = jwt.sign({
					id: exist.id,
					exist: 3000
				}, process.env.PRIVATE_KEY);

				return { token }
			}

			// Register Process
			const newKakaoUser = new User();
			newKakaoUser.name = name;
			newKakaoUser.email = email;
			newKakaoUser.profileImage = profileImage;
			newKakaoUser.kakaoId = kakaoId

			try {
				await userRepo.save(newKakaoUser);

				const registered = await userRepo.findOne({ kakaoId });
				const token = jwt.sign({
					id: registered.id,
					exist: 3000
				}, process.env.PRIVATE_KEY);

				return { token }
			} catch (e) {
				throw new ApolloError("Sorry, Can't Register");
			}
		}
    }
}