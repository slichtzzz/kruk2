import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { filter, find, clone, difference, uniq, concat, isEmpty } from 'lodash'
import { getDataFromServer } from '../utils'

// --- Асинхронные загрузки ---
export const fetchSymbols = createAsyncThunk('symbols/fetchSymbols', async () => {
  const data = await getDataFromServer('https://domestikos.ru/base/kruk/all')
  return data
})

export const fetchCompositions = createAsyncThunk('symbols/fetchCompositions', async () => {
  const data = await getDataFromServer('https://domestikos.ru/base/composition/all')
  let i = 1
  const compositionsSortedByTone = Array.from({ length: 8 }, (_, idx) => ({
    tone: idx + 1,
    compositions: [],
  }))

  while (i < 9) {
	const typeOfCompositions = clone(data)
    const filteredByTone = typeOfCompositions.map((composition) =>
      composition.compositions.filter(
        (subComposition) => subComposition.tone.indexOf(i.toString()) !== -1
      ),
    )

    const compositionsOfTone = find(compositionsSortedByTone, { tone: i })
    filteredByTone.forEach((arr) => {
      if (!isEmpty(arr)) {
        compositionsOfTone.compositions = [...compositionsOfTone.compositions, ...arr]
      }
    })
    i++
  }
 console.log("Полученные библиотеки: ", compositionsSortedByTone);
  return compositionsSortedByTone
})

// --- Slice ---
const symbolsSlice = createSlice({
  name: 'symbols',
  initialState: {
    symbols: [],
    currentSymbols: [],
    symbolsFilteredByName: [],
    symbolsFilteredByOptions: [],
    symbolsFilteredByPitch: [],
    options: [],
    pitchs: [],
    compositions: [],
    currentCompositions: [],
    compositionsNames: [],
    error: '',
  },
  reducers: {
	setSymbols(state, action) {
      const symbols = action.payload;
      state.symbols = symbols;
      state.namesOfSymbols = symbols.map((symbol) => ({
        value: symbol._id,
        label: symbol.name,
      }));
    },
    filterByName: (state, action) => {
      const symbolName = action.payload
      const symbolObj = find(state.symbols, { name: symbolName })
      if (symbolObj) {
        state.symbolsFilteredByName = symbolObj.symbols
        state.currentSymbols = symbolObj.symbols
      }
    },
    filterByOptions: (state, action) => {
      const options = action.payload
      const filtered = filter(state.symbolsFilteredByName, (symbol) =>
        difference(options, symbol.opts).length === 0 &&
        difference(symbol.opts, options).length === 0
      )
      state.symbolsFilteredByOptions = filtered
      state.currentSymbols = filtered
      state.error = filtered.length === 0 ? 'Ошибка. Такого крюка в базе нет.' : ''
    },
    filterByPitch: (state, action) => {
      const pitch = action.payload
      const filtered = filter(state.symbolsFilteredByOptions, ({ pitch: p }) => p === pitch)
      state.symbolsFilteredByPitch = filtered
      state.currentSymbols = filtered
      state.error = filtered.length === 0 ? 'Ошибка. Такого крюка в базе нет.' : ''
    },
    createOptionsList: (state) => {
      let arr = []
      state.symbolsFilteredByName.forEach((s) => { arr = concat(arr, s.opts) })
      state.options = uniq(arr).map((opt, idx) => ({ value: idx, label: opt }))
    },
    createPitchList: (state) => {
      let arr = []
      state.currentSymbols.forEach((s) => { arr = concat(arr, s.pitch) })
      state.pitchs = uniq(arr).map((p, idx) => ({ value: idx, label: p }))
    },
    createNamesList: (state, action) => {
      const tone = action.payload
      const compositionsByTone = find(state.compositions, { tone }).compositions
      state.currentCompositions = compositionsByTone
      state.compositionsNames = compositionsByTone.map((c) => ({ id: c._id, name: c.name }))
    },
    addTextToSyllable: (state, action) => {
      const text = action.payload
      const symbolWithText = clone(state.symbolsFilteredByPitch[0])
      if (symbolWithText) {
        symbolWithText.text = text
        symbolWithText.type = 'KRUK'
        state.symbolWithText = symbolWithText
      }
    },
    setError: (state, action) => { state.error = action.payload },
    clearError: (state) => { state.error = '' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSymbols.fulfilled, (state, action) => { state.symbols = action.payload })
      .addCase(fetchCompositions.fulfilled, (state, action) => { state.compositions = action.payload })
  },
})

export const {
  setSymbols,
  filterByName,
  filterByOptions,
  filterByPitch,
  createOptionsList,
  createPitchList,
  createNamesList,
  addTextToSyllable,
  setError,
  clearError,
} = symbolsSlice.actions

export default symbolsSlice.reducer
