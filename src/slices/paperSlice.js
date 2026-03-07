import { createSlice } from '@reduxjs/toolkit'
import { dropRight, clone, isNil } from 'lodash'

// Инициализация документа
let document = [[]]
if (!isNil(localStorage.getItem('pages'))) {
  document = JSON.parse(localStorage.getItem('pages'))
}
document = document.map((page) => page.filter((p) => p))

const initialState = {
  syllables: document,
  currentPageNum: document.length === 0 ? 0 : document.length - 1,
  currentParagraphNum: isNil(document[document.length - 1])
    ? 0
    : document[document.length - 1].length === 0
    ? 0
    : document[document.length - 1].length - 1, // eslint-disable-line
  showPagination: true,
  showModalEdit: false,
  showModalInsert: false,
  showModalEditText: false,
  showModalDeleteParagraph: false,
  showModalDeletePage: false,
  editableSyllable: null,
  indexToInsert: null,
  indexOfEditableText: null,
  indexOfDeletingParagraph: null,
  indexOfDeletingPage: null,
}

const paperSlice = createSlice({
  name: 'paper',
  initialState,
  reducers: {
    //addSyllable: (state, action) => {
      //const { currentPageNum, currentParagraphNum, syllables } = state
      //const currentParagraph = syllables[currentPageNum]?.[currentParagraphNum] || []
      //const updatedParagraph = [...currentParagraph, action.payload]
      //if (!state.syllables[currentPageNum]) state.syllables[currentPageNum] = []
      //state.syllables[currentPageNum][currentParagraphNum] = updatedParagraph
      //localStorage.setItem('pages', JSON.stringify(state.syllables))
    //},
    addSyllable: (state, action) => {
		const { currentPageNum, currentParagraphNum } = state
		// Проверяем, что syllables существует и инициализируем, если нужно
		if (!state.syllables) state.syllables = []
		if (!state.syllables[currentPageNum]) state.syllables[currentPageNum] = []
		const currentParagraph = state.syllables[currentPageNum][currentParagraphNum] || []
		const updatedParagraph = [...currentParagraph, action.payload]
		// Сохраняем обновленное значение в state
		state.syllables[currentPageNum][currentParagraphNum] = updatedParagraph
		// Сохраняем обновленное состояние в localStorage
		localStorage.setItem('pages', JSON.stringify(state.syllables))
		},

    removeLastSyllable: (state) => {
      const { currentPageNum, currentParagraphNum, syllables } = state
      const currentParagraph = syllables[currentPageNum]?.[currentParagraphNum] || []
      state.syllables[currentPageNum][currentParagraphNum] = dropRight(currentParagraph)
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    removeSyllableByIndex: (state, action) => {
      const { currentPageNum, currentParagraphNum, syllables } = state
      const currentParagraph = [...(syllables[currentPageNum]?.[currentParagraphNum] || [])]
      currentParagraph.splice(action.payload, 1)
      state.syllables[currentPageNum][currentParagraphNum] = currentParagraph
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    repeatSyllableByIndex: (state, action) => {
      const { currentPageNum, currentParagraphNum, syllables } = state
      const currentParagraph = [...(syllables[currentPageNum]?.[currentParagraphNum] || [])]
      const syllableToRepeat = clone(currentParagraph[action.payload])
      currentParagraph.push(syllableToRepeat)
      state.syllables[currentPageNum][currentParagraphNum] = currentParagraph
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    changeSyllable: (state, action) => {
      const { currentPageNum, currentParagraphNum, syllables } = state
      const { indexOfChangingSyllable, syllable } = action.payload;
      const currentParagraph = [...(syllables[currentPageNum]?.[currentParagraphNum] || [])]
      currentParagraph[indexOfChangingSyllable] = syllable
      state.syllables[currentPageNum][currentParagraphNum] = currentParagraph
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    insertSyllable: (state, action) => {
      const { currentPageNum, currentParagraphNum, syllables } = state
      const { index, syllable } = action.payload
      const currentParagraph = [...(syllables[currentPageNum]?.[currentParagraphNum] || [])]
      currentParagraph.splice(index + 1, 0, syllable)
      state.syllables[currentPageNum][currentParagraphNum] = currentParagraph
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    editText: (state, action) => {
      const { currentPageNum, currentParagraphNum, syllables, indexOfEditableText } = state
      const currentParagraph = [...(syllables[currentPageNum]?.[currentParagraphNum] || [])]
      currentParagraph[indexOfEditableText].text = action.payload
      state.syllables[currentPageNum][currentParagraphNum] = currentParagraph
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    setSyllables: (state, action) => {
      state.syllables = action.payload
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    addPage: (state) => {
      state.syllables.push([])
      state.currentPageNum = state.syllables.length - 1
      state.currentParagraphNum = 0
    },

    changePage: (state, action) => {
      state.currentPageNum = action.payload
    },

    changeParagraph: (state, action) => {
      state.currentParagraphNum = action.payload
    },

    removePage: (state, action) => {
      state.syllables.splice(action.payload, 1)
      if (state.currentPageNum >= action.payload) {
        state.currentPageNum = Math.max(0, state.currentPageNum - 1)
      }
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    deleteParagraph: (state, action) => {
      state.syllables[state.currentPageNum].splice(action.payload, 1)
      localStorage.setItem('pages', JSON.stringify(state.syllables))
    },

    // UI модалки
    showModalEdit: (state, action) => {
      state.showModalEdit = true
      state.editableSyllable = action.payload
      console.log(state.editableSyllable);
    },
    showModalInsert: (state, action) => {
      state.showModalEdit = true
      state.indexToInsert = action.payload
    },
    hideModal: (state) => {
      state.showModalEdit = false
      state.showModalInsert = false
      state.editableSyllable = null
      state.indexToInsert = null
    },
    showModalEditText: (state, action) => {
      state.showModalEditText = true
      state.indexOfEditableText = action.payload
    },
    hideModalEditText: (state) => {
      state.showModalEditText = false
      state.indexOfEditableText = null
    },
    toggleShowPagination: (state) => {
      state.showPagination = !state.showPagination
    },
    checkParagraphIsEmpty: (state) => {
		const currentParagraph =
		state.syllables[state.currentPageNum]?.[state.currentParagraphNum] || []
		if (currentParagraph.length === 0) {
		  state.syllables[state.currentPageNum].splice(state.currentParagraphNum, 1)
		  localStorage.setItem('pages', JSON.stringify(state.syllables))
	   }
	},
	showModalDeleteParagraph: (state, action) => {
	  state.showModalDeleteParagraph = true
	  state.indexOfDeletingParagraph = action.payload
     },
    hideModalDeleteParagraph: (state) => {
      state.showModalDeleteParagraph = false
      state.indexOfDeletingParagraph = null
	 },
	toggleModalDeletePage: (state, action) => {
    const indexOfDeletingPage = action.payload
    if (state.showModalDeletePage) {
      state.showModalDeletePage = false
      state.indexOfDeletingPage = null
    } else {
      state.showModalDeletePage = true
      state.indexOfDeletingPage = indexOfDeletingPage
      }
    }, 
  },
})

export const {
  addSyllable,
  removeLastSyllable,
  removeSyllableByIndex,
  repeatSyllableByIndex,
  changeSyllable,
  insertSyllable,
  editText,
  setSyllables,
  addPage,
  changePage,
  changeParagraph,
  removePage,
  deleteParagraph,
  showModalEdit,
  showModalInsert,
  hideModal,
  showModalEditText,
  hideModalEditText,
  toggleShowPagination,
  checkParagraphIsEmpty,
  showModalDeleteParagraph,
  hideModalDeleteParagraph,
  toggleModalDeletePage
} = paperSlice.actions

export default paperSlice.reducer
