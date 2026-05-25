import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { hideModal } from '../../slices/paperSlice'
import { InsertSyllable, CurrentSymbols, HelpSection } from '../'
import './style.css'

const EditSyllable = () => {
  const dispatch = useDispatch()
  const showModalEdit = useSelector(state => state.paper.showModalEdit)

  const handleClose = () => dispatch(hideModal())

  return (
	<Modal isOpen={showModalEdit} size="xl" contentClassName="custom-modal-height">
	  <ModalHeader toggle={handleClose}>Редактирование</ModalHeader>
	  <ModalBody className="modal-body-layout">
	    <aside className="modal-column column-help">
	      <HelpSection />
	    </aside>
	    <section className="modal-column column-insert">
	      <InsertSyllable />
	    </section>
	    <section className="modal-column column-symbols">
	      <CurrentSymbols />
	    </section>
	  </ModalBody>
	
	  <ModalFooter>
	    <Button color="secondary" onClick={handleClose}>Отмена</Button>
	  </ModalFooter>
	</Modal>
  )
}

export default EditSyllable
