import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { find, get, isNil } from 'lodash'
import './style.css'
import SelectSourcesContainer from '../SelectSourcesContainer'
import { RFReactSelect, mezenets, unicodeSlavonic } from '../../utils'
import { addSyllable } from '../../slices/paperSlice'
import { createNamesList, fetchCompositions, setType } from '../../slices/symbolSlice'

const InsertComposition = () => {
  const dispatch = useDispatch()
  const API_COMPOSITIONS = 'https://oko.jesser.ru/kruk/compositions.php'

  const currentType = useSelector(state => state.symbols.currentType)
  const selectedSourceId = useSelector(state => state.symbols.currentSource)
  const currentCompositions = useSelector(state => state.symbols.currentCompositions)
  const compositionsNames = useSelector(state => state.symbols.compositionsNames)

  const [insertRazvod, setInsertRazvod] = useState(false)

  const typeArray = [
    { value: 1, label: 'Попевки' },
    { value: 2, label: 'Лица' },
    { value: 3, label: 'Фиты' },
  ]

  const toneArray = [
    { value: 1, label: '1' }, { value: 2, label: '2' },
    { value: 3, label: '3' }, { value: 4, label: '4' },
    { value: 5, label: '5' }, { value: 6, label: '6' },
    { value: 7, label: '7' }, { value: 8, label: '8' },
  ]

  const { control, setValue } = useForm({
    defaultValues: {
      type: typeArray[0],
      tone: null,
      name: null
    }
  })

  const watchedTone = useWatch({ control, name: 'tone' })

  useEffect(() => {
    if (currentType && selectedSourceId) {
      const url = `${API_COMPOSITIONS}?type=${currentType.value}&source=${selectedSourceId}`
      dispatch(fetchCompositions(url))
      setValue('tone', null)
      setValue('name', null)
      dispatch(createNamesList(null)) 
    }
  }, [currentType, selectedSourceId, dispatch, setValue])

  const changeCheckbox = () => {
    setInsertRazvod(prev => !prev)
  }

  const changeType = (item) => {
    dispatch(setType(item))
  }

  const changeTone = (item) => {
    if (item) {
      dispatch(createNamesList(item.value))
    } else {
      dispatch(createNamesList(null))
    }
    setValue('name', null)
  }

  const changeName = (item) => {
    if (!item) return
    const found = find(currentCompositions, { _id: item.value })
    const valueNotes = get(found, 'valueNotes', [])

    let syllablesForInsert = []
    
    if (insertRazvod) {
      syllablesForInsert = get(found, 'value', [])
    } else {
      const rawView = get(found, 'view', [])
      const dollarIndex = rawView.indexOf('$');
      syllablesForInsert = dollarIndex !== -1 ? rawView.slice(0, dollarIndex) : rawView;
    }

    if (!syllablesForInsert || syllablesForInsert.length === 0) return

    syllablesForInsert.forEach((val, index) => {
      if (val === '$') return

      const convertedValue = mezenets(val);
      const currentNote = (insertRazvod && Array.isArray(valueNotes) && valueNotes[index]) 
        ? String(valueNotes[index]) 
        : '';
      dispatch(addSyllable({
		_id: item.value,
		name: item.label,
        value: convertedValue, 
        zf: val,
        notes: currentNote,
        text: '-', 
        type: 'KRUK'
      }))
    });
  }

  const formatName = (name) => {
    if (!name) return ''
    return name.replace(/_(.*?)_$/g, (match, p1) => (
      `<span class="zftext ">${unicodeSlavonic(p1)}</span>`
    ))
  }

  const formatOptionLabel = (option) => {
    const nameHtml = formatName(option.label);
    const isPopevka = currentType?.value === 1;
    
    let displayArray = [];
    const viewArray = Array.isArray(option.view) ? option.view : [];
    
    if (isPopevka && viewArray.length === 0) {
      displayArray = Array.isArray(option.valueArr) ? option.valueArr : [];
    } else {
      const dollarIndex = viewArray.indexOf('$');
      displayArray = dollarIndex !== -1 ? viewArray.slice(0, dollarIndex) : viewArray;
    }
    
    const resultString = displayArray.map(item => mezenets(item)).join('');

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div 
          dangerouslySetInnerHTML={{ __html: nameHtml }} 
          style={{ flex: 1, marginRight: '10px', fontSize: '1.0rem' }}
        />
        {resultString && (
          <div className="composition-group" style={{ border: '1px solid #eee', padding: '2px 6px', background: '#fff' }}>
            <div className="neume" style={{ textAlign: 'center', fontSize: '1.8rem' }}>
              {resultString.trim()}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="insertComposition text-left">
      <h4 className="text-left">Вставить попевку</h4>
      <div className="custom-control custom-checkbox mb-3">
        <input
          type="checkbox"
          className="custom-control-input"
          id="insetRazvodOfComposition"
          onChange={changeCheckbox}
          checked={insertRazvod}
        />
        <label className="custom-control-label" htmlFor="insetRazvodOfComposition">
          Вставить "в разводе"
        </label>
      </div>

      <div className="field">
        <label>Тип МФ</label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <RFReactSelect
              {...field}
              options={typeArray}
              onChange={item => {
                field.onChange(item)
                changeType(item)
              }}
            />
          )}
        />
      </div>

      <SelectSourcesContainer />

      <div className="field">
        <label>Глас</label>
        <Controller
          name="tone"
          control={control}
          render={({ field }) => (
            <RFReactSelect
              {...field}
              options={toneArray}
              isClearable
              onChange={item => {
                field.onChange(item)
                changeTone(item)
              }}
            />
          )}
        />
      </div>

      <div className="field">
        <label>Название</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <RFReactSelect
              {...field}
              options={compositionsNames}
              formatOptionLabel={formatOptionLabel}
              isDisabled={!watchedTone} 
              placeholder={!watchedTone ? "Сначала выберите глас..." : "Выберите название..."}
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
