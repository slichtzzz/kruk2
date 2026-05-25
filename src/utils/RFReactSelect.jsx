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
  ...rest
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
      {...rest}
    />
  )
}

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

