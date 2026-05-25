import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { isMobile, isClosestValue, osName } from 'react-device-detect';
import { isNil } from 'lodash'

import {
  addSyllable,
  changePage,
  addPage,
  removeSyllableByIndex,
  changeParagraph,
  showModalInsert,
  setShowNotes,
  toggleCanvasMode,
  setAllPages,
  stopAll,
  moveSyllableToPrevPage,
  moveSyllableToNextPage
} from '../../slices/paperSlice'
import { Loading, getPageNum, getPaperItem } from '../../utils'
import { SMUFL } from '../../utils/musicMap'

import {
  EditText,
  RemovePageButton,
  RemoveParagraphButton,
  EditSyllable,
  RemoveParagraph,
  RemovePageModal,
  UploadToStoreModal,
  DownloadFromStoreModal
} from '../'

import './style.css'

const AreaOfSymbols = () => {
  const dispatch = useDispatch()
  const syllables = useSelector(state => state.paper.syllables)
  const currentPageNum = useSelector(state => state.paper.currentPageNum)
  const currentParagraphNum = useSelector(state => state.paper.currentParagraphNum)
  const showPagination = useSelector(state => state.paper.showPagination)
  const showNotes = useSelector(state => state.paper.showNoteString)
  const isCanvasMode = useSelector(state => state.paper.isCanvasMode)
  const paper = useSelector(state => state.paper)
  const paperStyle = useSelector(state => state.paperStyle)
  const isSequencePlaying = useSelector(state => state.paper.isSequencePlaying);  
  const isBreakingRef = useRef(false);
  const safeHeight = 1050
  const handleStop = () => {
	dispatch(stopAll());
	};
  // --- Управление двоезнаменником ---
  const canEnableDoubleNotation = () => {
    const isFirstPage = currentPageNum === 0
    if (syllables.length > 1) return true;
    const firstPage = syllables[0] || []
    const onlyOneParagraph = firstPage.length === 1
    const paragraphEl = document.querySelector(
      '.areaOfSymbols .paragraphWrapper .paragraph'
    )
    const paragraphFits = paragraphEl
      ? paragraphEl.scrollHeight <= safeHeight
      : true
    return isFirstPage && onlyOneParagraph && paragraphFits
  }

	const handleMoveUp = (pageIndex) => {
	  if (pageIndex > 0) {
	    dispatch(moveSyllableToPrevPage({ 
	      pageIndex: pageIndex, 
	    }));
	  }
	};

	const addLineBreak = () => {
	  dispatch(addSyllable({
	    value: '',
	    text: '',
	    type: 'BREAK' 
	  }));
	};

	const handleMoveDown = (pageIndex) => {
	  if (pageIndex < syllables.length - 1) {
	    dispatch(moveSyllableToNextPage({ pageIndex }));
	  }
	};

  useEffect(() => {
    if (!isCanvasMode && showNotes) {
      const timer = setTimeout(() => {
        if (!canEnableDoubleNotation() && syllables.length === 1) {
          dispatch(setShowNotes(false))
          alert(
            "В постраничном режиме двоезнаменник можно включить при заполнении не более страницы в единственном абзаце. Переключитесь на режим единого холста."
          )
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [syllables, currentPageNum, showNotes, isCanvasMode, dispatch])

  useEffect(() => {
    if (isCanvasMode) return;
    const checkOverflow = () => {
      const pages = document.querySelectorAll('.a4');
      pages.forEach(pageEl => {
        const pageContent = pageEl.querySelector('.page');
        if (pageContent && pageContent.scrollHeight > safeHeight) {
          pageEl.classList.add('page-overflow');
        } else {
          pageEl.classList.remove('page-overflow');
        }
      });
    };
    const timer = setTimeout(checkOverflow, 500);
    return () => clearTimeout(timer);
  }, [syllables, showNotes, isCanvasMode]);

  // Авторазбивка
  useEffect(() => {
    if (isCanvasMode) {
      isBreakingRef.current = false;
      return;
    }

    if (isBreakingRef.current) return;

    const performPagination = () => {
      const allParagraphsData = syllables.flat(1);
      const paragraphElements = document.querySelectorAll('.paragraphWrapper');
      
      if (paragraphElements.length === 0) return;

      let newPagesStructure = [];
      let currentPage = [];
      let currentHeight = 0;
      const precisionLimit = safeHeight * 0.94; // Точность
      let queue = allParagraphsData.map((data, i) => ({
        data,
        height: paragraphElements[i].offsetHeight
      }));

      while (queue.length > 0) {
        const item = queue.shift();
        if (currentHeight + item.height <= precisionLimit) {
          currentPage.push(item.data);
          currentHeight += item.height;
        } 
        else if (currentPage.length > 0) {
          newPagesStructure.push(currentPage);
          currentPage = [];
          currentHeight = 0;
          queue.unshift(item);
        } 

        else {
          const ratio = precisionLimit / item.height;
          const splitPoint = Math.floor(item.data.length * ratio);
          
          const head = item.data.slice(0, splitPoint);
          const tail = item.data.slice(splitPoint);

          newPagesStructure.push([head]);
          queue.unshift({
            data: tail,
            height: item.height * (1 - ratio)
          });
          
          currentPage = [];
          currentHeight = 0;
        }
      }

      if (currentPage.length > 0) newPagesStructure.push(currentPage);
      const structureChanged = JSON.stringify(newPagesStructure) !== JSON.stringify(syllables);
      if (structureChanged) {
        if (syllables.length === 1 && newPagesStructure.length > 1) {
          if (window.confirm(`Контент распределен на ${newPagesStructure.length} стр. Продолжить?`)) {
            isBreakingRef.current = true;
            dispatch(setAllPages(newPagesStructure));
          } else {
            dispatch(toggleCanvasMode());
          }
        } else {
          isBreakingRef.current = true;
          dispatch(setAllPages(newPagesStructure));
        }
      }
    };

    const timer = setTimeout(performPagination, 800);
    return () => clearTimeout(timer);
  }, [isCanvasMode, showNotes, syllables, dispatch]);

useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      addLineBreak();
    } 
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [dispatch, syllables]);

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (((osName === 'Linux' || osName === 'Windows') && event.code === 'Insert') || (osName === 'Mac OS' && event.code === 'Equal')) {
        event.preventDefault();
        const showError = isNil(paper.syllables[paper.currentPageNum])
        dispatch(changePage(currentPageNum));
        if(!showError) dispatch(showModalInsert());
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [dispatch, currentPageNum, paper]);

  if (isNil(paperStyle)) return <Loading />

const renderOneParagraph = (paragraph, paragraphIndex, pageIndex) => {
  if (!Array.isArray(paragraph)) return null;

  const segments = [];
  let currentMusicGroup = [];
  let globalIndex = 0;

  paragraph.forEach((item) => {
    if (item.type === 'TEXT' || item.type === 'BREAK') {

      if (currentMusicGroup.length > 0) {
        segments.push({ type: 'MUSIC', items: [...currentMusicGroup], startIndex: globalIndex - currentMusicGroup.length });
        currentMusicGroup = [];
      }
      segments.push({ type: 'TEXT', item: item, index: globalIndex });
    } else {
      currentMusicGroup.push(item);
    }
    globalIndex++;
  });

  if (currentMusicGroup.length > 0) {
    segments.push({ type: 'MUSIC', items: currentMusicGroup, startIndex: globalIndex - currentMusicGroup.length });
  }

  const renderItem = (item, idx) => getPaperItem(
    paperStyle, item.value, item.notes, item.text, item.type,
    paragraphIndex, pageIndex, idx,
    page => dispatch(changePage(page)),
    () => {
      dispatch(changePage(pageIndex));
      dispatch(changeParagraph(paragraphIndex));
      dispatch(removeSyllableByIndex(idx));
    }
  );

  return (
    <div className="paragraph-container">
      {segments.map((seg, sIdx) => {
        if (seg.type === 'TEXT') {
          return (
            <div key={`text-${sIdx}`} className="text-row-block">
              {renderItem(seg.item, seg.index)}
            </div>
          );
        }

        if (seg.type === 'BREAK') {
          return (
            <div key={`break-${sIdx}`} className="break-row-block">
              {renderItem(seg.item, seg.index)}
            </div>
          );
        }

        return (
          <div key={`music-${sIdx}`} className={`music-row-block ${!showNotes ? 'no-music' : ''}`}>
            {seg.items.map((mItem, mIdx) => renderItem(mItem, seg.startIndex + mIdx))}
          </div>
        );
      })}
    </div>
  );
};



  const renderOnePage = (item, pageIndex) => {
    if (!Array.isArray(item)) return null
    return item.map((paragraph, paragraphIndex) => {
      const isActiveParagraph = pageIndex === currentPageNum && paragraphIndex === currentParagraphNum
      return (
        <div className="paragraphWrapper" key={`${pageIndex}-${paragraphIndex}`}>
          <RemoveParagraphButton paragraphIndex={paragraphIndex} pageIndex={pageIndex} />
          <div
            className={`paragraph ${isActiveParagraph ? 'activeParagraph' : ''} ${!showNotes ? 'no-music' : ''}`}
            onClick={() => dispatch(changeParagraph(paragraphIndex))}
          >
            {renderOneParagraph(paragraph, paragraphIndex, pageIndex)}
          </div>
        </div>
      )
    })
  }

  const renderCanvas = () => {
    const allParagraphs = syllables.flat(1); 
    return (
      <div className="a4 canvas-mode">
        <div className="page">
          {allParagraphs.map((paragraph, pIdx) => (
            <div className="paragraphWrapper" key={pIdx}>
              <div className={`paragraph ${!showNotes ? 'no-music' : ''}`}>
                {renderOneParagraph(paragraph, pIdx, 0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderPages = () => {
    if (!Array.isArray(syllables) || syllables.length === 0) return null
    return syllables.map((item, pageIndex) => {
      const isActivePage = pageIndex === currentPageNum
      return (
        <div key={pageIndex} className={`a4 ${isActivePage ? 'activePage' : ''}`} onClick={() => dispatch(changePage(pageIndex))}>
          {pageIndex > 0 && (
            <Button
			  color="info"
              className="syllable-moveup-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleMoveUp(pageIndex);
              }}
            >
              ▲
            </Button>
          )}
          <RemovePageButton pageIndex={pageIndex} />
            <div className="page">
              {renderOnePage(item, pageIndex)}
          </div>
          {showPagination && <span className="pagination" dangerouslySetInnerHTML={{ __html: getPageNum(pageIndex + 1) }} />}
          {pageIndex < syllables.length - 1 && (
            <Button
              color="info"
              className="syllable-movedown-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleMoveDown(pageIndex);
              }}
            >
              ▼
            </Button>
          )}
        </div>
      )
    })
  }

  return (
    <>
      <div className="paperArea">
        <div className="areaOfSymbols mx-auto">
          <div className="paperMargin">
            <div>
		    {isSequencePlaying ? ( <div className="global-stop-container">
    <div className="pulse-dot"></div>
    <span className="stop-text">Воспроизведение…</span>
    <button onClick={handleStop} className="syllable-button-stop-action">
      <i className="icon-stop" />
    </button>
  </div>
		    ) : null }
           {isCanvasMode ? renderCanvas() : renderPages()}
            {!isCanvasMode && (
              <Button color="primary" className="add-page" onClick={() => dispatch(addPage())}>
                Добавить страницу
              </Button>
            )}
          </div>
          </div>
        </div>
      </div>
      <EditSyllable />
      <EditText />
      <RemoveParagraph />
      <RemovePageModal />
      <DownloadFromStoreModal />
      <UploadToStoreModal />
    </>
  )
}

export default AreaOfSymbols
