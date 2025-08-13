import { RootState } from "../index";

// Memoized selectors for announcements
export const selectAnnouncements = (state: RootState) =>
  state.announcements.announcements;
export const selectActiveAnnouncements = (state: RootState) =>
  state.announcements.activeAnnouncements;
export const selectSelectedAnnouncement = (state: RootState) =>
  state.announcements.selectedAnnouncement;
export const selectAnnouncementsLoading = (state: RootState) =>
  state.announcements.loading;
export const selectAnnouncementsError = (state: RootState) =>
  state.announcements.error;

// Complex selectors
export const selectAnnouncementById = (state: RootState, id: string) =>
  state.announcements.announcements.find(
    (announcement) => announcement.id === id
  );

export const selectActiveAnnouncementsCount = (state: RootState) =>
  state.announcements.activeAnnouncements.length;
