import { gql, ApolloError } from 'apollo-server-express'
import { getRepository } from 'typeorm'

import Item from '../entity/Item'
import User from '../entity/User'
import Collection from '../entity/Collection'

export const typeDefs = gql`
    type Collection {
        id: ID!
        name: String!
        created_at: Date
		creator_id: String!
		items: [Item]
		member: User
    }

    extend type Query {
        collections: [Collection]
    }

    extend type Mutation {
        createCollection(
			user_id: String!
            name: String!
        ): Boolean
        deleteCollection(
			user_id: String!
            id: ID!
        ): Boolean
		appendToCollection(
			user_id: String!
			collection_id: String!
			item_id: String!
		): Boolean
    }
`

export const resolvers = {
	Collection: {
		member: async (parent: Collection) => {
			return parent.member
		},
		items: async (parent: Collection) => {
			const itemRepo = getRepository(Item)
			const items = itemRepo.find({
				relations: ["collection"],
				where: {
					collection: {
						id: parent.id
					}
				}
			})
			
			return items
		}
	},
    Query: {
        collections: async () => {
            const collectionRepo = getRepository(Collection)
            const collections = await collectionRepo.find()
			
            return collections
        }
    },
    Mutation: {
        createCollection: async (_:any, args: any) => {
			const { user_id, name } = args;
            const collectionRepo = getRepository(Collection)
			const userRepo = getRepository(User)
			const user = await userRepo.findOne(user_id, { relations: ["collections"] })
			
			const exist = user.collections.find(col => col.name == name)
			if (exist) throw new ApolloError('Collection Name exist');
			
			const member = await userRepo.findOne(user_id)
				
			const newCollection = new Collection()
			newCollection.creator_id = user_id
			newCollection.name = name
			newCollection.member = member
			
			await collectionRepo.save(newCollection)

			return true
        },
        deleteCollection: async (_:any, args: any) => {
            const { user_id, id } = args;
            const collectionRepo = getRepository(Collection)
            const collection = await collectionRepo.findOne(id)

            if (!collection) throw new ApolloError('Could not find collection');
            if (user_id !== collection.creator_id) throw new ApolloError('You are not creator');

            await collectionRepo.remove(collection)

            return true 
        },
		appendToCollection: async (_:any, args: any) => {
			const { user_id, collection_id, item_id } = args;
			const collectionRepo = getRepository(Collection)
			const itemRepo = getRepository(Item)
			const userRepo = getRepository(User)
			
			// Check collection and item
			const collection = await collectionRepo.findOne(collection_id)
			const item = await itemRepo.findOne(item_id)
			if (!collection) throw new ApolloError('Cannot find Collection');
			if (!item) throw new ApolloError('Cannot find Item');
			
			// Check user
			const user = await userRepo.findOne(user_id)
			if (!user) throw new ApolloError('Cannot find User');
			if (user_id !== collection.creator_id) throw new ApolloError('You are not creator')
			
			item.collection = collection
			
			await itemRepo.save(item)
			
			return true
		}	
    }
}