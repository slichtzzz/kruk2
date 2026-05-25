import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Badge } from 'reactstrap';
import { setInsertOptionName, setInsertOptionPitch, filterByName, filterByOptions, filterByPitch } from '../../slices/symbolSlice'
import { focusActiveInput } from '../../utils'
import './style.css'

const HelpSection = () => {
  const dispatch = useDispatch()
  const isOptionsMode = useSelector(state => state.symbols.isOptionsMode)
  const isPitchMode = useSelector(state => state.symbols.isPitchMode)
  const pitchHotkeys = useSelector(state => state.symbols.pitchHotkeys)
  const optionsHotkeys = useSelector(state => state.symbols.optionsHotkeys)
  const allSymbols = useSelector(state => state.symbols.symbols)
  const currentSymbols = useSelector(state => state.symbols.currentSymbols)
  const symbolsFilteredByOptions = useSelector(state => state.symbols.symbolsFilteredByOptions)
  const { insertOptionOptions = [] } = useSelector(state => state.symbols); 

  const uniqueOptionsHotkeys = React.useMemo(() => {
    if (!currentSymbols || !optionsHotkeys) return [];
    const availableOpts = new Set(currentSymbols.flatMap(s => s.opts || []));
    return Object.entries(optionsHotkeys)
      .filter(([name]) => availableOpts.has(name))
      .map(([name, hotkey]) => ({ name, hotkey }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [currentSymbols, optionsHotkeys]);

    const uniquePitchHotkeys = React.useMemo(() => {
    const source = symbolsFilteredByOptions || [];
    if (!source || !pitchHotkeys) return [];

    const availablePitches = new Set(source.map(s => String(s.pitch))); 
    return Object.entries(pitchHotkeys)
      .filter(([name]) => availablePitches.has(String(name))) 
      .map(([name, hotkey]) => ({ name, hotkey }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [symbolsFilteredByOptions, pitchHotkeys]);
  
  const ssymbols = React.useMemo(() => {
    if (isPitchMode) return uniquePitchHotkeys; 
    if (isOptionsMode) return uniqueOptionsHotkeys; 

    const data = allSymbols || [];
    return [...data].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [isPitchMode, isOptionsMode, uniquePitchHotkeys, uniqueOptionsHotkeys, allSymbols]);

const handleHotkeyClick = (symbolName) => {
  if (!isOptionsMode && !isPitchMode) {
	  dispatch(setInsertOptionName(symbolName));
	  dispatch(filterByName(symbolName));
	  }
  if (isOptionsMode && !isPitchMode) {
    const isAlreadySelected = insertOptionOptions.some(o => o.label === symbolName);
    if (!isAlreadySelected) {
    const isAlreadySelected = insertOptionOptions.some(o => o.label === symbolName);
    if (!isAlreadySelected) {
      const newOptions = [...insertOptionOptions, { label: symbolName, value: symbolName }];
      dispatch(filterByOptions(newOptions));
    }
    }
  }
  else if (isPitchMode) {
    dispatch(setInsertOptionPitch(symbolName));
    dispatch(filterByPitch(symbolName));
  } 
};

  return (
    <div className="hotkey-side-container">
      <h6 className="mb-3" style={{color: '#0000ff', fontWeight: 'bold', fontSize: '12pt'}}>
        Сочетания клавиш
      </h6>
      <Table hover responsive size="sm" className="align-middle hotkey-side-table">
        <tbody className="hotkey-side-twocolumn-body">
          {ssymbols.map((symbol, index) => (
            <tr key={index} className="hotkey-side-row" style={{
				cursor: 'pointer',
				transition: 'background-color 0.2s'
				}}   onClick={() => {
					handleHotkeyClick(symbol.name)
					focusActiveInput(isOptionsMode, isPitchMode);
					}}>
              <td className="hotkey-side-cell-name">{symbol.name}</td>
              <td className="text-end hotkey-side-cell-key">
                <Badge color="light" className="text-dark border" style={{fontSize: '11pt'}}>
                  {symbol.hotkey && Array.isArray(symbol.hotkey) && symbol.hotkey.length > 0 
                    ? symbol.hotkey[0] : (symbol.hotkey || '—')}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default HelpSection;
