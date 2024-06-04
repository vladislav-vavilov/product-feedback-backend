import { Schema, model } from 'mongoose'

const schema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	username: { type: String, unique: true, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	posts: [{ type: Schema.ObjectId, ref: 'Post' }],
})

export default model('User', schema)
