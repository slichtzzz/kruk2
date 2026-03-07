import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert } from 'reactstrap'
import { isNil } from 'lodash'

import {
  InsertSyllable,
  AreaOfSymbols,
  PaperStyle,
  InsertComposition,
  CurrentSymbols,
  InsertText,
} from '../'

import { Attention } from '../../containers/'

import { Header } from '../../utils'
import { removeLastSyllable } from '../../slices/paperSlice'
import '../../res/bootstrap/css/bootstrap.min.css'
import './style.css'

export const Paper = () => {
  const dispatch = useDispatch()
  const paper = useSelector((state) => state.paper)

  const handleremoveLastSyllable = () => {
    dispatch(removeLastSyllable())
  }

  const showError = isNil(paper.syllables[paper.currentPageNum])

  return (
    <>
      {!localStorage.getItem('visited') && <Attention />}
      <Header />
      <div className="Paper">
        <AreaOfSymbols />
        <div className="control">
          <div className="InputSymbol control-block">
            <InsertSyllable />
            <div>
              <Alert
                style={{ display: showError ? 'block' : 'none' }}
                className="errorNoParagraph"
                color="danger"
              >
                Не выбрана страница и абзац для ввода. Кликните по странице
                или абзацу, в который вы хотите ввести крюк.
              </Alert>
            </div>
          </div>

          <div className="control-block">
            <CurrentSymbols />
          </div>

          <div className="control-block">
            <PaperStyle />
          </div>

          <div className="control-block control-block-last">
            <InsertComposition />
            <InsertText />
          </div>
        </div>
      </div>
    </>
  )
}

export default Paper
