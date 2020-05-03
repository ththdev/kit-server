import merge from 'lodash/merge'
import { makeExecutableSchema } from 'apollo-server-express'
import * as user from './user'
import * as item from './item'
import * as collection from './collection'

const schema = makeExecutableSchema({
  typeDefs: [user.typeDefs, item.typeDefs, collection.typeDefs],
  resolvers: merge(
	user.resolvers,
	item.resolvers,
	collection.resolvers
  )
});

export default schema
