import React from 'react'
import { Input } from 'reactstrap'

const Select = ({
  name,
  value,
  onChange,
  onBlur,
  id,
  options,
}) => (
  <Input
    type="select"
    name={name}
    id={id}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
  >
    {options.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </Input>
)

export default Select
