import { announcementsAPI, ApiAnnouncement } from './../../api/announcements';
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Async thunk for fetching all announcements
export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const announcements = await announcementsAPI.getAll();
      return announcements;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch announcements"
      );
    }
  }
);

// Async thunk for fetching active announcements
export const fetchActiveAnnouncements = createAsyncThunk(
  "announcements/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const announcements = await announcementsAPI.getActive();
      return announcements;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch active announcements"
      );
    }
  }
);

// Async thunk for fetching single announcement by ID
export const fetchAnnouncementById = createAsyncThunk(
  "announcements/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const announcement = await announcementsAPI.getById(id);
      if (!announcement) {
        return rejectWithValue("Announcement not found");
      }
      return announcement;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch announcement"
      );
    }
  }
);

interface AnnouncementsState {
  announcements: ApiAnnouncement[];
  activeAnnouncements: ApiAnnouncement[];
  selectedAnnouncement: ApiAnnouncement | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnnouncementsState = {
  announcements: [],
  activeAnnouncements: [],
  selectedAnnouncement: null,
  loading: false,
  error: null,
};

const announcementsSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAnnouncement: (state) => {
      state.selectedAnnouncement = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all announcements
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAnnouncements.fulfilled,
        (state, action: PayloadAction<ApiAnnouncement[]>) => {
          state.loading = false;
          state.announcements = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch active announcements
    builder
      .addCase(fetchActiveAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchActiveAnnouncements.fulfilled,
        (state, action: PayloadAction<ApiAnnouncement[]>) => {
          state.loading = false;
          state.activeAnnouncements = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchActiveAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch announcement by ID
    builder
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAnnouncementById.fulfilled,
        (state, action: PayloadAction<ApiAnnouncement>) => {
          state.loading = false;
          state.selectedAnnouncement = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedAnnouncement } =
  announcementsSlice.actions;
export default announcementsSlice.reducer;
