import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunk for fetching images from server
export const fetchImages = createAsyncThunk(
  'image/fetchImages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${api}/images/latest`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      return data.data ? [data.data] : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  storedImages: [],
  currentImage: {
    file: null,
    preview: null,
    error: null,
  },
  isLoading: false,
  isModalOpen: false,
  selectedImage: null,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setCurrentImage: (state, action) => {
      state.currentImage = action.payload;
    },
    clearCurrentImage: (state) => {
      state.currentImage = {
        file: null,
        preview: null,
        error: null,
      };
    },
    addStoredImage: (state, action) => {
      if (state.storedImages.length >= 5) {
        state.storedImages.shift(); // Remove the oldest image if there are more than 5
      }
      state.storedImages.push(action.payload);
      localStorage.setItem(
        'uploadedImages',
        JSON.stringify(state.storedImages)
      );
    },
    deleteStoredImage: (state, action) => {
      state.storedImages = state.storedImages.filter(
        (img) => img.id !== action.payload
      );
      localStorage.setItem(
        'uploadedImages',
        JSON.stringify(state.storedImages)
      );
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    initializeFromStorage: (state) => {
      const images = localStorage.getItem('uploadedImages');
      if (images) {
        state.storedImages = JSON.parse(images);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storedImages = action.payload;
        localStorage.setItem('uploadedImages', JSON.stringify(action.payload));
      })
      .addCase(fetchImages.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setCurrentImage,
  clearCurrentImage,
  addStoredImage,
  deleteStoredImage,
  setLoading,
  setModalOpen,
  setSelectedImage,
  initializeFromStorage,
} = imageSlice.actions;

export default imageSlice.reducer;