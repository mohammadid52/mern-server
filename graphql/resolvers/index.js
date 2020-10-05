const userResolver = require("./userResolver");
const postResolver = require("./postResolver");
const comments = require("./comment");
const likes = require("./likes");
module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...likes.Mutation,
    ...postResolver.Mutation,
    ...comments.Mutation,
  },
  Subsription: {
    ...postResolver.Subscription,
  },
};
