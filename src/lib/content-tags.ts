import { getCollection } from "./published-content";

export const getAndGroupUniqueTags = async (): Promise<Map<string, any[]>> => {
  const allProjects = await getCollection("projects");
  const allExperiences = await getCollection("experiences");
  const books = await getCollection("books");
  const posts = await getCollection("posts");

  const allItems = [...allProjects, ...allExperiences, ...books, ...posts];

  // @ts-ignore
  const uniqueTags: string[] = [
    ...new Set(allProjects.flatMap((post: any) => post.data.tags ?? [])),
    ...new Set(allExperiences.flatMap((post: any) => post.data.tags ?? [])),
    ...new Set(books.flatMap((post: any) => post.data.tags ?? [])),
    ...new Set(posts.flatMap((post: any) => post.data.tags ?? [])),
  ];
  const tagItemsMap = new Map<string, any[]>();

  uniqueTags.forEach((tag) => {
    const filteredItems = allItems.filter((item) =>
      item?.data?.tags?.includes(tag),
    );

    tagItemsMap.set(tag, filteredItems);
  });
  return tagItemsMap;
};
