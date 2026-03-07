import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { changePage, toggleModalDeletePage } from '../../slices/paperSlice'

export const RemovePageButton = ({ pageIndex }) => {
  const dispatch = useDispatch()

  const handleRemovePage = (e) => {
    e.stopPropagation()
    dispatch(changePage(pageIndex)) //Set PageIndex as paper.currentPage
    dispatch(toggleModalDeletePage(pageIndex)) //Toggle value of paper.showModalDeletePage
  }

  return (
    <Button
      color="danger"
      name={pageIndex}
      onClick={handleRemovePage}
      className="page-remove-button"
    >
      Удалить страницу
    </Button>
  )
}

RemovePageButton.propTypes = {
  pageIndex: PropTypes.number.isRequired,
}

export default RemovePageButton
