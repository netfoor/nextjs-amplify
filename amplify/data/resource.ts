import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a
    .model({
      title: a.string().required(),
      content: a.string(),
      owner: a.string(),
      comments: a.hasMany('Comment', 'postId'),
  })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.owner(),
    ]),

  Comment: a
    .model({
      content: a.string().required(),
      post: a.belongsTo('Post', 'postId'),
      postId: a.id().required(),
      owner: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.owner(),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
      description: 'API key for public access',
    }
  },
});
