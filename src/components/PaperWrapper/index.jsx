import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchZnamenSymbols, fetchDemestvoSymbols, fetchSources, setSymbols } from '../../slices/symbolSlice.js';
import Paper from '../Paper';
import './style.css';

export const PaperWrapper = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
  Promise.all([
    dispatch(fetchZnamenSymbols()).unwrap(),
    dispatch(fetchDemestvoSymbols()).unwrap(),
    dispatch(fetchSources()).unwrap(),
  ])
    .then(([znamenData, demestvoData]) => {
      dispatch(setSymbols(znamenData));
      
      setLoading(false);
    })
    .catch((err) => {
      console.error("Ошибка при загрузке баз данных:", err);
    });
}, [dispatch]);


  return loading ? (
    <div className="loading-screen">
      <h1 className="title">Доме́стикъ</h1>
      <div
        className="spinner spinner--steps icon-spinner loading-gif"
        aria-hidden="true"
      />
    </div>
  ) : (
    <Paper />
  );
};

export default PaperWrapper;
