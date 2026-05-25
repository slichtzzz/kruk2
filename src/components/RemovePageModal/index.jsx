import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { toggleModalDeletePage, removePage } from '../../slices/paperSlice'

export const RemovePageModal = () => {
  const dispatch = useDispatch()
  const showModalDeletePage = useSelector(state => state.paper.showModalDeletePage)
  const indexOfDeletingPage = useSelector(state => state.paper.indexOfDeletingPage)

  const handleYes = () => {
    if (indexOfDeletingPage !== null) {
      dispatch(removePage(indexOfDeletingPage))
    }
    dispatch(toggleModalDeletePage())
  }

  const handleCancel = () => {
    dispatch(toggleModalDeletePage())
  }

  return (
    <Modal isOpen={showModalDeletePage}>
      <ModalHeader toggle={handleCancel}>Удаление страницы</ModalHeader>
      <ModalBody>
        <p>Вы уверены что хотите удалить эту страницу?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleYes}>
          Да
        </Button>
        <Button color="secondary" onClick={handleCancel}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default RemovePageModal
