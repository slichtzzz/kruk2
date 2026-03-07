import React from 'react'
import { useDispatch } from 'react-redux'
import {
  removeSyllableByIndex,
  repeatSyllableByIndex,
  showModalEdit,
  showModalInsert,
  changePage,
  changeParagraph,
  checkParagraphIsEmpty,
} from '../../slices/paperSlice'

const EditButtons = ({ index, pageIndex, paragraphIndex }) => {
  const dispatch = useDispatch()

  const handleRemove = () => {
    dispatch(changePage(pageIndex))
    dispatch(changeParagraph(paragraphIndex))
    dispatch(removeSyllableByIndex(index))
    dispatch(checkParagraphIsEmpty())
  }

  const handleRepeat = () => {
    dispatch(changePage(pageIndex))
    dispatch(changeParagraph(paragraphIndex))
    dispatch(repeatSyllableByIndex(index))
  }

  const handleEdit = () => {
    dispatch(changePage(pageIndex))
    dispatch(showModalEdit(index))
  }

  const handleInsert = () => {
    dispatch(changePage(pageIndex))
    dispatch(showModalInsert(index))
  }

  return (
    <div>
      <button onClick={handleRemove} className="syllable-button remove">
        <i className="icon-bin" />
      </button>
      <button onClick={handleRepeat} className="syllable-button repeat">
        <i className="icon-copy" />
      </button>
      <button onClick={handleInsert} className="syllable-button insert">
        <i className="icon-plus" />
      </button>
      <button onClick={handleEdit} className="syllable-button edit">
        <i className="icon-pen" />
      </button>
    </div>
  )
}

export default EditButtons
