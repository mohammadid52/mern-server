const { AuthenticationError, UserInputError } = require("apollo-server");

const checkAuth = require("../../utils/checkAuth");
const Post = require("../../models/Post");

module.exports = {
  Mutation: {
    createComment: async (_, { body, postId }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Errors", {
          errors: {
            body: "comment cannot be empty",
          },
        });
      }

      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } else {
        throw new Error("Post not found");
      }
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else throw new AuthenticationError("Action not allowed");
      } else throw new UserInputError("post not found");
    },
  },
};
