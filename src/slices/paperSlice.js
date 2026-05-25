import { createSlice } from '@reduxjs/toolkit'
import { dropRight, clone, isNil } from 'lodash'

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
  isDownloadFromStoreModal: false,
  isUploadToStoreModal: false,
  showNoteString: false,
  editableSyllable: null,
  indexToInsert: null,
  indexOfEditableText: null,
  indexOfDeletingParagraph: null,
  indexOfDeletingPage: null,
  isCanvasMode: false,
  isPlayNotes: false,
  playStopIndex: null,
  playStopParagraphIndex: null,
  playStopPageIndex: null,
  playToPageIndex: null,
  playToParagraphIndex: null,
  playToIndex: null,
  isSequencePlaying: false,
  isLegacyMode: false,
  isOpen: false,
}

const paperSlice = createSlice({
  name: 'paper',
  initialState,
  reducers: {
    addSyllable: (state, action) => {
		const { currentPageNum, currentParagraphNum } = state
		if (!state.syllables) state.syllables = []
		if (!state.syllables[currentPageNum]) state.syllables[currentPageNum] = []
		const currentParagraph = state.syllables[currentPageNum][currentParagraphNum] || []
		const updatedParagraph = [...currentParagraph, action.payload]
		state.syllables[currentPageNum][currentParagraphNum] = updatedParagraph
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
    setShowNotes: (state, action) => {
		state.showNoteString = action.payload
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
    },
    showModalInsert: (state, action) => {
      state.showModalEdit = true
      state.indexToInsert = action.payload
    },
    showDownloadFromStoreModal: (state, action) => {
      state.isDownloadFromStoreModal = action.payload
    },
    showUploadToStoreModal: (state, action) => {
      state.isUploadToStoreModal = action.payload
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
	toggleCanvasMode: (state) => {
	  state.isCanvasMode = !state.isCanvasMode;
	  if (state.isCanvasMode) {
	    const allSymbols = state.syllables.flat(2);
	    state.syllables = [[allSymbols]]; 
	  }
	},
	moveSyllableToNextPage: (state, action) => {
	  const { pageIndex } = action.payload;
	  const currentPages = state.syllables;
	  if (pageIndex < currentPages.length - 1) {
	    const currentPage = currentPages[pageIndex];
	    const nextPage = currentPages[pageIndex + 1];
	    let lastParaIdx = -1;
	    for (let i = currentPage.length - 1; i >= 0; i--) {
	      if (Array.isArray(currentPage[i]) && currentPage[i].length > 0) {
	        lastParaIdx = i;
	        break;
	      }
	    }
	    if (lastParaIdx !== -1) {
	      const movedSyllable = currentPage[lastParaIdx].pop();
	      if (!nextPage[0]) {
	        nextPage[0] = [];
	      }
	      nextPage[0].unshift(movedSyllable);
	      if (currentPage[lastParaIdx].length === 0) {
	        if (currentPage.length > 1) {
	          currentPage.splice(lastParaIdx, 1);
	        }
	      }
	    }
	  }
	},
	moveSyllableToPrevPage: (state, action) => {
	  const { pageIndex } = action.payload;
	  if (pageIndex > 0) {
	    const currentPages = state.syllables;
	    const currentPage = currentPages[pageIndex];
	    const prevPage = currentPages[pageIndex - 1];
	    const firstParaIdx = currentPage.findIndex(para => para.length > 0);
	    if (firstParaIdx !== -1) {
	      const movedSyllable = currentPage[firstParaIdx].shift();
	      const lastParaIdxPrevPage = prevPage.length - 1;
	      prevPage[lastParaIdxPrevPage].push(movedSyllable);
	      if (currentPage[firstParaIdx].length === 0) {
	        if (currentPage.length > 1) {
	          currentPage.splice(firstParaIdx, 1);
	        }
	      }
	    }
	  }
	},
	setAllPages: (state, action) => {
	  state.syllables = action.payload;
	},
	setPlayNotes: (state, action) => {
	  state.isPlayNotes = action.payload;
	},
	setPlayStop: (state, action) => {
	const { pageIndex, paragraphIndex, syllableIndex } = action.payload;
    if (state.isPlayNotes) {
      state.playStopIndex = syllableIndex;
      state.playStopParagraphIndex = paragraphIndex;
      state.playStopPageIndex = pageIndex;
    }
  },
    setPlayingNow: (state, action) => {
    const { pIdx, paraIdx, sIdx } = action.payload;
    state.playToPageIndex = pIdx;
    state.playToParagraphIndex = paraIdx;
    state.playToIndex = sIdx;
  },
	clearPlaybackStyles: (state) => {
	  state.playToPageIndex = null;
	  state.playToParagraphIndex = null;
	  state.playToIndex = null;
	  state.playStopPageIndex = null;
	  state.playStopParagraphIndex = null;
	  state.playStopIndex = null;
	},
	setIsSequencePlaying: (state, action) => {
	  state.isSequencePlaying = action.payload;
	},
	setLegacyMode: (state, action) => {
	  state.isLegacyMode = action.payload;
	  state.isOpen = false;
	},
	setPanelOpen: (state, action) => {
	  state.isOpen = action.payload;
	},
	stopAll: (state) => {
	  state.isSequencePlaying = false;
	  state.playToPageIndex = null;
	  state.playToParagraphIndex = null;
	  state.playToIndex = null;
	  state.playStopPageIndex = null;
	  state.playStopParagraphIndex = null;
	  state.playStopIndex = null;
	}
 }
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
  showDownloadFromStoreModal,
  showUploadToStoreModal,
  hideModal,
  showModalEditText,
  hideModalEditText,
  toggleShowPagination,
  checkParagraphIsEmpty,
  showModalDeleteParagraph,
  hideModalDeleteParagraph,
  toggleModalDeletePage,
  setShowNotes,
  toggleCanvasMode,
  moveSyllableToPrevPage,
  setAllPages,
  setPlayNotes,
  setPlayStop,
  setPlayingNow,
  clearPlaybackStyles,
  stopAll,
  setIsSequencePlaying,
  moveSyllableToNextPage,
  setLegacyMode,
  setPanelOpen
} = paperSlice.actions

export default paperSlice.reducer
