import React, { useCallback } from 'react'
import './style.css'

const Break = React.memo(({ index, pageIndex, removeSyllablebyIndex, changePage }) => {
  
  const handleRemove = useCallback(() => {
    if (changePage && removeSyllablebyIndex) {
      changePage(pageIndex)
      removeSyllablebyIndex(index)
    }
  }, [changePage, removeSyllablebyIndex, index, pageIndex])

  return (
    <div className="paper-item-break-box">
      <span className="break-icon">¶</span>
      <button
        onClick={handleRemove}
        className="bucvica-button"
        aria-label="Удалить разрыв строки"
      >
        <i className="icon-bin" />
      </button>
    </div>
  )
})

export default Break
