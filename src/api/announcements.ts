// --- Types ---
export interface ApiAnnouncement {
  id: string;
  title: string;
  description: string;
  image: string;
  isDisabled: boolean;
  startDateTime: string;
  endDateTime: string;
  lastUpdatedByPFNumber: string;
  createdAt: string;
  updatedAt: string;
}

// --- Constants ---
const API_BASE_URL =
  "https://smile-uat.etiqa.com.my/mobile-svc-regional/api/Route/v1/Smile";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Regional-Id":
    "Key regional.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmlnaW4iOiJNWSIsIm5iZiI6MTczNjE0ODM3NSwiZXhwIjoxNzM4NzQwMzc1LCJpYXQiOjE3MzYxNDgzNzUsImlzcyI6IlJlZ2lvbmFsLU1vYmlsZSIsImF1ZCI6IlJlZ2lvbmFsLVVzZXIifQ.MiJl65dRNg_KdMKE4WJcxnV2hCM7w-YY_smx9D8wLqM",
};

// --- Helper for POST requests that return JSON ---
async function fetchPostJson<T>(url: string, body = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      method: "POST", // This API requires POST even for fetching
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const statusText =
        response.status === 504
          ? "Gateway Timeout - Server took too long to respond"
          : `HTTP error! status: ${response.status}`;
      throw new Error(statusText);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out after 30 seconds");
    }
    throw error;
  }
}

// --- Helper function to clean HTML and extract plain text ---
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "") // Remove all HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/&#x27;/g, "'") // Replace &#x27; with '
    .replace(/&#x2F;/g, "/") // Replace &#x2F; with /
    .trim();
};


// --- Main API Object ---
export const announcementsAPI = {
  // Fetch all announcements
  getAll: async (): Promise<ApiAnnouncement[]> => {
    try {
      const response = await fetchPostJson<any>(
        `${API_BASE_URL}/Announcement`,
        {}
      );
      // console.log("API Response:", response);

      // Check if response has success status and data array
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(
          "Successfully fetched",
          response.data.length,
          "announcements from API"
        );
        // Map the API response to match our interface
        return response.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          description: item.description, // Keep raw HTML for detail screen
          image: `https://smile-uat.etiqa.com.my${item.image}`, // Add base URL for images
          isDisabled: item.isDisabled,
          startDateTime: item.startDateTime,
          endDateTime: item.endDateTime,
          lastUpdatedByPFNumber: item.lastUpdatedByPFNumber,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));
      } else {
        console.warn(
          "Expected successful response with data array, received:",
          response
        );
      }
      return [];
    } catch (error) {
      console.error("Error in getAll:", error);
      console.log("API failed");
      return [];
    }
  },

  // Get active (enabled and date-valid) announcements
  getActive: async (): Promise<ApiAnnouncement[]> => {
    try {
      const all = await announcementsAPI.getAll();

      const now = new Date();

      return all.filter((item) => {
        if (item.isDisabled) return false;

        const start = new Date(item.startDateTime);
        const end = new Date(item.endDateTime);

        return now >= start && now <= end;
      });
    } catch (error) {
      console.error("Error in getActive:", error);
      return [];
    }
  },

  // Get a single announcement by ID
  getById: async (id: string): Promise<ApiAnnouncement | null> => {
    try {
      const all = await announcementsAPI.getAll();
      return all.find((item) => item.id === id) || null;
    } catch (error) {
      console.error("Error in getById:", error);
      return null;
    }
  },
};
