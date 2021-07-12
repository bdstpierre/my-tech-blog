const User = require('./User');
const Post = require('./Post');

User.hasMany(Post, {
    foreignKey: 'author',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'author'
});

module.exports = { User, Post };