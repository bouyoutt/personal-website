import { getCollection as getAllContent, type CollectionKey } from 'astro:content';

// Explicit opt-in prevents upstream examples and unfinished drafts being published.
export function getCollection<C extends CollectionKey>(collection: C) {
  return getAllContent(collection, entry => entry.data.published === true);
}
