import React from 'react'
import './style.css'

const Symbol = ({ _id, value, pitch, zf, notes, name, addSyllable }) => {
  const handleAdd = () => {
    const syllableForInsert = {
	  _id,
      value,
      name,
      zf,
      notes,
      text: '-',
      type: 'KRUK',
    }
    addSyllable(syllableForInsert)
  }

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value)
  }

  return (
    <div className="previewItem" onClick={handleAdd}>
      <div
        className="previewKruk"
        dangerouslySetInnerHTML={{ __html: value }}
        data-toggle="tooltip"
        data-html="true"
        title={`${name}, помета: ${pitch}`}
      />
      <div className="sourceHtml">{value}</div>
      <button
        className="copy-button btn btn-outline-primary btn-sm"
        onClick={handleCopy}
      >
        <i className="icon-copy" />
      </button>
    </div>
  )
}

export default Symbol
