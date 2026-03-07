import React from 'react'
import { useDispatch } from 'react-redux'
import {
  removeSyllableByIndex,
  checkParagraphIsEmpty,
  changePage,
} from '../../slices/paperSlice'

const ButtonRemove = ({ index, pageIndex, className }) => {
  const dispatch = useDispatch()

  const removeSyllable = () => {
    dispatch(changePage(pageIndex))
    dispatch(removeSyllableByIndex(index))
    dispatch(checkParagraphIsEmpty())
  }

  return (
    <button name={index} onClick={removeSyllable} className={className}>
      <i className="icon-bin" />
    </button>
  )
}

export default ButtonRemove
