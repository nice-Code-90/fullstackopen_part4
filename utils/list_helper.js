const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blogEntity) => sum + blogEntity.likes, 0);
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  let favIndex = 0;
  let mostLikes = blogs[0].likes;
  blogs.forEach((entity, index) => {
    if (entity.likes > mostLikes) {
      mostLikes = entity.likes;
      favIndex = index;
    }
  });
  return {
    title: blogs[favIndex].title,
    author: blogs[favIndex].author,
    likes: mostLikes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let authorsAndSumOfBlogs = blogs.reduce((acc, entity) => {
    if (!acc[entity.author]) {
      acc[entity.author] = 1;
    } else {
      acc[entity.author]++;
    }
    return acc;
  }, {});

  let arrayOfObects = arrOfObjectsFromTwoDimensionArray(
    authorsAndSumOfBlogs,
    "author",
    "blogs"
  );

  let authorOfMostBlogs = arrayOfObects.reduce(
    (currentAuthOfMostBlogs, authorAndSumOfHisBlogs) => {
      return authorAndSumOfHisBlogs.blogs > currentAuthOfMostBlogs.blogs
        ? authorAndSumOfHisBlogs
        : currentAuthOfMostBlogs;
    },
    { author: "", blogs: 0 }
  );
  return authorOfMostBlogs;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let authorsAndSumOfLikes = blogs.reduce((acc, entity) => {
    if (!acc[entity.author]) {
      acc[entity.author] = entity.likes;
    } else {
      acc[entity.author] += entity.likes;
    }
    return acc;
  }, {});

  let arrayOfObects = arrOfObjectsFromTwoDimensionArray(
    authorsAndSumOfLikes,
    "author",
    "likes"
  );

  let authorOfMostReceivedLikes = arrayOfObects.reduce(
    (currentAuthorWithMostLikes, authorAndHisLikes) => {
      return authorAndHisLikes.likes > currentAuthorWithMostLikes.likes
        ? authorAndHisLikes
        : currentAuthorWithMostLikes;
    },
    { author: "", likes: 0 }
  );
  return authorOfMostReceivedLikes;
};

const arrOfObjectsFromTwoDimensionArray = (twoDimensionArray, key, val) => {
  return Object.entries(twoDimensionArray).map(([v1, v2]) => ({
    [key]: v1,
    [val]: v2,
  }));
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
};
