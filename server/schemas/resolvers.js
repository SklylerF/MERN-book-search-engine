const { AuthenticationError } = require('apollo-server-express');
const { signTocken } = require('../utils/auth');
const { User, Book } = require("../models");
const { countDocuments } = require('../models/User');


const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (parent, { iserId }) => {
            return Profile.findOne({ _id: userId });
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No profile with this email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }
            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { authors, description, bookId, image, link, title }) => {
            if (context.user) {
                const book = await Book.create({
                    authors,
                    description,
                    bookId,
                    image,
                    link,
                    title,
                });
                await User.findByIdAndUpdate({ _id: context.user._id }, { $addToSet: { books: book.bookId } });

                return book;
            }
            throw new AuthenticationError("login to save book");
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const book = await book.findByIdAndDelete({ bookId });

                await User.findByIdAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: book.bookId } });
                return book;
            }
            throw new AuthenticationError(" you must be logged in to remove a book");
        },
    },
};

models.exports = resolvers;