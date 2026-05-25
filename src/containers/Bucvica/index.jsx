import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './style.css'

const Bucvica = React.memo(({ form, text, index, pageIndex, removeSyllablebyIndex, changePage }) => {
  const paperStyle = useSelector(state => state.paperStyle)
  const sizeOfBucvica = paperStyle.sizeOfBucvica;

  const handleRemove = useCallback(() => {
    if (changePage && removeSyllablebyIndex) {
      changePage(pageIndex)
      removeSyllablebyIndex(index)
    }
  }, [changePage, removeSyllablebyIndex, index, pageIndex])

  const fontSize = sizeOfBucvica ? `${sizeOfBucvica}pt` : 'inherit'
  const height = sizeOfBucvica ? sizeOfBucvica : 'auto'

  return (
    <div className="bucvica" style={{ fontSize, height }}>
      {text}
      <button
        name={index}
        onClick={handleRemove}
        className="bucvica-button"
        aria-label="Удалить буквицу"
      >
        <i className="icon-bin" />
      </button>
    </div>
  )
})

export default Bucvica
