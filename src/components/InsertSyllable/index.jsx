import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { values, isNil } from 'lodash'
import { addSyllable, changeSyllable, insertSyllable, hideModal } from '../../slices/paperSlice'
import { 
  filterByName, filterByOptions, filterByPitch, 
  createOptionsList, createPitchList, 
  setIsOptionsMode, setIsPitchMode, 
  filterByOptionsStrict, setClearCurrentSymbols, exitPitchMode,
  setInsertOptionName, setInsertOptionSoft, setInsertOptionPitch
} from '../../slices/symbolSlice'
import { saveForm, resetForm } from '../../slices/symbolFormSlice'
import { RFReactSelect, RFReactMultiSelect, Loading, ucsToUnicode } from '../../utils'
import './style.css'

const InsertSyllable = () => {
  const dispatch = useDispatch()
  const optionsRef = useRef(null)

  const symbols = useSelector(state => state.symbols)
  const storedForm = useSelector(state => state.syllableForm)
  const editableSyllable = useSelector(state => state.paper.editableSyllable)
  const indexToInsert = useSelector(state => state.paper.indexToInsert)
  const { namesOfSymbols, isOptionsMode, isPitchMode } = symbols
  const { insertOptionName, insertOptionOptions, insertOptionPitch } = symbols

  const { control, watch, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: storedForm,
  })

  const watchedValues = watch()

  useEffect(() => {
    if (watchedValues) {
      dispatch(saveForm(watchedValues))
    }
  }, [watchedValues, dispatch])

useEffect(() => {
  if (insertOptionName && watchedValues.name?.label !== insertOptionName) {
    const nameObj = namesOfSymbols.find(n => n.label === insertOptionName);
    if (nameObj) {
      setValue('name', nameObj, { shouldValidate: true });
      dispatch(createOptionsList(insertOptionName));
    }
  }
}, [insertOptionName, namesOfSymbols, setValue, watchedValues.name, dispatch]);


  useEffect(() => {
    if (isOptionsMode) {
      const currentLabels = (watchedValues.options || []).map(o => o.label)
      dispatch(filterByOptions(currentLabels))
      dispatch(createOptionsList())
    }
  }, [isOptionsMode, dispatch])

useEffect(() => {
  const currentValues = getValues('options') || [];
  if (JSON.stringify(currentValues) !== JSON.stringify(insertOptionOptions)) {
    setValue('options', insertOptionOptions, { 
      shouldDirty: true, 
      shouldValidate: true 
    });
  }
}, [insertOptionOptions, setValue, getValues]);

useEffect(() => {
  if (insertOptionPitch) {
    const pitchObj = symbols.pitchs?.find(p => p.label === insertOptionPitch);
    setValue('pitch', pitchObj || { label: insertOptionPitch, value: insertOptionPitch });
  } else {
    setValue('pitch', null);
  }
}, [insertOptionPitch, setValue, symbols.pitchs]);

useEffect(() => {
  // Как только изменился режим, принудительно перенести фокус
  const targetId = isPitchMode ? 'symbol-pitch-select' : 
                   isOptionsMode ? 'symbol-options-select' : 
                   'symbol-name-select';
                   
  const container = document.getElementById(targetId);
  if (container) {
    const input = container.querySelector('input') || container;
    if (document.activeElement !== input) {
      input.focus();
    }
  }
}, [isOptionsMode, isPitchMode]); 

  const onSubmit = data => {
    const symbolTemplate = 
      (symbols.symbolsFilteredByPitch?.[0]) || 
      (symbols.symbolsFilteredByOptions?.[0]) || 
      (symbols.symbolsFilteredByName?.[0])

    if (!symbolTemplate) {
      console.error('Знамя не найдено');
      return;
    }
	const { _id, name, value, zf, notes } = symbolTemplate;
    const syllableForInsert = {
      _id: _id,
      name: name,
      value: value,
      zf: zf,
      notes: notes,
      text: data.syllable === '-' ? '' : data.syllable || '-', 
      type: 'KRUK',
    }

    if (!isNil(editableSyllable)) {
      dispatch(changeSyllable({ indexOfChangingSyllable: editableSyllable, syllable: syllableForInsert }))
    } else if (!isNil(indexToInsert)) {
      dispatch(insertSyllable({ index: indexToInsert, syllable: syllableForInsert }))
    } else {
      dispatch(addSyllable(syllableForInsert))
    }

    handleClose()
  }

	const blockTextInput = (event, onHotkey) => {
	  const systemKeys = ['Tab', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace'];
	  if (systemKeys.includes(event.key)) {
	    return;
	  }
	
	  if (event.key.length === 1 && !event.ctrlKey && !event.altKey) {
	    event.preventDefault();
	    
	    //if (onHotkey) {
	      //onHotkey(event.key); 
	    //}
	  }
	};


  const handleClose = () => {
    dispatch(setIsOptionsMode(false))
    dispatch(setIsPitchMode(false))
    dispatch(resetForm())
    dispatch(filterByName(null))
    dispatch(setClearCurrentSymbols())
    reset({ name: null, options: [], pitch: null, syllable: '' })
    dispatch(hideModal())
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
	  const currentValues = getValues(); 
      const isTextInput = event.target.id === 'symbol-text-select';
      const pressedKey = (event.altKey ? "Alt+" : "") + event.key.toLowerCase();

      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit(onSubmit)();
        return;
      }
      
	if (event.key === 'Escape') {
	  event.preventDefault();
	  if (isTextInput) {
	    event.target.blur();
	    document.getElementById('symbol-pitch-select')?.focus();
	  } else if (isPitchMode) {
	    event.preventDefault();
	    document.activeElement?.blur();
	    setValue('pitch', null); 
		dispatch(setIsPitchMode(false));
		dispatch(setIsOptionsMode(true));
		dispatch(exitPitchMode());
	  } else if (isOptionsMode) {
	    dispatch(setIsOptionsMode(false));
	    dispatch(filterByOptions([]));
	  } else {
	    handleClose();
	  }
	  return;
	}


      if (isTextInput) {
        if (event.key === 'Tab') {
          event.preventDefault();
          event.stopImmediatePropagation(); 
          dispatch(setIsOptionsMode(false));
          dispatch(setIsPitchMode(false));
          document.getElementById('symbol-name-select')?.focus();
        }
        return;
      }

      // РЕЖИМ 1: ИМЯ
      if (!isOptionsMode && !isPitchMode) {
        if (event.key === 'Tab' && watchedValues.name) {
          event.preventDefault();
          event.stopImmediatePropagation(); 
          dispatch(setIsOptionsMode(true));
          return;
        }

        const found = namesOfSymbols.find(item => 
          item.hotkey?.some(k => k.toLowerCase() === pressedKey)
        );

        if (found) {
          event.preventDefault();
          reset({ ...watchedValues, name: found, options: [], pitch: null, syllable: '' });
          dispatch(setInsertOptionName(found.label));
          dispatch(filterByName(found.label));
          dispatch(createOptionsList());
        }
      }
      
      // РЕЖИМ 2: ОПЦИИ
      else if (isOptionsMode && !isPitchMode) {
        if (event.key === 'Tab') {
          event.preventDefault();
          event.stopImmediatePropagation(); 
          const selectedLabels = (watchedValues.options || []).map(o => o.label);
          const topSymbolOptions = symbols.symbolsFilteredByOptions?.[0]?.['opts'] || [];
          const combinedOptions = [...new Set([...selectedLabels, ...topSymbolOptions])];
          dispatch(setInsertOptionSoft(insertOptionOptions));
          dispatch(filterByOptionsStrict(combinedOptions));
          dispatch(createPitchList());
          dispatch(setIsPitchMode(true));
          return;
        }

        const foundOption = symbols.options?.find(opt => 
          symbols.optionsHotkeys[opt.label]?.includes(pressedKey)
        );
        
		if (foundOption) {
		  event.preventDefault();
		  const currentOptions = getValues('options') || [];
		  const isAlreadySelected = currentOptions.some(o => o.label === foundOption.label);
		  const newOptions = isAlreadySelected
		    ? currentOptions.filter(o => o.label !== foundOption.label)
		    : [...currentOptions, foundOption];
		  dispatch(filterByOptions(newOptions));
		}
      }

      // РЕЖИМ 3: ПОМЕТА
      else if (isPitchMode) {
        if (event.key === 'Tab') {
          event.preventDefault();
          event.stopImmediatePropagation(); 
          document.getElementById('symbol-text-select')?.focus();
          return;
        }
        const foundPitch = symbols.pitchs?.find(p => symbols.pitchHotkeys[p.label]?.includes(pressedKey));
        if (foundPitch) {
          event.preventDefault();
          dispatch(setInsertOptionPitch(foundPitch.label));
          dispatch(filterByPitch(foundPitch.label));
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress, true);
    return () => window.removeEventListener('keydown', handleKeyPress, true);
  }, [isOptionsMode, isPitchMode, symbols, namesOfSymbols, dispatch, reset, setValue, handleSubmit, getValues]);

  if (!symbols.symbols) return <Loading />

  return (
    <div className="inputForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4 className="text-left">Введите знамя</h4>

        {/* NAME */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className={`field ${!isOptionsMode && !isPitchMode ? 'active-step' : 'completed-step'}`}>
              <label htmlFor="symbol-name-select">Знамя</label>
              <RFReactSelect
                {...field}
                value={namesOfSymbols.find(opt => opt.label === insertOptionName) || field.value || null}
                id="symbol-name-select"
                options={namesOfSymbols}
                className="input input-name"
                onKeyDown={blockTextInput}
                onChange={item => {
                  field.onChange(item)
                  dispatch(setInsertOptionName(item.label))
                  dispatch(filterByName(item.label))
                  dispatch(filterByOptions([]))
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
            <div className={`field ${isOptionsMode && !isPitchMode ? 'active-step' : (watchedValues.options?.length > 0 ? 'completed-step' : '')}`}>
              <label htmlFor="symbol-options-select">Опции</label>
              <RFReactMultiSelect
                {...field}
                id="symbol-options-select"
                selectRef={optionsRef}
                options={symbols.options}
                className="input input-option"
                onKeyDown={blockTextInput}
                onChange={options => {
                  field.onChange(options)
                  dispatch(filterByOptions(options || []));
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
            <div className={`field ${isPitchMode ? 'active-step' : (watchedValues.pitch ? 'completed-step' : '')}`}>
              <label htmlFor="symbol-pitch-select">Помета</label>
              <RFReactSelect
                {...field}
                id="symbol-pitch-select"
                options={symbols.pitchs}
                className="input input-pitch"
                onKeyDown={blockTextInput}
                onChange={item => {
                  field.onChange(item)
                  dispatch(filterByPitch(item.label))
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
        onBlur={() => {
          if (!field.value || field.value === '') {
          field.onChange('-');
          }}}
      />
    </div>
  )}
/>


        <div className="status-tip">
          {!isOptionsMode && !isPitchMode && <span>⌨️ Буква — выбор Крюка, <b>Tab</b> — к опциям</span>}
          {isOptionsMode && !isPitchMode && <span>⌨️ Буква — опция, <b>Tab</b> — к помете, <b>Esc</b> — назад</span>}
          {isPitchMode && <span>⌨️ Буква — помета, <b>Enter</b> — готово, <b>Esc</b> — назад</span>}
        </div>
        
        <button type="submit" style={{ display: 'none' }} aria-hidden="true">Добавить</button>
      </form>
    </div>
  )
}

export default InsertSyllable
