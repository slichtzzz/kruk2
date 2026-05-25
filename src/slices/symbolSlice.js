import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { filter, find, clone, difference, uniq, concat, isEmpty, intersection } from 'lodash'
import { getDataFromServer } from '../utils'

// асинхронные загрузки
export const fetchZnamenSymbols = createAsyncThunk('symbols/fetchZnamenSymbols', async () => {
  const data = await getDataFromServer('https://oko.jesser.ru/kruk/kruk.php')
  return data
})

export const fetchDemestvoSymbols = createAsyncThunk('symbols/fetchDemestvoSymbols', async () => {
  const data = await getDataFromServer('https://oko.jesser.ru/kruk/demestvo.php')
  return data
})

export const fetchSources = createAsyncThunk('symbols/fetchSources', async () => {
  const data = await getDataFromServer('https://oko.jesser.ru/kruk/sources.php')
  return data
})

export const fetchCompositions = createAsyncThunk('symbols/fetchCompositions', async (url, { getState }) => {
  const state = getState();
  //const currentType = state.symbols.currentType;
  //const currentSourceId = state.symbols.currentSource;
  const data = await getDataFromServer(url)
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
  return compositionsSortedByTone
})

const updateNames = (state, source) => {
  state.namesOfSymbols = source.map((symbol) => ({
    value: symbol._id,
    label: symbol.name,
    hotkey: symbol.hotkey,
  }));
};

const symbolsSlice = createSlice({
  name: 'symbols',
  initialState: {
  optionsHotkeys: {
  // Основные элементы
  "2 равенства": ["2"],
  "Борзая": ["б", ","],
  "Задержка": ["ц", "w"],
  "Закидка": ["з", "p"],
  "Качка": ["к", "r"],
  "Купна": ["к", "r"],
  "Ломка": ["л", "k"],
  "Облачко": ["о", "j"],
  "Отсечка": ["ч", "x"],
  "Подвертка": ["в", "d"],
  "Подчашие": ["п", "g"],
  "Равенство": ["р", "h"],
  "Сорочья-ножка": ["ш", "i"],
  "Тихая": ["т", "n"],
  "Ударка": ["у", "e"],
  "Скобка": ["э", "'"],
  // Особые по знамёнам
  "Очко": ["с", "c"],
  "Без очка": ["н", "y"],
  "Большая": ["с", "c"],
  "Малая": ["н", "y"],  
  "Большой": ["с", "c"],
  "Малый": ["н", "y"],
  "Светлая": ["с", "c"],
  "Борзый": ["с", "c"],
  "Тихий": ["м", "v"],
  "Простое": ["н", "y"],
  "Закрытая": ["д", "l"],
  "Запятая": ["ж", ";"],
  "Крыж": ["я", "z"],
  "Воздернутая": ["с", "c"],
  // Стрелы и статьи
  "Возводная": ["в", "d"],
  "Громная": ["г", "u"],
  "Громокрыжная": ["щ", "o"],
  "Громосветлая": ["ф", "a"],
  "Громотресветлая": ["ы", "s"],
  "Крыжевая": ["я", "z"],
  "Простая": ["н", "y"],
  "Мрачная": ["м", "v"],
  "Поводная": ["а", "f"],
  "Поездная": ["ю", "."],
  "Светлотихая": ["и", "b"],
  "Тресветлая": ["й", "q"],
  "Трясосветлая": ["е", "t"],
  //Демество
  //Характеристики знамён
  "2 крыжа": ["2"],
  "3 крыжа": ["3"],
  "Двоечельная": ["щ", "o"], //Стрела, скамеица
  "Закрытый": ["д", "l"],
  "Ключевой": ["ц", "w"],
  "Ключевая": ["ц", "w"],
  "Поводной": ["а", "f"],
  "Мрачный": ["м", "v"],
  "Мрачная": ["м", "v"],
  "Мрачное": ["м", "v"],
  "Непостоянная": ["й", "q"],
  "Омета": ["о", "h"],
  "Полуповодная": [".", "/"],
  "Простой": ["н", "y"],
  "Светлое": ["с", "c"],
  "Светлый": ["с", "c"],
  "Тресветлый": ["й", "q"],
  //Знамёна вторично
  "Голубчик": ["г", "u"], //В составе скамеицы
  "Запятая": ["ж", ";"], //Мечик ключевой
  "Ключ": ["ц", "w"], //
  "Крыж": ["я", "z"],
  "Крюк": ["к", "r"],
  "Палка": ["в", "d"],
  "Сложитие": ["н", "y"],
  "Статья": ["е", "t"],
  "Стопица": ["т", "n"],
  "Мечик-ключевой": ["х", "["],
  "Крюк-ключевой": ["ъ", "]"],
},
pitchHotkeys: {
  "-": ["б", ","],
  "Ля высокое": ["у", "e"],
  "Соль высокое": ["е", "t"],
  "Фа высокое": ["а", "f"],
  "Ля": ["в", "d"],
  "Соль": ["п", "g"],
  "Фа": ["м", "v"],
  "Ми": ["с", "c"],
  "Ре": ["н", "y"],
  "Ут": ["г", "u"],
  "Ми низкое": ["ц", "w"],
  "Ре низкое": ["р", "h"],
  "Ут низкое": ["о", "j"]
},
    symbols: [],
    znamenSymbols: [],
    demestvoSymbols: [],
    currentSymbols: [],
    symbolsFilteredByName: [],
    symbolsFilteredByOptions: [],
    symbolsFilteredByPitch: [],
    options: [],
    pitchs: [],
    compositions: [],
    sources: [],
    insertOptionName: null,
    insertOptionOptions: [],
    insertOptionOptionsSoft: [],
    insertOptionPitch: null,
    currentCompositions: [],
    compositionsNames: [],
    currentType: { value: 1, label: 'Попевки' },
    currentSource: 1,
    error: '',
    isDemestvoMode: false,
    isOptionsMode: false,
    isPitchMode: false,
  },
  reducers: {
	setSymbols(state, action) {
      const source = action.payload;
      if (!source) return;
      state.symbols = source;
      updateNames(state, source);
    },
filterByName: (state, action) => {
  const symbolName = action.payload;
  const symbolObj = find(state.symbols, { name: symbolName });

  if (symbolObj) {
    // Сортировка по размеру массива opts: чем короче, тем выше
    const sortedSymbols = [...symbolObj.symbols].sort((a, b) => {
      const aCount = Array.isArray(a.opts) ? a.opts.length : 0;
      const bCount = Array.isArray(b.opts) ? b.opts.length : 0;
      return aCount - bCount;
    });

    state.symbolsFilteredByName = sortedSymbols;
    state.currentSymbols = sortedSymbols;
  }
},
    filterByOptions: (state, action) => {
      const payload = action.payload || [];
      const rawData = Array.isArray(payload) ? payload : [payload];
      const uniqueMap = {}; 
	  rawData.forEach(item => {
	    const label = typeof item === 'string' ? item : item.label;
	    if (label && !uniqueMap[label]) {
	      uniqueMap[label] = { label: label, value: label };
	    }
	  });
	
	  state.insertOptionOptions = Object.values(uniqueMap);
	  state.insertOptionOptionsSoft = Object.values(uniqueMap);
	  const labels = state.insertOptionOptions.map(o => o.label);
	  const filtered = filter(state.symbolsFilteredByName, (symbol) =>
	    labels.length === 0 || (difference(labels, symbol.opts).length === 0)
	  );
      state.symbolsFilteredByOptions = filtered
      state.currentSymbols = filtered
      state.error = filtered.length === 0 ? 'Ошибка. Такого крюка в базе нет.' : ''
    },
	filterByOptionsStrict: (state, action) => {
	  const payload = action.payload || [];
	  const rawData = Array.isArray(payload) ? payload : [payload];
	  const uniqueMap = {}; 
	  
	  rawData.forEach(item => {
	    const label = typeof item === 'string' ? item : item.label;
	    if (label && !uniqueMap[label]) {
	      uniqueMap[label] = { label: label, value: label };
	    }
	  });
	
	  state.insertOptionOptions = Object.values(uniqueMap);
	
	  const options = state.insertOptionOptions.map(o => o.label);
	  const filtered = filter(state.symbolsFilteredByName, (symbol) => {
	    if (options.length === 0) {
	      return !symbol.opts || symbol.opts.length === 0;
	    }
	    return (
	      difference(options, symbol.opts).length === 0 &&
	      difference(symbol.opts, options).length === 0
	    );
	  });
	
	  state.symbolsFilteredByOptions = filtered;
	  state.currentSymbols = filtered;
	  state.error = filtered.length === 0 ? 'Ошибка. Такого крюка в базе нет.' : '';
	},
    filterByOptionsLegacy: (state, action) => {
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
      if(pitch) {
	      const filtered = filter(state.symbolsFilteredByOptions, ({ pitch: p }) => p === pitch)
	      state.symbolsFilteredByPitch = filtered
	      state.currentSymbols = filtered
	      state.error = filtered.length === 0 ? 'Ошибка. Такого крюка в базе нет.' : ''
		}
    },
    filterByPitchLegacy: (state, action) => {
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
	  const selectedTone = action.payload;
	  const toneData = state.compositions.find(c => String(c.tone) === String(selectedTone));
	
	  if (toneData && toneData.compositions) {
	    state.currentCompositions = toneData.compositions;
	    state.compositionsNames = toneData.compositions.map((c) => ({
	      value: c._id,
	      label: c.name,
	      view: c.view,
	      valueArr: c.value
	    }));
	  } else {
	    state.compositionsNames = [];
	  }
	},
	setType: (state, action) => {
	  state.currentType = action.payload
	},
	setSource: (state, action) => {
	  state.currentSource = action.payload
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
    setIsOptionsMode:  (state, action) => {
      state.isOptionsMode = action.payload
	},
    setIsPitchMode:  (state, action) => {
      state.isPitchMode = action.payload
	},
	setIsDemestvoMode:  (state, action) => {
      state.isDemestvoMode = action.payload;
      const source = state.isDemestvoMode ? state.demestvoSymbols : state.znamenSymbols;
      state.symbols = source;
      updateNames(state, source);
      state.symbolsFilteredByName = [];
      state.currentSymbols = [];
	},
	setClearCurrentSymbols: (state) => {
	  state.currentSymbols = [];
	  state.symbolsFilteredByName = [];
	  state.symbolsFilteredByOptions = [];
	  state.symbolsFilteredByPitch = [];
	  state.insertOptionName = null;
	  state.insertOptionOptions = [];
	  state.insertOptionPitch = null;
	},
	setInsertOptionName: (state, action) => {
		state.insertOptionName = action.payload;
	},
	setInsertOptionSoft: (state, action) => {
		state.insertOptionOptions = action.payload;
	},
	setInsertOptionPitch: (state, action) => {
		state.insertOptionPitch = action.payload;
	},
	exitPitchMode: (state) => {
	  state.insertOptionOptions = state.insertOptionOptionsSoft;
	  state.insertOptionPitch = null;
	  const labels = state.insertOptionOptions.map(o => o.label);
	  const filtered = filter(state.symbolsFilteredByName, (symbol) =>
	    labels.length === 0 || (difference(labels, symbol.opts).length === 0)
	  );
	  state.symbolsFilteredByOptions = filtered;
	  state.currentSymbols = filtered;
	},
    setError: (state, action) => { state.error = action.payload },
    clearError: (state) => { state.error = '' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchZnamenSymbols.fulfilled, (state, action) => { state.znamenSymbols = action.payload })
      .addCase(fetchDemestvoSymbols.fulfilled, (state, action) => { state.demestvoSymbols = action.payload })
      .addCase(fetchSources.fulfilled, (state, action) => { state.sources = action.payload })
      .addCase(fetchCompositions.fulfilled, (state, action) => { state.compositions = action.payload })
  },
})

export const {
  setSymbols,
  filterByName,
  filterByOptions,
  filterByOptionsStrict,
  filterByOptionsLegacy,
  filterByPitch,
  filterByPitchLegacy,
  createOptionsList,
  createPitchList,
  createNamesList,
  addTextToSyllable,
  setIsOptionsMode,
  setIsPitchMode,
  setIsDemestvoMode,
  setError,
  setType,
  setSource,
  clearError,
  setInsertOptionName,
  setInsertOptionSoft,
  setInsertOptionPitch,
  setClearCurrentSymbols,
  exitPitchMode,
} = symbolsSlice.actions

export default symbolsSlice.reducer
