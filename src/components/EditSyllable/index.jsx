import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { hideModal } from '../../slices/paperSlice'
import InsertSyllable from '../InsertSyllable'

const EditSyllable = () => {
  const dispatch = useDispatch()
  const showModalEdit = useSelector(state => state.paper.showModalEdit)

  const handleClose = () => dispatch(hideModal())

  return (
    <Modal isOpen={showModalEdit}>
      <ModalHeader toggle={handleClose}>Редактирование</ModalHeader>
      <ModalBody>
        <InsertSyllable />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>Отмена</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditSyllable
