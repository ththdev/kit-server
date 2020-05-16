import { gql, ApolloError } from 'apollo-server-express'
import { getRepository } from 'typeorm'

import Item from '../entity/Item'
import User from '../entity/User'
import Kit from '../entity/Kit'

export const typeDefs = gql`
    type Kit {
        id: ID!
        name: String!
        created_at: Date
		creator_id: String!
		items: [Item]
		member: User
    }

    extend type Query {
        kits: [Kit]
    }

    extend type Mutation {
        createKit(
			user_id: String!
            name: String!
        ): Boolean
        deleteKit(
			user_id: String!
            id: ID!
        ): Boolean
		appendToKit(
			user_id: String!
			Kit_id: String!
			item_id: String!
		): Boolean
    }
`

export const resolvers = {
	Kit: {
		member: async (parent: Kit) => {
			return parent.member
		},
		items: async (parent: Kit) => {
			const itemRepo = getRepository(Item)
			const items = itemRepo.find({
				relations: ["kit"],
				where: {
					kit: {
						id: parent.id
					}
				}
			})
			
			return items
		}
	},
    Query: {
        kits: async () => {
            const KitRepo = getRepository(Kit)
            const Kits = await KitRepo.find()
			
            return Kits
        }
    },
    Mutation: {
        createKit: async (_:any, args: any) => {
			const { user_id, name } = args;
            const KitRepo = getRepository(Kit)
			const userRepo = getRepository(User)
			const user = await userRepo.findOne(user_id, { relations: ["Kits"] })
			
			const exist = user.Kits.find(col => col.name == name)
			if (exist) throw new ApolloError('Kit Name exist');
			
			const member = await userRepo.findOne(user_id)
				
			const newKit = new Kit()
			newKit.creator_id = user_id
			newKit.name = name
			newKit.member = member
			
			await KitRepo.save(newKit)

			return true
        },
        deleteKit: async (_:any, args: any) => {
            const { user_id, id } = args;
            const KitRepo = getRepository(Kit)
            const kit = await KitRepo.findOne(id)

            if (!kit) throw new ApolloError('Could not find kit');
            if (user_id !== kit.creator_id) throw new ApolloError('You are not creator');

            await KitRepo.remove(kit)

            return true 
        },
		appendToKit: async (_:any, args: any) => {
			const { user_id, Kit_id, item_id } = args;
			const KitRepo = getRepository(Kit)
			const itemRepo = getRepository(Item)
			const userRepo = getRepository(User)
			
			// Check kit and item
			const kit = await KitRepo.findOne(Kit_id)
			const item = await itemRepo.findOne(item_id)
			if (!kit) throw new ApolloError('Cannot find Kit');
			if (!item) throw new ApolloError('Cannot find Item');
			
			// Check user
			const user = await userRepo.findOne(user_id)
			if (!user) throw new ApolloError('Cannot find User');
			if (user_id !== kit.creator_id) throw new ApolloError('You are not creator')
			
			item.kit = kit
			
			await itemRepo.save(item)
			
			return true
		}	
    }
}