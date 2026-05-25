import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  AreaOfSymbols,
  BottomSettingsPanel,
} from '../'

import { Attention } from '../../containers/'
import { Header } from '../../utils'
import { removeLastSyllable } from '../../slices/paperSlice'
import { InsertSyllableLegacyMode } from '../'
import { CurrentSymbols } from '../'
import '../../res/bootstrap/css/bootstrap.min.css'
import './style.css'

export const Paper = () => {
  const dispatch = useDispatch()
  const isLegacyMode = useSelector(state => state.paper.isLegacyMode)  

  return (
    <>
      {!localStorage.getItem('visited') && <Attention />}
      <Header />
      <div className="Paper">
        <AreaOfSymbols />
        <div className="control">
			<BottomSettingsPanel />
			{isLegacyMode &&
				<div style={{ display: 'flex' }}>
				<div className="InputSymbol control-block">
					<InsertSyllableLegacyMode />
				</div>
				<div className="control-block control-block-last">
					<CurrentSymbols />
				</div>
				</div>
				}
         </div>
      </div>
    </>
  )
}

export default Paper
