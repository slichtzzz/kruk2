import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { hideModalEditText, editText } from '../../slices/paperSlice' // новые слайсы

export const EditText = () => {
  const dispatch = useDispatch()

  // Состояние модального окна и индекс редактируемого текста
  const showModalEditText = useSelector((state) => state.paper.showModalEditText)
  const indexOfEditableText = useSelector((state) => state.paper.indexOfEditableText)

  // Шрифт слогов из слайса paperStyleSlice
  const ucsFont = useSelector(
    (state) => state.paperStyle.fontOfTextInSyllables
  )

  // Локальное состояние поля ввода
  const [text, setText] = useState('')

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      dispatch(editText(text))
      dispatch(hideModalEditText())
    }
  }

  const cancel = () => {
    dispatch(hideModalEditText())
  }

  return (
    <Modal isOpen={showModalEditText}>
      <ModalHeader toggle={cancel}>Изменить текст</ModalHeader>
      <ModalBody>
        <p>Введите новый текст и нажмите Enter</p>
        <form onKeyPress={handleKeyPress}>
          <input
            type="text"
            name="name"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ fontFamily: ucsFont }}
            className="inputTextUCS form-control"
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={cancel}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditText
