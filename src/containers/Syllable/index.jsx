import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EditButtons from '../../components/EditButtons'
import {
  changePage,
  showModalEditText,
} from '../../slices/paperSlice'

import './style.css'

const Syllable = ({ value, text, index, pageIndex, paragraphIndex }) => {
  const dispatch = useDispatch()
  const paperStyle = useSelector(state => state.paperStyle)

  const handleEditText = () => {
    dispatch(changePage(pageIndex))
    dispatch(showModalEditText(index))
  }
  const symbolStyle = {
    fontSize: `${paperStyle.symbolFontSize}pt`,
  }

  const textStyle = {
    fontSize: `${paperStyle.textFontSize}pt`,
    marginTop: `${paperStyle.marginTop}pt`,
    marginBottom: `${paperStyle.marginBottom}pt`,
    lineHeight: '1pt',
    fontFamily: paperStyle.fontOfTextInSyllables,
  }

  return (
    <div className="syllable">
      <div
        className="symbol"
        style={symbolStyle}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      <div
        id={index}
        className="text"
        style={textStyle}
        onClick={handleEditText}
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <EditButtons
        index={index}
        pageIndex={pageIndex}
        paragraphIndex={paragraphIndex}
      />
    </div>
  )
}

export default Syllable
