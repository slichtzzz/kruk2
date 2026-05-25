import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { deleteParagraph, hideModalDeleteParagraph } from '../../slices/paperSlice'

export const RemoveParagraph = () => {
  const dispatch = useDispatch()
  const showModalDeleteParagraph = useSelector(
    state => state.paper.showModalDeleteParagraph
  )
  const indexOfDeletingParagraph = useSelector(
    state => state.paper.indexOfDeletingParagraph
  )

  const handleYes = () => {
    if (indexOfDeletingParagraph !== null) {
      dispatch(deleteParagraph(indexOfDeletingParagraph))
    }
    dispatch(hideModalDeleteParagraph())
  }

  const handleCancel = () => {
    dispatch(hideModalDeleteParagraph())
  }

  return (
    <Modal isOpen={showModalDeleteParagraph}>
      <ModalHeader toggle={handleCancel}>Удаление параграфа</ModalHeader>
      <ModalBody>
        <p>Вы уверены что хотите удалить этот параграф?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleYes}>Да</Button>
        <Button color="secondary" onClick={handleCancel}>Отмена</Button>
      </ModalFooter>
    </Modal>
  )
}

export default RemoveParagraph
