const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signTocken } = require('../utils/auth');