import React from 'react'
import Select from 'react-select'
import { Controller } from 'react-hook-form'
import './style.css'

/**
 * Компонент MultiSelect для react-hook-form
 * @param {object} props
 * @param {string} props.name - имя поля формы
 * @param {object[]} props.options - массив опций { value, label }
 * @param {object} props.control - control из useForm
 * @param {function} [props.onChangeExtra] - дополнительная функция при изменении значения
 */
const MultiSelectRH = ({ name, options, control, onChangeExtra }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          options={options}
          isMulti
          className="field"
          onChange={(selected) => {
            field.onChange(selected)
            if (onChangeExtra) onChangeExtra(selected)
          }}
        />
      )}
    />
  )
}

export default MultiSelectRH
