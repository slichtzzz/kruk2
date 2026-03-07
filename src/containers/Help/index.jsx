import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import AddGif from '../../res/img/help/add.gif'
import ChangeGif from '../../res/img/help/change.gif'
import DoubleGif from '../../res/img/help/copy.gif'
import TextGif from '../../res/img/help/text.gif'
import RemoveGif from '../../res/img/help/rm.gif'
import InsertGif from '../../res/img/help/insert.gif'
import SaveJsonGif from '../../res/img/help/save-json.gif'
import LoadJsonGif from '../../res/img/help/upload-json.gif'
import PDFGif from '../../res/img/help/pdf.gif'
import CompositionGif from '../../res/img/help/composition.gif'
import ElementsGif from '../../res/img/help/elements.gif'

import './style.css'

const Help = ({ showModalHelp, toggle }) => {
  const handleScrollTo = (id) => (e) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Modal size="lg" isOpen={showModalHelp} toggle={toggle}>
      <ModalHeader toggle={toggle}>Помощь</ModalHeader>
      <ModalBody>
        <h4>Оглавление</h4>
        <ol>
          <li><a href="#add" onClick={handleScrollTo('add')}>Вставка крюка</a></li>
          <li><a href="#change" onClick={handleScrollTo('change')}>Изменение крюка</a></li>
          <li><a href="#double" onClick={handleScrollTo('double')}>Дублирование крюка</a></li>
          <li><a href="#text" onClick={handleScrollTo('text')}>Изменение текста</a></li>
          <li><a href="#rm" onClick={handleScrollTo('rm')}>Удаление крюка</a></li>
          <li><a href="#insert" onClick={handleScrollTo('insert')}>Вставка крюка в середину</a></li>
          <li><a href="#composition" onClick={handleScrollTo('composition')}>Вставка попевки</a></li>
          <li><a href="#elements" onClick={handleScrollTo('elements')}>Вставка строк текста, буквиц и переноса</a></li>
          <li><a href="#json_save" onClick={handleScrollTo('json_save')}>Сохранение в исходный код</a></li>
          <li><a href="#json_load" onClick={handleScrollTo('json_load')}>Загрузка из исходного кода</a></li>
          <li><a href="#pdf" onClick={handleScrollTo('pdf')}>Сохранение в PDF</a></li>
        </ol>

        <h5 id="add">Вставка крюка</h5>
        <img className="gifImgInModal" src={AddGif} alt="Вставка крюка" />

        <h5 id="change">Изменение крюка</h5>
        <img className="gifImgInModal" src={ChangeGif} alt="Изменение крюка" />

        <h5 id="double">Дублирование крюка</h5>
        <img className="gifImgInModal" src={DoubleGif} alt="Дублирование крюка" />

        <h5 id="text">Изменение текста</h5>
        <img className="gifImgInModal" src={TextGif} alt="Изменение текста" />

        <h5 id="rm">Удаление крюка</h5>
        <img className="gifImgInModal" src={RemoveGif} alt="Удаление крюка" />

        <h5 id="insert">Вставка крюка в середину</h5>
        <img className="gifImgInModal" src={InsertGif} alt="Вставка крюка в середину" />

        <h5 id="composition">Вставка попевки</h5>
        <img className="gifImgInModal" src={CompositionGif} alt="Вставка попевки" />

        <h5 id="elements">Вставка строк текста, буквиц и переноса</h5>
        <img className="gifImgInModal" src={ElementsGif} alt="Вставка строк текста, буквиц и переноса" />

        <h5 id="json_save">Сохранение в исходный код</h5>
        <img className="gifImgInModal" src={SaveJsonGif} alt="Сохранение в исходный код" />

        <h5 id="json_load">Загрузка из исходного кода</h5>
        <img className="gifImgInModal" src={LoadJsonGif} alt="Загрузка из исходного кода" />

        <h5 id="pdf">Сохранение в PDF</h5>
        <img className="gifImgInModal" src={PDFGif} alt="Сохранение в PDF" />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>Я понял</Button>
      </ModalFooter>
    </Modal>
  )
}

Help.propTypes = {
  showModalHelp: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default Help
