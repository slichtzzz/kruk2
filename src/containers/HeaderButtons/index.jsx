import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveAs } from 'file-saver'
import { getDate } from '../../utils'
import { setSyllables } from '../../slices/paperSlice'
import { updatePaperStyle } from '../../slices/paperStyleSlice'
import { Help } from '../index'
import './style.css'

export const HeaderButtons = () => {
  const dispatch = useDispatch()
  const paper = useSelector(state => state.paper)
  const paperStyle = useSelector(state => state.paperStyle)

  const [showModalHelp, setShowModalHelp] = useState(false)
  const [redMarksHidden, setRedMarksHidden] = useState(false)

  // 🔹 Модалка помощи
  const toggleModalHelp = () => setShowModalHelp(prev => !prev)

  // 🔹 Удаление/показ красных пометок
  const handleRemoveRedMarks = () => {
    const existingStyle = document.getElementById('hide-red-marks-style')
    if (redMarksHidden) {
      if (existingStyle) existingStyle.remove()
      setRedMarksHidden(false)
    } else {
      if (!existingStyle) {
        const style = document.createElement('style')
        style.id = 'hide-red-marks-style'
        style.textContent = '.red { color: #ffffff !important; }'
        document.head.appendChild(style)
      }
      setRedMarksHidden(true)
    }
  }

  // 🔹 Импорт JSON файла
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result)
        if (data.settings) {
          dispatch(updatePaperStyle(data.settings))
        }
        dispatch(setSyllables(data.syllables))
      } catch (err) {
        console.error('Ошибка при чтении файла:', err)
      }
    }
    reader.readAsText(file)
  }

  // 🔹 Экспорт в JSON
  const downloadFile = () => {
    const {
      symbolFontSize,
      textFontSize,
      marginTop,
      marginBottom,
      fontOfTextInSyllables,
      sizeOfBucvica,
    } = paperStyle

    const file = {
      syllables: paper.syllables,
      settings: {
        symbolFontSize,
        textFontSize,
        marginTop,
        marginBottom,
        fontOfTextInSyllables,
        sizeOfBucvica,
      },
    }

    const blob = new Blob([JSON.stringify(file)], { type: 'application/json;charset=utf-8' })
    saveAs(blob, `domestikos-${getDate()}.json`)
  }

  return (
    <>
      <Help toggle={toggleModalHelp} showModalHelp={showModalHelp} />
      <div className="import-export">
        <div id="hidden-export-container" style={{ display: 'none' }} />
        <div className="file btn-light btn">
          Загрузить из файла
          <input
            className="input-upload"
            type="file"
            name="myfile"
            onChange={handleFile}
          />
        </div>
        <button
          className="btn btn-light button-download"
          onClick={downloadFile}
        >
          Экспорт в файл
        </button>
        <button
          className="btn btn-light button-download"
          style={{ marginLeft: '10px' }}
          onClick={handleRemoveRedMarks}
        >
          {redMarksHidden ? 'С пометами' : 'Без помет'}
        </button>
        <button
          className="btn button-help btn-primary button-help"
          onClick={toggleModalHelp}
        >
          Помощь
        </button>
      </div>
    </>
  )
}

export default HeaderButtons
