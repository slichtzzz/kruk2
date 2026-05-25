import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ButtonRemove from '../../components/ButtonRemove'
import { unicodeSlavonic } from '../../utils'
import './style.css'

const Text = ({ text, index, pageIndex }) => {
	const paperStyle = useSelector(state => state.paperStyle)
	return (
  <div
	className="text-line"
	style={{ fontSize: `${paperStyle.textFontSize}pt`, fontFamily: `${paperStyle.fontOfTextInSyllables}` }} 
	>
    <span 
      dangerouslySetInnerHTML={{ __html: unicodeSlavonic(text) }} 
    />
    
    <ButtonRemove
      index={index}
      pageIndex={pageIndex}
      className="text-remove-button"
    />
  </div>
)}

export default Text
