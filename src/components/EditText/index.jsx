import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { hideModalEditText, editText } from '../../slices/paperSlice'
import { ucsToUnicode } from '../../utils'

export const EditText = () => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  
  const showModalEditText = useSelector((state) => state.paper.showModalEditText)
  const ucsFont = useSelector((state) => state.paperStyle.fontOfTextInSyllables)
  const indexOfEditableText  = useSelector((state) => state.paper.indexOfEditableText)

  const [text, setText] = useState('')

  // Фокус при открытии
  useEffect(() => {
    if (showModalEditText) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [showModalEditText])

  const handleChange = (e) => {
    const rawValue = e.target.value || ''
    const selectionStart = e.target.selectionStart
    const converted = ucsToUnicode(rawValue)
    setText(converted)
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(selectionStart, selectionStart)
      }
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      dispatch(editText(text))
      dispatch(hideModalEditText())
      setText('')
    }
  }

const submitData = () => {
    dispatch(editText(text));
    dispatch(hideModalEditText());
    setText('');
};


  const cancel = () => {
    dispatch(hideModalEditText())
    setText('')
  }

  return (
    <Modal isOpen={showModalEditText} toggle={cancel}>
      <ModalHeader toggle={cancel}>Изменить текст</ModalHeader>
      <ModalBody>
        <p>Введите новый текст и нажмите Enter</p>
        <form onKeyDown={handleKeyPress}>
          <input
            ref={inputRef}
            type="text"
            value={text ?? ''} 
            onChange={handleChange}
            className="inputText form-control"
            style={{ 
              fontFamily: ucsFont,
              fontSize: '1.2rem' 
            }}
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submitData}>
          Сохранить
        </Button>
        <Button color="secondary" onClick={cancel}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditText
