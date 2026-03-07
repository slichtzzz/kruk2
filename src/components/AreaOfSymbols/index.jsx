import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'reactstrap'
import { isNil } from 'lodash'

import {
  changePage,
  addPage,
  removeSyllableByIndex,
  changeParagraph,
} from '../../slices/paperSlice'
import { Loading, getPageNum, getPaperItem } from '../../utils'

import {
  EditText,
  RemovePageButton,
  RemoveParagraphButton,
  EditSyllable,
  RemoveParagraph,
  RemovePageModal,
} from '../'

import './style.css'

const AreaOfSymbols = () => {
  const dispatch = useDispatch()

  // 🔹 данные страницы
  const syllables = useSelector(state => state.paper.syllables)
  const currentPageNum = useSelector(state => state.paper.currentPageNum)
  const currentParagraphNum = useSelector(state => state.paper.currentParagraphNum)
  const showPagination = useSelector(state => state.paper.showPagination)

//console.log(syllables);
//console.log(currentPageNum);
//console.log(currentParagraphNum);
//console.log(showPagination);

  const paperStyle = useSelector(state => state.paperStyle)
//console.log(paperStyle);
  if (isNil(paperStyle)) {
    return <Loading />
  }

const renderOneParagraph = (paragraph, paragraphIndex, pageIndex) => {
  if (!Array.isArray(paragraph)) return null
  return paragraph.map(({ value, text, type }, index) =>
    getPaperItem(
      paperStyle,
      value,
      text,
      type,
      paragraphIndex,
      pageIndex,
      index,
      page => dispatch(changePage(page)),
      (_, sIndex) => {
        dispatch(changePage(pageIndex))
        dispatch(changeParagraph(paragraphIndex))
        dispatch(removeSyllableByIndex(sIndex))
      }
    )
  )
}

const renderOnePage = (item, pageIndex) => {
  if (!Array.isArray(item)) return null

  return item.map((paragraph, paragraphIndex) => {
    const isActiveParagraph = pageIndex === currentPageNum &&
      paragraphIndex === currentParagraphNum

    return (
      <div
        className="paragraphWrapper"
        key={`${pageIndex}-${paragraphIndex}`}
      >
        <RemoveParagraphButton
          paragraphIndex={paragraphIndex}
          pageIndex={pageIndex}
        />

        <div
          className={isActiveParagraph ? 'paragraph activeParagraph' : 'paragraph'}
          onClick={() => dispatch(changeParagraph(paragraphIndex))}
        >
          {Array.isArray(paragraph) &&
            renderOneParagraph(paragraph, paragraphIndex, pageIndex)}
        </div>
      </div>
    )
  })
}

const renderPages = () => {
  if (!Array.isArray(syllables) || syllables.length === 0) {
    return null
  }

  return syllables.map((item, pageIndex) => {
    const isActivePage = pageIndex === currentPageNum

    return (
      <div
        key={pageIndex}
        className={isActivePage ? 'a4 activePage' : 'a4'}
        onClick={() => dispatch(changePage(pageIndex))}
      >{/*Display page*/}
        <RemovePageButton pageIndex={pageIndex} />

        <div className="page">
          {Array.isArray(item) && renderOnePage(item, pageIndex)}
        </div>

        {showPagination && (
          <span
            className="pagination"
            dangerouslySetInnerHTML={{
              __html: getPageNum(pageIndex + 1),
            }}
          />
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
            {renderPages()}
            <Button
              color="primary"
              className="add-page"
              onClick={() => dispatch(addPage())}
            >
              Добавить страницу
            </Button>
          </div>
        </div>
      </div>

      <EditSyllable />
      <EditText />
      <RemoveParagraph />
      <RemovePageModal />
    </>
  )
}

export default AreaOfSymbols
