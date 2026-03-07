import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import RangeInput from './RangeInput'

export const RangeForm = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      volume: 50,
    },
  })

  const onSubmit = (data) => {
    console.log('Form data:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="volume">Громкость</label>
      <Controller
        name="volume"
        control={control}
        render={({ field }) => (
          <RangeInput
            {...field}
            id="volume"
            min={0}
            max={100}
            step={1}
            className="range-slider"
          />
        )}
      />
      <button type="submit">Отправить</button>
    </form>
  )
}
