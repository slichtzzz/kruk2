import { createSlice } from '@reduxjs/toolkit'
import { customFonts } from '../res'

const initialState = {
  symbolFontSize: 50,
  textFontSize: 20,
  marginTop: 10,
  marginBottom: 14,
  fontOfTextInSyllables: customFonts[0],
  sizeOfBucvica: 90,
  sizeOfPage: 900,
}

const paperStyleSlice = createSlice({
  name: 'paperStyle',
  initialState,
  reducers: {
    updatePaperStyle(state, action) {
      return { ...state, ...action.payload }
    },
  },
})

export const { updatePaperStyle } = paperStyleSlice.actions
export default paperStyleSlice.reducer
