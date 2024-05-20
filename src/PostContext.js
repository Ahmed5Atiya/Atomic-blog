import { useContext, useState, createContext, useMemo } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
//create the new context

// Derived state. These are the posts that will actually be displayed

const PostContext = createContext(); // this is the commponent
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  const value = useMemo(() => {
    return {
      onClearPosts: handleClearPosts,
      onAddPost: handleAddPost,
      posts: searchedPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchQuery, searchedPosts]);

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

function usePost() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("you use the context outside the porvider componant");
  return context;
}
export { PostProvider, usePost };
