import { Schema, model } from 'mongoose'

const schema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	username: { type: String, unique: true, required: true },
})

export default model('User', schema)
