import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as Tone from 'tone';
import { playMelodyGlobal } from '../../utils/engine.js'
import { DURATION_MAP, PITCH_MAP } from '../../utils'
import {
  removeSyllableByIndex,
  repeatSyllableByIndex,
  showModalEdit,
  showModalInsert,
  changePage,
  changeParagraph,
  checkParagraphIsEmpty,
  moveSyllableToPrevPage,
  setPlayStop,
  setPlayingNow,
  clearPlaybackStyles, 
  setIsSequencePlaying,
} from '../../slices/paperSlice'

const EditButtons = ({ index, pageIndex, paragraphIndex }) => {
  const dispatch = useDispatch()
  const syllables = useSelector(state => state.paper.syllables)
  const isPlayNotes = useSelector(state => state.paper.isPlayNotes)
  const isSequencePlaying = useSelector(state => state.paper.isSequencePlaying)
  const playStopIndex = useSelector(state => state.paper.playStopIndex)
  const playStopParagraphIndex = useSelector(state => state.paper.playStopParagraphIndex)
  const playStopPageIndex = useSelector(state => state.paper.playStopPageIndex)
  const stopRef = useRef(isSequencePlaying);

  useEffect(() => {
    stopRef.current = isSequencePlaying;
  }, [isSequencePlaying]);

  const isFirstSymbolOnPage = pageIndex > 0 && paragraphIndex === 0 && index === 0

  // Функция для остановки
  const forceStop = () => {
    stopRef.current = false;
    dispatch(setIsSequencePlaying(false));
    dispatch(clearPlaybackStyles());
  };

  const handleRemove = () => {
    dispatch(changePage(pageIndex));
    dispatch(changeParagraph(paragraphIndex));
    dispatch(removeSyllableByIndex(index));
    dispatch(checkParagraphIsEmpty());
  }

  const handleRepeat = () => {
    dispatch(changePage(pageIndex));
    dispatch(changeParagraph(paragraphIndex));
    dispatch(repeatSyllableByIndex(index));
  }

  const handleEdit = () => {
    dispatch(changePage(pageIndex));
    dispatch(showModalEdit(index));
  }

  const handleInsert = () => {
    dispatch(changePage(pageIndex));
    dispatch(showModalInsert(index));
  }

  const getSyllableDuration = (notesString) => {
    if (!notesString) return 1;
    const chars = notesString.split('');
    return chars.reduce((total, char) => {
      if (DURATION_MAP[char] !== undefined) return total + DURATION_MAP[char];
      return total;
    }, 0) || 1;
  };

  const handlePlay = async () => {
    await Tone.start();
    if (!isPlayNotes) {
      const item = syllables[pageIndex][paragraphIndex][index];
      playMelodyGlobal(item.notes, PITCH_MAP, DURATION_MAP);
      return;
    }

    // Режим последовательного проигрывания
    stopRef.current = true;
    dispatch(setIsSequencePlaying(true));

    const playNext = async (p, para, s) => {
      if (!stopRef.current) return;

      const page = syllables[p];
      if (!page) { forceStop(); return; }

      const paragraph = page[para];
      if (!paragraph) return playNext(p + 1, 0, 0);

      const currentItem = paragraph[s];
      if (!currentItem) return playNext(p, para + 1, 0);
      if (p === playStopPageIndex && para === playStopParagraphIndex && s === playStopIndex) {
        dispatch(setPlayingNow({ pIdx: p, paraIdx: para, sIdx: s }));
        await playMelodyGlobal(currentItem.notes, PITCH_MAP, DURATION_MAP);
        forceStop();
        return;
      }

      dispatch(setPlayingNow({ pIdx: p, paraIdx: para, sIdx: s }));
      await playMelodyGlobal(currentItem.notes, PITCH_MAP, DURATION_MAP);
      const durationUnits = getSyllableDuration(currentItem.notes);
      await new Promise(resolve => setTimeout(resolve, durationUnits * 500));
      playNext(p, para, s + 1);
    };

    playNext(pageIndex, paragraphIndex, index);
  };

  const handlePlayTo = () => {
	if(isPlayNotes) {
	    dispatch(setPlayStop({
	      pageIndex: pageIndex,
	      paragraphIndex: paragraphIndex,
	      syllableIndex: index
	    }))
	   } else {
		   alert('Эта кнопка отмечает конец воспроизведения отрывка. Работает только при включении параметра «Проигрывать абзац»');
	   }
  }

  return (
    <div className="edit-buttons">
      <button onClick={handleRemove} className="syllable-button remove" title="Удалить">
        <i className="icon-bin" />
      </button>
      <button onClick={handleRepeat} className="syllable-button repeat" title="Повторить">
        <i className="icon-copy" />
      </button>
      <button onClick={handleInsert} className="syllable-button insert" title="Вставить">
        <i className="icon-plus" />
      </button>
      <button onClick={handleEdit} className="syllable-button edit" title="Редактировать">
        <i className="icon-pen" />
      </button>
      <button onClick={handlePlay} className="syllable-button play" title="Играть отсюда">
        <span style={{fontSize: '12px', lineHeight: 1, marginLeft: '2px'}}>▶</span>
      </button>
      
      <button onClick={handlePlayTo} className="syllable-button playto" title="Играть до этого момента">
        <span style={{fontSize: '12px', lineHeight: 1}}>▼</span>
      </button>
    </div>
  )
}

export default EditButtons;
