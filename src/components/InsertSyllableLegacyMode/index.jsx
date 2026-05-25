import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { map, values, isNil } from 'lodash'
import { addSyllable, changeSyllable, insertSyllable, hideModal } from '../../slices/paperSlice'
import { filterByName, filterByOptionsLegacy, filterByPitchLegacy, createOptionsList, createPitchList } from '../../slices/symbolSlice'
import { saveForm, resetForm } from '../../slices/symbolFormSlice'
import { RFReactSelect, RFReactMultiSelect, Loading, ucsToUnicode } from '../../utils'
import './style.css'

const InsertSyllableLegacyMode = () => {
  const dispatch = useDispatch()

  const paper = useSelector(state => state.paper)
  const symbols = useSelector(state => state.symbols)
  const storedForm = useSelector(state => state.syllableForm)
  const editableSyllable = useSelector(state => state.paper.editableSyllable)
  const indexToInsert = useSelector(state => state.paper.indexToInsert)
  const namesOfSymbols = useSelector(state => state.symbols.namesOfSymbols)

  const {
    control,
    watch,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: storedForm,
  })

  const watchedValues = watch()
	useEffect(() => {
		if (watchedValues) {
			dispatch(saveForm(watchedValues))
			}
		}, [watchedValues, dispatch])

const onSubmit = data => {
  if (!symbols.symbolsFilteredByPitch || symbols.symbolsFilteredByPitch.length === 0) {
    console.error('Нет выбранного символа для вставки!')
    return
  }
  const symbolTemplate = symbols.symbolsFilteredByPitch[0]
  const { _id, name, value, zf, notes } = symbolTemplate;
  const syllableForInsert = {
    _id: _id,
    name: name,
    value: value,
    zf: zf,
    notes: notes,
    text: data.syllable || '',
    type: 'KRUK',
  }

  if (!isNil(editableSyllable)) {
    dispatch(changeSyllable({
		indexOfChangingSyllable: editableSyllable,
		syllable: syllableForInsert,
		}));
  } else if (!isNil(indexToInsert)) {
    dispatch(insertSyllable({
		index: indexToInsert,
		syllable: syllableForInsert
		}));
  } else { editableSyllable
    dispatch(addSyllable(syllableForInsert))
  }

  dispatch(hideModal())
//  dispatch(resetForm())
//  reset()
}
  if (!symbols) return <Loading />

  return (
  <div className="inputForm">
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="text-left">Введите знамя</h4>

      {/* NAME */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
		<div className="field">
          <label htmlFor="symbol-name-select">Крюк</label>
          <RFReactSelect
            {...field}
            id="symbol-name-select"
            options={namesOfSymbols}
            className="input input-name"
            onChange={item => {
              field.onChange(item)
              dispatch(filterByName(item.label))
              dispatch(filterByOptionsLegacy([]))
              dispatch(createOptionsList(item.label))
              dispatch(createPitchList())
            }}
          />
         </div>
        )}
      />

      {/* OPTIONS */}
      <Controller
        name="options"
        control={control}
        render={({ field }) => (
		<div className="field">
		 <label htmlFor="symbol-options-select">Опции</label>
          <RFReactMultiSelect
            {...field}
            id="symbol-options-select"
            options={symbols.options}
            className="input input-option"
            onChange={options => {
              field.onChange(options)
              const currentOptions = values(options).map(i => i.label)
              dispatch(filterByOptionsLegacy(currentOptions))
              dispatch(createPitchList())
            }}
          />
         </div>
        )}
      />

      {/* PITCH */}
      <Controller
        name="pitch"
        control={control}
        render={({ field }) => (
		<div className="field">
		  <label htmlFor="symbol-pitch-select">Помета</label>
          <RFReactSelect
            {...field}
            id="symbol-pitch-select"
            options={symbols.pitchs}
            className="input input-pitch"
            onChange={item => {
              field.onChange(item)
              dispatch(filterByPitchLegacy(item.label))
            }}
          />
         </div>
        )}
      />

      {/* TEXT INPUT */}
      <Controller
        name="syllable"
        control={control}
        render={({ field }) => (
		<div className="field">
		<label htmlFor="symbol-text-select">Текст</label>
      <input
        {...field}
        value={field.value === '-' ? '' : field.value || ''} 
        id="symbol-text-select"
        className="inputText form-control"
        disabled={!watchedValues.name}
        placeholder="Текст"
        autoComplete="off"
        style={{ 
          fontFamily: 'Triodion Unicode',
          fontSize: '1.2rem' 
        }}
        onChange={(e) => {
          const rawVal = e.target.value;
          const converted = ucsToUnicode(rawVal);
          field.onChange(converted === '' ? '-' : converted);
        }}
      />
         </div>
        )}
      />

      <button type="submit" style={{ display: 'none' }} aria-hidden="true">Добавить</button>
    </form>
   </div>
  )
}

export default InsertSyllableLegacyMode;
