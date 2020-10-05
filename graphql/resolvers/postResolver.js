const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");
const { validatePost } = require("../../utils/validators");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const post = await Post.find().sort({ createdAt: -1 });
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) return post;
        else throw new Error("Post not found");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      const { valid, errors } = validatePost(body);

      if (!valid) {
        throw new UserInputError("Error", { errors });
      }

      const newPost = new Post({
        body,
        id: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        try {
          if (post.username === user.username) {
            await post.delete();
            return "Post deleted successfully";
          } else {
            throw new AuthenticationError("Action not allowed");
          }
        } catch (error) {
          throw new Error(error);
        }
      }
      throw new UserInputError("Post not found");
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
