import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  changeParagraph,
  addSyllable,
  toggleShowPagination,
} from '../../slices/paperSlice'
import './style.css'

export const InsertText = () => {
  const dispatch = useDispatch()

  const syllables = useSelector((state) => state.paper.syllables)
  const currentPageNum = useSelector((state) => state.paper.currentPageNum)
  const currentParagraphNum = useSelector((state) => state.paper.currentParagraphNum)
  const showPagination = useSelector((state) => state.paper.showPagination)

  const [textInput, setTextInput] = useState('')
  const [bucvicaInput, setBucvicaInput] = useState('')
//TODO: merge functions
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
      <div className="field field-insert-text">
        <label htmlFor="Name">Вставить текст</label>
        <input
          label="Текст"
          name="text"
          className="form-control ucs-text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={addText}
        />
      </div>

      <button type="button" className="btn btn-primary" style={{ width: '80px', marginLeft: '30px' }} onClick={newParagraph}>
        Новый абзац
      </button>
	</div>
      <div className="field field-insert-bucvica">
        <label htmlFor="Name">Вставить буквицу</label>
        <input
          label="Буквица"
          name="bucvica"
          className="form-control"
          value={bucvicaInput}
          onChange={(e) => setBucvicaInput(e.target.value)}
          onKeyPress={addBucvica}
        />
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
