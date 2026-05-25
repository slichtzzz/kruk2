import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EditButtons from '../../components/EditButtons'
import { changePage, showModalEditText } from '../../slices/paperSlice'
import { SMUFL } from '../../utils/musicMap'
import './style.css'

const Syllable = ({ value, notesData, text, index, pageIndex, paragraphIndex }) => {
  const dispatch = useDispatch()
  const paperStyle = useSelector(state => state.paperStyle)
  const showNotes = useSelector(state => state.paper.showNoteString)
  const playStopIndex = useSelector(state => state.paper.playStopIndex)
  const playStopParagraphIndex = useSelector(state => state.paper.playStopParagraphIndex)
  const playStopPageIndex = useSelector(state => state.paper.playStopPageIndex)
  const playToPageIndex = useSelector(state => state.paper.playToPageIndex);
  const playToParagraphIndex = useSelector(state => state.paper.playToParagraphIndex);
  const playToIndex = useSelector(state => state.paper.playToIndex);

  const STEP_HEIGHT = 5; 

  if (!notesData) return null;
  const isPlaying = playToPageIndex === pageIndex && playToParagraphIndex === paragraphIndex && playToIndex === index;
  const isStop = playStopPageIndex === pageIndex && playStopParagraphIndex === paragraphIndex && playStopIndex === index;

  const handleEditText = () => {
    dispatch(changePage(pageIndex))
    dispatch(showModalEditText(index))
  }

  const noteAreaStyle = {
    fontSize: `${paperStyle.noteFontSize || 24}pt`,
    height: '85px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative'
  }

  const textStyle = { 
    fontSize: `${paperStyle.textFontSize}pt`, 
    marginTop: `${paperStyle.marginTop}pt`,
    fontFamily: paperStyle.fontOfTextInSyllables,
    lineHeight: '1'
  }

  return (
    <div className="syllable">
    {showNotes && (
      <div className="note-area-bravura" style={noteAreaStyle}>
        {notesData.map((note, nIdx) => {
          const verticalPos = `${note.offset * STEP_HEIGHT}px`;
          return (
            <div key={nIdx} className="bravura-note-item">
              {note.ledgers && note.ledgers.map((lPos, lIdx) => (
                <span key={lIdx} className="b-ledger" style={{ bottom: `${lPos * STEP_HEIGHT}px` }}>
                  {SMUFL.ledger}
                </span>
              ))}
              {note.accidental && (
                <span className="b-acc" style={{ bottom: verticalPos }}>
                  {note.accidental}
                </span>
              )}
			  <span className={`b-head ${note.isDown ? 'is-down' : ''}`} style={{ bottom: verticalPos }}>
                {note.char}
              </span>
			  {note.dot && (
			    <span className="b-dot" style={{ bottom: verticalPos }}>
			      {note.dot}
			    </span>
			  )}
            </div>
          );
        })}
      </div>
	)}
      <div 
        className={`symbol ${isPlaying ? 'symbol-playing' : ''} ${isStop ? 'symbol-stop' : ''}`}
        style={{ fontSize: `${paperStyle.symbolFontSize}pt` }} 
        dangerouslySetInnerHTML={{ __html: value }} 
      />
      
      {/* ТЕКСТОВЫЙ БЛОК */}
      <div 
        className="text" 
        style={textStyle} 
        onClick={handleEditText} 
        dangerouslySetInnerHTML={{ __html: text }} 
      />
      
      <EditButtons index={index} pageIndex={pageIndex} paragraphIndex={paragraphIndex} />
    </div>
  )
}

export default Syllable
