import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notionClient = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
const notionToMarkdown = new NotionToMarkdown({ notionClient });

export const getPublishedBlogPosts = async () => {
  const database = process.env.NOTION_BLOG_DATABASE_ID;
  const response = await notionClient.databases.query({
    database_id: database,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Created",
        direction: "descending",
      },
    ],
  });

  return response.results.map((res) => pageToPostsTransformer(res));
};

export const getSingleBlogPost = async (slug) => {
  let post, markdown;
  const database = process.env.NOTION_BLOG_DATABASE_ID;
  const response = await notionClient.databases.query({
    database_id: database,
    filter: {
      property: "Slug", // This is the formula property
      formula: {
        string: {
          equals: slug, // Check if the formula's result equals the slug
        },
      },
    },
  });

  if (!response.results[0]) {
    throw "No results available";
  }

  const page = response.results[0];
  const madBlocks = await notionToMarkdown.pageToMarkdown(page.id);
  markdown = notionToMarkdown.toMarkdownString(madBlocks);
  post = pageToPostsTransformer(page);
  return {
    post,
    markdown,
  };
};

const pageToPostsTransformer = (page) => {
  let cover = page.cover;
  switch (page.cover?.type) {
    case "file":
      cover = page.cover.file.url;
      break;
    case "external":
      cover = page.cover.external.url;
      break;
    default:
      cover = "";
  }

  return {
    id: page.id,
    cover: cover,
    title: page.properties.Name.title[0]?.plain_text,
    description: page.properties.Description?.rich_text[0].plain_text,
    date: page.properties.Updated.last_edited_time,
    slug: page.properties.Slug.formula.string,
    author: page.properties.Author.rich_text[0].plain_text,
  };
};
