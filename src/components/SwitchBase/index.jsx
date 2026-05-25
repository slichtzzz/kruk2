import { useSelector, useDispatch } from 'react-redux';
import { setIsDemestvoMode } from '../../slices/symbolSlice'

const Toggle = () => {
  const dispatch = useDispatch();
  const isDemestvoOn = useSelector(state => state.symbols.isDemestvoMode)
  
  function handleSwitch() {
	dispatch(setIsDemestvoMode(!isDemestvoOn));
	}

  return (
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <span>Переключить на демество</span>
  <label className="toggle-switch">
    <input type="checkbox" checked={isDemestvoOn} onChange={handleSwitch} />
    <span className="slider"></span>
  </label>
</div>
  );
};

export default Toggle;
