import { useSelector, useDispatch } from 'react-redux';
import { setPlayNotes } from '../../slices/paperSlice'

const SwitchPlay = () => {
  const dispatch = useDispatch();
  const isPlayNotes = useSelector(state => state.paper.isPlayNotes)
  
  function handleSwitch() {
	dispatch(setPlayNotes(!isPlayNotes));
	}

  return (
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <span>Проигрывать абзац</span>
  <label className="toggle-switch">
    <input type="checkbox" checked={isPlayNotes} onChange={handleSwitch} />
    <span className="slider"></span>
  </label>
</div>
  );
};

export default SwitchPlay;
