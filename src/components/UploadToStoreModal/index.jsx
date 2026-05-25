import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Spinner } from 'reactstrap'
import { RFReactSelect, API_CHANT_DB, API_CHANT_AUTH } from '../../utils'
import { showUploadToStoreModal } from '../../slices/paperSlice'

export const UploadToStoreModal = () => {
  const dispatch = useDispatch()
  const isUploadToStoreModal = useSelector(state => state.paper.isUploadToStoreModal)
  const syllables = useSelector(state => state.paper.syllables)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [isCreating, setIsCreating] = useState(false);
  const [showChantForm, setShowChantForm] = useState(false)
  const [newBookData, setNewBookData] = useState({ name: '', code: '', description: '' })
  const [chantData, setChantData] = useState({ name: '',  code: '',description: '' })

  useEffect(() => {
    if (isUploadToStoreModal) {
      fetchBooks()
      resetForms()
    }
  }, [isUploadToStoreModal])

  const resetForms = () => {
    setShowChantForm(false)
    setSelectedBook(null)
    setNewBookData({ name: '', code: '', description: '' })
    setChantData({ name: '', code: '', description: '' })
  }

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_CHANT_DB}?action=listbooks`)
      if (response.status === 401) {
        setAuthError(true)
      } else {
        const data = await response.json()
        setBooks(data.map(b => ({ value: b.id, label: b.name, code: b.code, description: b.description })))
        setAuthError(false)
      }
    } catch (e) {
      console.error("Ошибка сети", e)
    } finally {
      setLoading(false)
    }
  }

  // Создание книги
  const handleCreateBook = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_CHANT_DB}?action=createbook`, {
        method: 'POST',
        body: JSON.stringify(newBookData)
      })
      const result = await response.json()
      if (result.success) {
        alert("Книга успешно создана!")
        setNewBookData({ name: '', code: '', description: '' })
        await fetchBooks() // Перезагрузка списка
      } else {
        alert(`Ошибка сервера: ${result.message}`);
      }
    } catch (e) {
	    alert("Произошла ошибка при отправке запроса");
	    console.error(e);
    } finally {
      setLoading(false)
    }
  }

  // Выбор книги
  const handleSelectBook = () => {
    if (selectedBook) {
      setShowChantForm(true)
    }
  }

  // Отправка песнопения
  const handleSendChant = async () => {
  const flatSyllables = syllables.flat(2);
    setLoading(true)
    try {
      const response = await fetch(`${API_CHANT_DB}?action=createchant`, {
        method: 'POST',
        body: JSON.stringify({
          book_id: selectedBook.value,
          ...chantData,
          elements: flatSyllables
        })
      })
	  const data = await response.json();
      if (data.success) {
        alert("Песнопение успешно добавлено!")
        dispatch(showUploadToStoreModal(false))
      } else {
	      alert(`Ошибка сервера: ${data.message}`);
      }
    } catch (e) {
	    alert("Произошла ошибка при отправке запроса");
	    console.error(e);
    } finally {
      setLoading(false)
    }
  }

  const handleAuthClick = () => {
    window.open(API_CHANT_AUTH, '_blank')
    dispatch(showUploadToStoreModal(false))
  }

  return (
    <Modal isOpen={isUploadToStoreModal} toggle={() => dispatch(showUploadToStoreModal(false))}>
      <ModalHeader toggle={() => dispatch(showUploadToStoreModal(false))}>
        Хранилище песнопений
      </ModalHeader>
      
      <ModalBody>
        {loading && <div className="text-center mb-3"><Spinner color="primary" size="sm" /></div>}

        {!authError ? (
          <>
            {/* СЕКЦИЯ КНИГ */}
{!showChantForm && (
  <div className="border-bottom pb-3 mb-3">
    <FormGroup>
      <Label>Выбрать существующую книгу:</Label>
      <div className="d-flex gap-2">
        <div style={{ flex: 1 }}>
          <RFReactSelect 
            options={books} 
            onChange={setSelectedBook}
            value={selectedBook}
            placeholder="Поиск..."
          />
        </div>
        <Button color="primary" onClick={handleSelectBook} disabled={!selectedBook}>
          Выбрать
        </Button>
      </div>
	  {selectedBook && selectedBook.code && (
        <div className="mt-2 p-2 bg-light border rounded small text-muted">
          <strong>Шифр:</strong> {selectedBook.code}
        </div>
      )}
      {selectedBook && selectedBook.description && (
        <div className="mt-2 p-2 bg-light border rounded small text-muted">
          <strong>Описание:</strong> {selectedBook.description}
        </div>
      )}
    </FormGroup>

    <hr />

    {!isCreating ? (
      <div className="text-center">
        <Button color="link" onClick={() => setIsCreating(true)}>
          + Создать новую книгу
        </Button>
      </div>
    ) : (
      <div className="bg-light p-3 border rounded">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Label className="mb-0"><strong>Новая книга</strong></Label>
          <Button close onClick={() => setIsCreating(false)} style={{ fontSize: '1rem' }} />
        </div>
        <FormGroup>
          <Input 
            className="mb-2"
            placeholder="Название книги"
            value={newBookData.name}
            onChange={e => setNewBookData({...newBookData, name: e.target.value})}
          />
          <Input 
            className="mb-2"
            placeholder="Шифр книги"
            value={newBookData.code}
            onChange={e => setNewBookData({...newBookData, code: e.target.value})}
          />
          <Input 
            type="textarea"
            placeholder="Описание книги"
            value={newBookData.description}
            onChange={e => setNewBookData({...newBookData, description: e.target.value})}
          />
        </FormGroup>
        <Button color="success" block onClick={handleCreateBook} disabled={!newBookData.name || loading}>
          {loading ? <Spinner size="sm" /> : 'Создать книгу'}
        </Button>
        <Button color="link" block size="sm" className="text-muted mt-1" onClick={() => setIsCreating(false)}>
          Отмена
        </Button>
      </div>
    )}
  </div>
)}


            {/* СЕКЦИЯ ПЕСНОПЕНИЯ */}
            {showChantForm && (
              <Form>
                <p className="text-muted small">Книга: <strong>{selectedBook?.label}</strong></p>
                <FormGroup>
                  <Label>Название песнопения</Label>
                  <Input 
                    value={chantData.name} 
                    onChange={e => setChantData({...chantData, name: e.target.value})} 
                    placeholder="Введите название..."
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Описание</Label>
                  <Input 
                    type="textarea" 
                    value={chantData.description} 
                    onChange={e => setChantData({...chantData, description: e.target.value})} 
                    placeholder="Описание песнопения..."
                  />
                </FormGroup>
                <Button color="link" className="p-0" onClick={() => setShowChantForm(false)}>
                  ← Вернуться к выбору книги
                </Button>
              </Form>
            )}
          </>
        ) : (
          <div className="text-center">
            <p>Необходима авторизация</p>
            <Button color="primary" onClick={handleAuthClick}>Авторизоваться</Button>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        {showChantForm && (
          <Button color="success" onClick={handleSendChant} disabled={!chantData.name || loading}>
            Отправить
          </Button>
        )}
        <Button color="secondary" onClick={() => dispatch(showUploadToStoreModal(false))}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UploadToStoreModal
