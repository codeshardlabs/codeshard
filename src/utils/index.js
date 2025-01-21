export const writeToClipboard = (text) => {
  navigator.clipboard.writeText(`${text}`);
};
export const templates = [
  "static",
  "angular",
  "react",
  "react-ts",
  "solid",
  "svelte",
  "test-ts",
  "vanilla-ts",
  "vanilla",
  "vue",
  "vue-ts",
  "node",
  "nextjs",
  "astro",
  "vite",
  "vite-react",
  "vite-react-ts",
];

export const makeFilesAndDependenciesUIStateLike = (
  fileContent = [],
  dependencyContent = [],
) => {
  const nonDevDependenices = {};
  const devDependencies = {};
  const files = {};

  dependencyContent.forEach((dep) => {
    if (dep.isDevDependency) {
      devDependencies[dep.name] = dep.version;
    } else {
      nonDevDependenices[dep.name] = dep.version;
    }
  });

  fileContent.forEach(({ name, ...rest }) => {
    files[name] = {
      ...rest,
    };
  });

  return [files, nonDevDependenices, devDependencies];
};

export const getThreadedComments = (comments) => {
  // Process comments to create the thread structure
  let commentMap = new Map(
    comments.map((comment) => [
      comment._id.toString(),
      { ...comment, replies: [] },
    ]),
  );
  for (let comment of commentMap.values()) {
    if (comment.parentId !== null) {
      let parentComment = commentMap.get(comment.parentId.toString());
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    }
  }
  // Filter out replies to get top-level comments
  let threadedComments = Array.from(commentMap.values()).filter(
    (comment) => !comment.parentId,
  );
  return threadedComments;
};

export const marshalUsername = (username) => {
  return username.toLowerCase().split(" ").join("-");
};

export const findParentComment = (comments, parentId) => {
  for (let comment of comments) {
    if (comment._id.toString() === parentId.toString()) {
      return comment;
    } else {
      return findParentComment(comment?.replies, parentId);
    }
  }

  return null;
};

export function formatFilesLikeInDb(files, shardId) {
  const keys = Object.keys(files);
  const finalFiles = [];
  for (let key of keys) {
    let code = files[key].code;
    finalFiles.push({
      code: code,
      name: key,
      shardId: shardId,
    });
  }
  return finalFiles;
}

export function getIncrementalHash(content) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  return hash;
}
