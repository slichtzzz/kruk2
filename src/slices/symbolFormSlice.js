import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: null,
  options: [],
  pitch: { label: '' },
}

const symbolFormSlice = createSlice({
  name: 'symbolForm',
  initialState,
  reducers: {
    saveForm(state, action) {
      return { ...state, ...action.payload }
    },
    resetForm() {
      return initialState
    },
  },
})

export const { saveForm, resetForm } = symbolFormSlice.actions
export default symbolFormSlice.reducer
