import { useSelector, useDispatch } from 'react-redux';
import { setLegacyMode } from '../../slices/paperSlice'

const SwitchLegacyMode = () => {
  const dispatch = useDispatch();
  const isLegacyMode = useSelector(state => state.paper.isLegacyMode)
  
  function handleSwitch() {
	dispatch(setLegacyMode(!isLegacyMode));
	}

  return (
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <span>Старый интерфейс</span>
  <label className="toggle-switch">
    <input type="checkbox" checked={isLegacyMode} onChange={handleSwitch} />
    <span className="slider"></span>
  </label>
</div>
  );
};

export default SwitchLegacyMode;
