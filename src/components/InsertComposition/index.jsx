import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { find, get } from 'lodash'
import './style.css'

import { RFReactSelect } from '../../utils'
import { addSyllable } from '../../slices/paperSlice'
import { createNamesList, fetchCompositions } from '../../slices/symbolSlice'

const InsertComposition = () => {
  const dispatch = useDispatch()
  useEffect(() => {
	  dispatch(fetchCompositions())
	  },[])
  const [insertRazvod, setInsertRazvod] = useState(false)

//Create separate array to mitigate errors with the Select filed
  const toneArray = [
		{ value: 1, label: '1' },
		{ value: 2, label: '2' },
		{ value: 3, label: '3' },
		{ value: 4, label: '4' },
		{ value: 5, label: '5' },
		{ value: 6, label: '6' },
		{ value: 7, label: '7' },
		{ value: 8, label: '8' },
		];

  const changeTone = e => {
    dispatch(fetchCompositions())
    dispatch(createNamesList(e.value))
  }

  const compositionsLables = useSelector(state =>
    state.symbols.compositions.map(item => ({
      id: item.value,
      label: item.value,
    }))
  )

  const currentCompositions = useSelector(
    state => state.symbols.currentCompositions
  )

  const compositionsNames = useSelector(state =>
    state.symbols.compositionsNames.map(item => ({
      value: item.id,
      label: item.name,
    }))
  )

  const { control } = useForm()

  const changeCheckbox = () => {
    setInsertRazvod(prev => !prev)
  }

  const changeName = e => {
    const syllablesForInsert = get(
      find(currentCompositions, { _id: e.value }),
      insertRazvod ? 'value' : 'view'
    )

    if (!syllablesForInsert) return

    syllablesForInsert.forEach(item =>
      dispatch(addSyllable({ value: item, text: '-', type: 'KRUK' }))
    )
  }

  return (
    <div className="insertComposition text-left">
      <h4 className="text-left">Вставить попевку</h4>

      {/* Checkbox */}
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id="insetRazvodOfComposition"
          onChange={changeCheckbox}
          checked={insertRazvod}
        />
        <label
          className="custom-control-label"
          htmlFor="insetRazvodOfComposition"
        >
          Вставить "в разводе"
        </label>
      </div>

      {/* Tone */}
      <div className="field">
        <label>Глас</label>
        <Controller
          name="tone"
          control={control}
          render={({ field }) => (
            <RFReactSelect
              {...field}
              options={toneArray}
              className="input"
              onChange={item => {
                field.onChange(item)
                changeTone(item)
              }}
            />
          )}
        />
      </div>

      {/* Name */}
      <div className="field">
        <label>Название</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <RFReactSelect
              {...field}
              options={compositionsNames}
              className="input"
              onChange={item => {
                field.onChange(item)
                changeName(item)
              }}
            />
          )}
        />
      </div>
    </div>
  )
}

export default InsertComposition
