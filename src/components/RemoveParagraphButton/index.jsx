import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { showModalDeleteParagraph, changePage } from '../../slices/paperSlice'

export const RemoveParagraphButton = ({ paragraphIndex, pageIndex }) => {
  const dispatch = useDispatch()

  const handleRemove = (e) => {
    e.stopPropagation()
      dispatch(changePage(pageIndex))
      dispatch(showModalDeleteParagraph(paragraphIndex))
  }

  return (
    <button
      name={paragraphIndex}
      onClick={handleRemove}
      className="paragraph-remove-button"
    >
      <i className="icon-bin" />
    </button>
  )
}

RemoveParagraphButton.propTypes = {
  paragraphIndex: PropTypes.number.isRequired,
  pageIndex: PropTypes.number,
}

export default RemoveParagraphButton
