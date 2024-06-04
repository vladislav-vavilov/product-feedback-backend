import { Schema, model } from 'mongoose'
import { categoriesEnum } from '../constants.js'

const schema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	likes: { type: Number, default: 0 },
	author: { type: Schema.ObjectId, ref: 'User', required: true },
	category: {
		type: String,
		enum: Object.values(categoriesEnum),
		required: true,
	},
})

export default model('Post', schema)
