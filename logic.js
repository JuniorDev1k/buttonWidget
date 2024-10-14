import { getPublishedBlogPosts } from "./NotionService";


const dataToSave = {
        title: "My Notion Data",
        content: "This is some content from Notion.",
      };
  const SaveToDB = async() => 
    {
      const post = await getPublishedBlogPosts()
      if(!post) => throw("No posts to fetch")
      
      // check here if post exists on DB .
      // if yes : update request.
      // if No : post request.
    }
  

      const response = await fetch('https://localhost:3000/api/save', {
        method: 'POST',
        body: JSON.stringify(dataToSave),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Data saved to Supabase successfully!');
      } else {
        alert('Failed to save data.');
      }
    }
