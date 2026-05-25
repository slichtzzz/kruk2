import { useSelector, useDispatch } from 'react-redux';
import { setShowNotes } from '../../slices/paperSlice'
import { updatePaperStyle } from '../../slices/paperStyleSlice'

const SwitchNotes = () => {
  const dispatch = useDispatch();
  const isShow = useSelector(state => state.paper.showNoteString)
  
  function handleSwitch() {
	dispatch(setShowNotes(!isShow));
	}

  return (
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <span>Двоезнаменник</span>
  <label className="toggle-switch">
    <input type="checkbox" checked={isShow} onChange={handleSwitch} />
    <span className="slider"></span>
  </label>
</div>
  );
};

export default SwitchNotes;
