import merge from 'lodash/merge'
import { makeExecutableSchema } from 'apollo-server-express'
import * as user from './user'
import * as item from './item'
import * as kit from './kit'

const schema = makeExecutableSchema({
  typeDefs: [user.typeDefs, item.typeDefs, kit.typeDefs],
  resolvers: merge(
	user.resolvers,
	item.resolvers,
	kit.resolvers
  )
});

export default schema
