import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSymbols } from '../../slices/symbolSlice.js';
import { getDataFromServer } from '../../utils';
import Paper from '../Paper';
import './style.css';

export const PaperWrapper = () => {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	useEffect(() => {
		getDataFromServer('https://domestikos.ru/base/kruk/all').then((data) => {
			dispatch(setSymbols(data));
			setLoading(false);
			})
		},[dispatch])

    return loading ? (
      <>
<div className="loading-screen">
    <h1 className="title">Доме1стикъ</h1>
    <div
        className="spinner spinner--steps icon-spinner loading-gif"
        aria-hidden="true"
    />
</div>
      </>
     ) : ( <Paper /> )
  };

export default PaperWrapper
