const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blogEntity) => sum + blogEntity.likes, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
