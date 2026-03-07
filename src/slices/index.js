import { combineReducers } from 'redux'
import paperSlice from './paperSlice.js'
import symbolsSlice from './symbolSlice.js'
import symbolFormSlice from './symbolFormSlice.js'
import paperStyleSlice from './paperStyleSlice.js'

const rootReducer = combineReducers({
  paper: paperSlice,
  symbols: symbolsSlice,
  symbolForm: symbolFormSlice,
  paperStyle: paperStyleSlice,
})

export default rootReducer
