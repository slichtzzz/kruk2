import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const Attention = ({ className = '' }) => {
  const [modal, setModal] = useState(true)

  const toggle = () => {
    setModal(prevModal => !prevModal)
    localStorage.setItem('visited', 'true')
  }

  return (
    <Modal isOpen={modal} toggle={toggle} className={className}>
      <ModalHeader toggle={toggle}>Предупреждение</ModalHeader>
      <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <p>Здравствуйте!</p>
        <p>
          Программа &quot;Доместикос&quot; находится в стадии тестирования, поэтому
          разработчик не отвечает за последствия работы приложения.
        </p>
        <p>
          Не рекомендуется набирать большие тексты (если вы потратите на это много
          времени, а из-за ошибки что-то пойдет не так, это будет печально).
        </p>
        <p>
          В любом случае прошу прощения за возможные недоразумения, и прошу все
          замеченные ошибки присылать по адресу <b>mail@jesser.ru</b>.
        </p>
        <p>Благодарю за внимание!</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Я понял
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default Attention
