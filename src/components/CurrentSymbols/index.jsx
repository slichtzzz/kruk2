import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addSyllable } from '../../slices/paperSlice'
import { Symbol } from '../../containers'
import './style.css'

const CurrentSymbols = () => {
  const dispatch = useDispatch()
  const currentSymbols = useSelector(state => state.symbols.currentSymbols)
  const handleAddSyllable = syllable => {
    dispatch(addSyllable(syllable))
  }

  return (
    <div className="currentSymbols text-left">
      <h4>Подходящие знамена</h4>
      {currentSymbols.length === 0 ? (
        <p>Подходящих знамен нет</p>
      ) : (
        <div className="currentSymbolsArea">
          {currentSymbols.map(({ _id, value, name, pitch, zf, notes }, index) => (
            <Symbol
              key={index}
              _id={_id}
              value={value}
              name={name}
              pitch={pitch}
              zf={zf}
              notes={notes}
              addSyllable={handleAddSyllable}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CurrentSymbols
