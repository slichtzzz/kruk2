import { RFReactSelect, RFReactMultiSelect } from './RFReactSelect.jsx'
//import { withErrorHandling, DivWithErrorHandling } from './withErrorHandling'

import Loading from './Loading'
import Header from './Header/index.jsx'
//import RangeInput from './RangeInput'
import getPageNum from './getPageNum'
import getPaperItem from './getPaperItem.jsx'
import Select from './Select'

export {
  RFReactMultiSelect,
  RFReactSelect,
  Loading,
  Header,
  //RangeInput,
  getPageNum,
  //withErrorHandling,
  //DivWithErrorHandling,
  Select,
  getPaperItem,
}

export const getDataFromServer = async (url) => {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Можно выбросить ошибку или вернуть значение по умолчанию
  }
}

export const getDate = () => {
  const today = new Date()
  return `${String(today.getMonth() + 1).padStart(2, '0')}.${String(
    today.getDate(),
  ).padStart(2, '0')}.${today.getFullYear()}`
}
