import { createSlice } from "@reduxjs/toolkit";

// Global academic-year scope for the Institute Portal. `selectedYearId` is
// either a specific AcademicYear _id, or the string "all" (cumulative view).
// Persisted to localStorage so the chosen scope survives reloads.
const STORAGE_KEY = "mawaheb-institute-year";

const initialState = {
  years: [],
  selectedYearId: localStorage.getItem(STORAGE_KEY) || null,
  loaded: false,
};

const academicYearSlice = createSlice({
  name: "academicYear",
  initialState,
  reducers: {
    setYears(state, action) {
      state.years = action.payload || [];
      state.loaded = true;
      // Default the scope to the active year on first load if nothing chosen.
      if (!state.selectedYearId) {
        const active = state.years.find((y) => y.isActive);
        state.selectedYearId = active
          ? active._id
          : state.years[0]?._id || "all";
        localStorage.setItem(STORAGE_KEY, state.selectedYearId);
      }
    },
    setSelectedYear(state, action) {
      state.selectedYearId = action.payload;
      localStorage.setItem(STORAGE_KEY, action.payload);
    },
  },
});

export const { setYears, setSelectedYear } = academicYearSlice.actions;
export default academicYearSlice.reducer;
