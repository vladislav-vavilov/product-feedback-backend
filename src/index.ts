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
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

console.log(process.env.MONGODB_URI)

app.use(express.json())
app.use(cookieParser())

const typeDefs = gql(
	readFileSync(resolve(import.meta.dirname, '../src/schema.graphql'), {
		encoding: 'utf-8',
	})
)

const server = new ApolloServer({
	// @ts-ignore
	schema: buildSubgraphSchema({ typeDefs, resolvers }),
})

const start = async () => {
	await server.start()
	app.use(
		'/graphql',
		express.json(),
		cors(),
		expressMiddleware(server, {
			context: async ({ req, res }) => {
				return { req, res, ...authMiddleware(req, res) }
			},
		})
	)

	await mongoose.connect(process.env.MONGODB_URI ?? '')
	app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
}

start()
