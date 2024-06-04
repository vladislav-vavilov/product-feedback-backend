import express from 'express'
import { ApolloServer } from '@apollo/server'
import resolvers from './resolvers.js'
import { expressMiddleware } from '@apollo/server/express4'
import { buildSubgraphSchema } from '@apollo/subgraph'
import gql from 'graphql-tag'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import cookieParser from 'cookie-parser'
import { authMiddleware } from './middlewares.js'

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser())

const typeDefs = gql(
	readFileSync(resolve(import.meta.dirname, 'schema.graphql'), {
		encoding: 'utf-8',
	})
)

const server = new ApolloServer({
	schema: buildSubgraphSchema({ typeDefs, resolvers }),
})

server.start().then(() => {
	app.use(
		'/graphql',
		express.json(),
		expressMiddleware(server, {
			context: async ({ req, res }) => {
				return { req, res, ...authMiddleware(req, res) }
			},
		})
	)
	app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
})
