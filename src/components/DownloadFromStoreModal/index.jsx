import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Spinner } from 'reactstrap'
import { RFReactSelect, API_CHANT_DB_READ, API_CHANT_AUTH } from '../../utils'
import { showDownloadFromStoreModal, addSyllable, changeParagraph } from '../../slices/paperSlice'

export const DownloadFromStoreModal = () => {
  const dispatch = useDispatch()
  const isDownloadFromStoreModal = useSelector(state => state.paper.isDownloadFromStoreModal)
  const isCanvas = useSelector(state => state.paper.isCanvasMode);
  const currentSyllables = useSelector(state => state.paper.syllables);
  const syllables = useSelector((state) => state.paper.syllables)
  const currentPageNum = useSelector((state) => state.paper.currentPageNum)
  const currentParagraphNum = useSelector((state) => state.paper.currentParagraphNum)
  
  // Проверка авторизации
  const [isAuth, setIsAuth] = useState(false)

  const [loading, setLoading] = useState(false)
  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [onlyMyBooks, setOnlyMyBooks] = useState(false)

  const [step, setStep] = useState('books')
  const [chants, setChants] = useState([])
  const [selectedChants, setSelectedChants] = useState([])

  useEffect(() => {
    const initModal = async () => {
      if (isDownloadFromStoreModal) {
        await checkSession() 
        fetchBooks()
        setStep('books')
        setSelectedChants([])
      }
    }
    initModal()
  }, [isDownloadFromStoreModal, onlyMyBooks])

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_CHANT_DB_READ}?action=checkauth`)
      const data = await response.json()
      setIsAuth(!!data.isAuth)
      // При отсутствии авторизации принудительно выключается фильтр «мои книги»
      if (!data.isAuth) setOnlyMyBooks(false)
    } catch (e) {
      setIsAuth(false)
      setOnlyMyBooks(false)
    }
  }

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const url = `${API_CHANT_DB_READ}?action=listbooks${onlyMyBooks ? '&mine=1' : ''}`
      const response = await fetch(url)
      const data = await response.json()
      if (Array.isArray(data)) {
        setBooks(data.map(b => ({ value: b.id, label: b.name, code: b.code, description: b.description })))
      }
    } catch (e) {
      console.error("Ошибка загрузки книг:", e)
    } finally {
      setLoading(false)
    }
  }


  const fetchChants = async (bookId) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_CHANT_DB_READ}?action=listchants&book_id=${bookId}`)
      const data = await response.json()
      setChants(data)
      setStep('chants')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

const handleDownload = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_CHANT_DB_READ}?action=getfullchants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chant_ids: selectedChants })
    });

    const data = await response.json();

    if (data.success && Array.isArray(data.chants)) {
      
      if (isCanvas) {
        const allElements = data.chants.flatMap(chant => chant.elements || []);
        
        allElements.forEach(element => {
          dispatch(addSyllable({
            _id: element._id,
            name: element.name,
            value: element.value,
            zf: element.zf,
            notes: element.notes,
            text: element.text,
            type: element.type
          }));
        });
      } else {
        data.chants.forEach(chant => {
          if (Array.isArray(chant.elements) && chant.elements.length > 0) {
            const numOfLastParagraphOnPage = syllables[currentPageNum].length - 1;
            const newParagraphNum = numOfLastParagraphOnPage + 1;
            dispatch(changeParagraph(newParagraphNum));
            chant.elements.forEach(element => {
              dispatch(addSyllable({
                _id: element._id,
                name: element.name,
                value: element.value,
                zf: element.zf,
                notes: element.notes,
                text: element.text,
                type: element.type
              }));
            });
          }
        });
      }

      dispatch(showDownloadFromStoreModal(false));
      setTimeout(() => alert(`Загружено песнопений: ${data.chants.length}`), 100);
      
    } else {
      alert(`Ошибка: ${data.message || 'Данные не получены'}`);
    }
  } catch (e) {
    console.error("Ошибка загрузки:", e);
    alert("Произошла ошибка при обработке данных");
  } finally {
    setLoading(false);
  }
};



  const handleAuthClick = () => {
    window.open(API_CHANT_AUTH, '_blank')
  }

  return (
    <Modal isOpen={isDownloadFromStoreModal} toggle={() => dispatch(showDownloadFromStoreModal(false))}>
      <ModalHeader toggle={() => dispatch(showDownloadFromStoreModal(false))}>
        Библиотека песнопений
      </ModalHeader>
      
      <ModalBody>
        {loading && <div className="text-center mb-3"><Spinner color="primary" size="sm" /></div>}

        {/* ШАГ 1: ВЫБОР КНИГИ */}
        {step === 'books' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded border">
              <span className="small text-muted font-weight-bold">Доступ:</span>
              {isAuth ? (
                <FormGroup check className="p-0 m-0 d-flex align-items-center">
                  <Input 
                    type="switch" 
                    id="myBooksSwitch" 
                    checked={onlyMyBooks}
                    onChange={() => setOnlyMyBooks(!onlyMyBooks)}
                    className="m-0 cursor-pointer me-2"
                  />
                  <Label for="myBooksSwitch" className="ml-2 mb-0 small cursor-pointer">
                    Только мои книги
                  </Label>
                </FormGroup>
              ) : (
                <Button color="link" size="sm" className="p-0 text-primary underline" onClick={handleAuthClick}>
                  Войти для доступа к своим книгам
                </Button>
              )}
            </div>
            
            <FormGroup>
              <Label className="small">Выберите книгу:</Label>
              <div className="d-flex gap-2">
                <div style={{ flex: 1 }}>
                  <RFReactSelect 
                    options={books} 
                    onChange={setSelectedBook}
                    value={selectedBook}
                    placeholder="Поиск..."
                  />
                </div>
                <Button color="primary" onClick={() => fetchChants(selectedBook?.value)} disabled={!selectedBook || loading}>
                  Открыть
                </Button>
              </div>
            </FormGroup>
          </div>
        )}

        {/* ШАГ 2: ВЫБОР ПЕСНОПЕНИЙ */}
        {step === 'chants' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="mb-0 text-truncate">Книга: <strong>{selectedBook?.label}</strong></h6>
              <Button color="link" size="sm" onClick={() => setStep('books')}>Назад</Button>
            </div>
            
            <div className="border rounded" style={{ maxHeight: '300px', overflowY: 'auto', background: '#fff' }}>
              {chants.length > 0 ? (
                chants.map(chant => (
                  <div key={chant.id} className="p-2 border-bottom hover-light d-flex align-items-center">
                    <Input 
                      type="checkbox" 
                      id={`chant-${chant.id}`}
                      className="me-3 cursor-pointer"
                      style={{ martinTop: 0 }}
                      checked={selectedChants.includes(chant.id)}
                      onChange={() => {
                        const id = chant.id
                        setSelectedChants(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
                      }}
                    />
                    <Label for={`chant-${chant.id}`} className="ml-3 mb-0 w-100 cursor-pointer">
                      {chant.name}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted">Пусто</div>
              )}
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        {step === 'chants' && (
          <Button 
            color="success" 
            onClick={() => handleDownload()} 
            disabled={selectedChants.length === 0 || loading}
          >
            {loading ? <Spinner size="sm" /> : `Загрузить (${selectedChants.length})`}
          </Button>
        )}
        <Button color="secondary" outline onClick={() => dispatch(showDownloadFromStoreModal(false))}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DownloadFromStoreModal;

