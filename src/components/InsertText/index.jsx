import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  changeParagraph,
  addSyllable,
  toggleShowPagination,
} from '../../slices/paperSlice'
import { unicodeSlavonic } from '../../utils'
import './style.css'

export const InsertText = () => {
  const dispatch = useDispatch()

  const syllables = useSelector((state) => state.paper.syllables)
  const currentPageNum = useSelector((state) => state.paper.currentPageNum)
  const currentParagraphNum = useSelector((state) => state.paper.currentParagraphNum)
  const showPagination = useSelector((state) => state.paper.showPagination)
  const ucsFont = useSelector((state) => state.paperStyle.fontOfTextInSyllables)


  const [textInput, setTextInput] = useState('')
  const [bucvicaInput, setBucvicaInput] = useState('')
  const textInputRef = React.useRef(null);
  
const handleTextChange = (e) => {
  const rawValue = e.target.value;
  const selectionStart = e.target.selectionStart;
  setTextInput(rawValue);
  requestAnimationFrame(() => {
    if (textInputRef.current) {
      textInputRef.current.setSelectionRange(selectionStart, selectionStart);
    }
  });
};


  const addText = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!textInput.trim()) return       // <-- проверка на пустую строку
      const text = { value: '', text: textInput, type: 'TEXT' }
      dispatch(addSyllable(text))
      setTextInput('')
    }
  }

  const addBucvica = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!bucvicaInput.trim()) return       // <-- проверка на пустую строку
      const bucvica = { value: '', text: bucvicaInput, type: 'BUCVICA' }
      dispatch(addSyllable(bucvica))
      setBucvicaInput('')
    }
  }

  const newParagraph = () => {
    if (!syllables[currentPageNum] || !syllables[currentPageNum][currentParagraphNum]) {
      return
    }
    const numOfLastParagraphOnPage = syllables[currentPageNum].length - 1
    const newParagraphNum = numOfLastParagraphOnPage + 1
    dispatch(changeParagraph(newParagraphNum))
  }

  const togglePagination = () => {
    dispatch(toggleShowPagination())
  }

  return (
    <div className="insert-text text-left">
      <h4 className="text-left">Вставка текста</h4>
	<div style={{ display: 'flex' }}>
      <div className="field">
        <label htmlFor="Name">Вставить буквицу</label>
        <input
          label="Буквица"
          name="bucvica"
          className="form-control"
          style={{ padding: '5px'}}
          value={bucvicaInput}
          onChange={(e) => setBucvicaInput(e.target.value)}
          onKeyPress={addBucvica}
        />
      </div>

      <button type="button" className="btn btn-primary" style={{ width: '300px', height: '50px' , marginLeft: '3px' }} onClick={newParagraph}>
        Новый абзац
      </button>
	</div>

      <div className="field field-insert-text">
        <label htmlFor="Name">Вставить текст</label>
        <input
          label="Текст"
          name="text"
          className="form-control"
          onChange={handleTextChange}
          innerRef={textInputRef}
          onKeyPress={addText}
          style={{ 
            fontSize: '1.2rem',
            minHeight: '45px'
          }}
        />
		{textInput && (
		  <div className="preview-label" style={{ marginTop: '5px', width: '290px' }}>
		    <span 
		      style={{ fontFamily: ucsFont, fontSize: '1.7rem' }}
		      dangerouslySetInnerHTML={{ __html: unicodeSlavonic(textInput) }} 
		    />
		  </div>
		)}
      </div>

      <div className="toggleShowPagination custom-control custom-checkbox">
        <input
          type="checkbox"
          checked={showPagination}
          className="custom-control-input"
          id="showPagination"
          onChange={togglePagination}
        />
        <label className="custom-control-label" htmlFor="showPagination">
          Отображать номера страниц
        </label>
      </div>
    </div>
  )
}

export default InsertText
