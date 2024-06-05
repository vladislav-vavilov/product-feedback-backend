import { Schema, model } from 'mongoose'

const schema = new Schema({
	author: { type: Schema.ObjectId, ref: 'User', required: true },
	content: { type: String, required: true },
})

export default model('Comment', schema)
