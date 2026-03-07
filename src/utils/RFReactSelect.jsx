import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

export const RFReactSelect = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  className,
  id,
}) => {
  return (
    <Select
      name={name}
      inputId={id}
      value={value}
      options={options}
      onChange={onChange}
      onBlur={onBlur}
      className={className}
    />
  )
}
/*
RFReactSelect.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  }).isRequired,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
}
*/
export const RFReactMultiSelect = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  className,
  id,
  ...rest
}) => {
  return (
    <Select
      name={name}
      value={value}
      isMulti
      inputId={id}
      options={options}
      onChange={onChange}
      onBlur={onBlur}
      className={className}
      {...rest}
    />
  )
}
/*
RFReactMultiSelect.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  }).isRequired,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
}*/
