import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

const Symbol = ({ value, pitch, name, addSyllable }) => {
  const handleAdd = () => {
    const syllableForInsert = {
      value,
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

Symbol.propTypes = {
  value: PropTypes.string.isRequired,
  pitch: PropTypes.string,
  name: PropTypes.string,
  addSyllable: PropTypes.func.isRequired,
}

export default Symbol
