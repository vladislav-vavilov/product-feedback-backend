import { Schema, model } from 'mongoose'

const schema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	likes: { type: Number, default: 0 },
	userId: { type: Schema.ObjectId, ref: 'User', required: true },
})

export default model('Post', schema)
