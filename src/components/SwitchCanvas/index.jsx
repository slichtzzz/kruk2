import { useSelector, useDispatch } from 'react-redux';
import { toggleCanvasMode } from '../../slices/paperSlice'

const SwitchCanvas = () => {
  const dispatch = useDispatch();
  const isCanvas = useSelector(state => state.paper.isCanvasMode)
  
  function handleSwitch() {
	dispatch(toggleCanvasMode(!isCanvas));
	}

  return (
<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <span>Единый холст</span>
  <label className="toggle-switch">
    <input type="checkbox" checked={isCanvas} onChange={handleSwitch} />
    <span className="slider"></span>
  </label>
</div>
  );
};

export default SwitchCanvas;
