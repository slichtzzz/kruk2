import React from 'react'

const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100px', width: '100%' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Загрузка…</span>
    </div>
  </div>
)

export default Loading
