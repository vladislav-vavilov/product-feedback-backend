import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
	  }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
	[P in K]-?: NonNullable<T[P]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string }
	String: { input: string; output: string }
	Boolean: { input: boolean; output: boolean }
	Int: { input: number; output: number }
	Float: { input: number; output: number }
}

export enum Category {
	Bug = 'BUG',
	Enhancement = 'ENHANCEMENT',
	Feature = 'FEATURE',
	Ui = 'UI',
	Ux = 'UX',
}

export type Comment = {
	__typename?: 'Comment'
	author: User
	content: Scalars['String']['output']
	id: Scalars['ID']['output']
}

export type CreateCommentInput = {
	content: Scalars['String']['input']
	postId: Scalars['ID']['input']
	userId: Scalars['ID']['input']
}

export type CreatePostInput = {
	category: Category
	content: Scalars['String']['input']
	title: Scalars['String']['input']
	userId: Scalars['ID']['input']
}

export type LoginInput = {
	email: Scalars['String']['input']
	password: Scalars['String']['input']
}

export type Mutation = {
	__typename?: 'Mutation'
	createComment: Comment
	createPost: Post
	deleteComment: Scalars['ID']['output']
	deletePost: Scalars['ID']['output']
	deleteUser: Scalars['ID']['output']
	login: User
	register: User
	updateComment: Comment
	updatePost: Post
	updateUser: User
}

export type MutationCreateCommentArgs = {
	input: CreateCommentInput
}

export type MutationCreatePostArgs = {
	input: CreatePostInput
}

export type MutationDeleteCommentArgs = {
	id: Scalars['ID']['input']
}

export type MutationDeletePostArgs = {
	id: Scalars['ID']['input']
}

export type MutationDeleteUserArgs = {
	id: Scalars['ID']['input']
}

export type MutationLoginArgs = {
	input: LoginInput
}

export type MutationRegisterArgs = {
	input: UserInput
}

export type MutationUpdateCommentArgs = {
	input: UpdateCommentInput
}

export type MutationUpdatePostArgs = {
	input: UpdatePostInput
}

export type MutationUpdateUserArgs = {
	input: UpdateUserInput
}

export type Post = {
	__typename?: 'Post'
	author: User
	category: Category
	comments?: Maybe<Array<Maybe<Comment>>>
	content: Scalars['String']['output']
	id: Scalars['ID']['output']
	likes: Scalars['Int']['output']
	title: Scalars['String']['output']
}

export type PostsFiltersInput = {
	author?: InputMaybe<Scalars['ID']['input']>
	content?: InputMaybe<Scalars['String']['input']>
	title?: InputMaybe<Scalars['String']['input']>
}

export type Query = {
	__typename?: 'Query'
	posts: Array<Post>
	user: User
}

export type QueryPostsArgs = {
	filters?: InputMaybe<PostsFiltersInput>
}

export type QueryUserArgs = {
	id: Scalars['ID']['input']
}

export type UpdateCommentInput = {
	content: Scalars['String']['input']
	id: Scalars['ID']['input']
}

export type UpdatePasswordInput = {
	currentPassword: Scalars['String']['input']
	newPassword: Scalars['String']['input']
}

export type UpdatePostInput = {
	category?: InputMaybe<Category>
	content?: InputMaybe<Scalars['String']['input']>
	id: Scalars['ID']['input']
	likes?: InputMaybe<Scalars['Int']['input']>
	title?: InputMaybe<Scalars['String']['input']>
}

export type UpdateUserInput = {
	email?: InputMaybe<Scalars['String']['input']>
	firstName?: InputMaybe<Scalars['String']['input']>
	id: Scalars['ID']['input']
	lastName?: InputMaybe<Scalars['String']['input']>
	password?: InputMaybe<UpdatePasswordInput>
	username?: InputMaybe<Scalars['String']['input']>
}

export type User = {
	__typename?: 'User'
	email: Scalars['String']['output']
	firstName: Scalars['String']['output']
	id: Scalars['ID']['output']
	lastName: Scalars['String']['output']
	password: Scalars['String']['output']
	posts?: Maybe<Array<Maybe<Post>>>
	username: Scalars['String']['output']
}

export type UserInput = {
	email: Scalars['String']['input']
	firstName: Scalars['String']['input']
	lastName: Scalars['String']['input']
	password: Scalars['String']['input']
	username: Scalars['String']['input']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
	resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
	TResult,
	TKey extends string,
	TParent,
	TContext,
	TArgs
> {
	subscribe: SubscriptionSubscribeFn<
		{ [key in TKey]: TResult },
		TParent,
		TContext,
		TArgs
	>
	resolve?: SubscriptionResolveFn<
		TResult,
		{ [key in TKey]: TResult },
		TContext,
		TArgs
	>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
	resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
	TResult,
	TKey extends string,
	TParent,
	TContext,
	TArgs
> =
	| SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
	| SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
	TResult,
	TKey extends string,
	TParent = {},
	TContext = {},
	TArgs = {}
> =
	| ((
			...args: any[]
	  ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
	| SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
	parent: TParent,
	context: TContext,
	info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
	obj: T,
	context: TContext,
	info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
	TResult = {},
	TParent = {},
	TContext = {},
	TArgs = {}
> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
	Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
	Category: Category
	Comment: ResolverTypeWrapper<Comment>
	CreateCommentInput: CreateCommentInput
	CreatePostInput: CreatePostInput
	ID: ResolverTypeWrapper<Scalars['ID']['output']>
	Int: ResolverTypeWrapper<Scalars['Int']['output']>
	LoginInput: LoginInput
	Mutation: ResolverTypeWrapper<{}>
	Post: ResolverTypeWrapper<Post>
	PostsFiltersInput: PostsFiltersInput
	Query: ResolverTypeWrapper<{}>
	String: ResolverTypeWrapper<Scalars['String']['output']>
	UpdateCommentInput: UpdateCommentInput
	UpdatePasswordInput: UpdatePasswordInput
	UpdatePostInput: UpdatePostInput
	UpdateUserInput: UpdateUserInput
	User: ResolverTypeWrapper<User>
	UserInput: UserInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
	Boolean: Scalars['Boolean']['output']
	Comment: Comment
	CreateCommentInput: CreateCommentInput
	CreatePostInput: CreatePostInput
	ID: Scalars['ID']['output']
	Int: Scalars['Int']['output']
	LoginInput: LoginInput
	Mutation: {}
	Post: Post
	PostsFiltersInput: PostsFiltersInput
	Query: {}
	String: Scalars['String']['output']
	UpdateCommentInput: UpdateCommentInput
	UpdatePasswordInput: UpdatePasswordInput
	UpdatePostInput: UpdatePostInput
	UpdateUserInput: UpdateUserInput
	User: User
	UserInput: UserInput
}

export type CommentResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']
> = {
	author?: Resolver<ResolversTypes['User'], ParentType, ContextType>
	content?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
	createComment?: Resolver<
		ResolversTypes['Comment'],
		ParentType,
		ContextType,
		RequireFields<MutationCreateCommentArgs, 'input'>
	>
	createPost?: Resolver<
		ResolversTypes['Post'],
		ParentType,
		ContextType,
		RequireFields<MutationCreatePostArgs, 'input'>
	>
	deleteComment?: Resolver<
		ResolversTypes['ID'],
		ParentType,
		ContextType,
		RequireFields<MutationDeleteCommentArgs, 'id'>
	>
	deletePost?: Resolver<
		ResolversTypes['ID'],
		ParentType,
		ContextType,
		RequireFields<MutationDeletePostArgs, 'id'>
	>
	deleteUser?: Resolver<
		ResolversTypes['ID'],
		ParentType,
		ContextType,
		RequireFields<MutationDeleteUserArgs, 'id'>
	>
	login?: Resolver<
		ResolversTypes['User'],
		ParentType,
		ContextType,
		RequireFields<MutationLoginArgs, 'input'>
	>
	register?: Resolver<
		ResolversTypes['User'],
		ParentType,
		ContextType,
		RequireFields<MutationRegisterArgs, 'input'>
	>
	updateComment?: Resolver<
		ResolversTypes['Comment'],
		ParentType,
		ContextType,
		RequireFields<MutationUpdateCommentArgs, 'input'>
	>
	updatePost?: Resolver<
		ResolversTypes['Post'],
		ParentType,
		ContextType,
		RequireFields<MutationUpdatePostArgs, 'input'>
	>
	updateUser?: Resolver<
		ResolversTypes['User'],
		ParentType,
		ContextType,
		RequireFields<MutationUpdateUserArgs, 'input'>
	>
}

export type PostResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']
> = {
	author?: Resolver<ResolversTypes['User'], ParentType, ContextType>
	category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>
	comments?: Resolver<
		Maybe<Array<Maybe<ResolversTypes['Comment']>>>,
		ParentType,
		ContextType
	>
	content?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	likes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
	title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
	posts?: Resolver<
		Array<ResolversTypes['Post']>,
		ParentType,
		ContextType,
		Partial<QueryPostsArgs>
	>
	user?: Resolver<
		ResolversTypes['User'],
		ParentType,
		ContextType,
		RequireFields<QueryUserArgs, 'id'>
	>
}

export type UserResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
	email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	password?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	posts?: Resolver<
		Maybe<Array<Maybe<ResolversTypes['Post']>>>,
		ParentType,
		ContextType
	>
	username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
	Comment?: CommentResolvers<ContextType>
	Mutation?: MutationResolvers<ContextType>
	Post?: PostResolvers<ContextType>
	Query?: QueryResolvers<ContextType>
	User?: UserResolvers<ContextType>
}
