export async function getYoutubeVideos() {
    try {
      const API_KEY = process.env.DARKSTAR_GOOGLE_API_KEY;
      const channelId = "UCNNlfUfTU61QaJDWPEakkeg";
      const maxResults = 4;
  
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&order=date&part=snippet&type=video&maxResults=${maxResults}`
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      return [];
    }
  }
  