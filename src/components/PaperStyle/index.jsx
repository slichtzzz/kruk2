import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Container, Col, Input, Label, Form, FormGroup } from 'reactstrap'
import { updatePaperStyle } from '../../slices/paperStyleSlice'
import { customFonts } from '../../res'
import { Select } from '../../utils'
import './style.css'

const PaperStyle = () => {
  const dispatch = useDispatch()
  const paperStyle = useSelector(state => state.paperStyle)
  const { control } = useForm({
    defaultValues: paperStyle,
  })
  const fontOptions = customFonts.map((font, index) => ({
    value: index,
    label: font
	}));

  // Обновляем store только при изменении конкретного поля
  const handleChange = (fieldName, value) => {
	console.log("Получено: ", fieldName, value);
    dispatch(updatePaperStyle({ ...paperStyle, [fieldName]: value }))
  }

  return (
    <Container className="paperStyle text-left">
      <h4>Настройки</h4>
      <Form>
        <FormGroup row>
          <Col>
            <Label>Размер знамен</Label>
            <Controller
              name="symbolFontSize"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  min="30"
                  max="180"
                  onChange={e => {
                    field.onChange(e)
                    handleChange('symbolFontSize', +e.target.value)
                  }}
                />
              )}
            />
          </Col>

          <Col>
            <Label>Размер текста</Label>
            <Controller
              name="textFontSize"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  min="10"
                  max="80"
                  onChange={e => {
                    field.onChange(e)
                    handleChange('textFontSize', +e.target.value)
                  }}
                />
              )}
            />
          </Col>
        </FormGroup>

      <FormGroup row>
        <Col>
          <Label for="marginTop">Отступ текста от знамени</Label>
          <Controller
              name="marginTop"
              control={control}
              render={({ field }) => (
				<Input
                    type="number"
                    {...field}
					min="1"
					max="80"
					onChange={e => {
						field.onChange(e)
						handleChange('marginTop', +e.target.value)
					}}
				/>
			 )}
		  />
        </Col>
        <Col>
          <Label for="marginBottom">Межстрочный интервал</Label>
          <Controller
              name="marginBottom"
              control={control}
              render={({ field }) => (
		          <Input
                    type="number"
                    {...field}
		            min="1"
		            max="80"
		            onChange={e => {
						field.onChange(e)
						handleChange('marginBottom', +e.target.value)
					}}
				 />
			  )}
		   />
        </Col>
      </FormGroup>

        <FormGroup row>
          <Col>
            <Label>Шрифт слогов</Label>
            <Controller
              name="fontOfTextInSyllables"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={customFonts}
                  onChange={e => {
					const value = e.target.value
                    field.onChange(value)
                    console.log(field.value)
                    handleChange('fontOfTextInSyllables', value)
                  }}
                />
              )}
            />
          </Col>

          <Col>
            <Label>Размер буквицы</Label>
            <Controller
              name="sizeOfBucvica"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  min="50"
                  max="180"
                  onChange={e => {
                    field.onChange(e)
                    handleChange('sizeOfBucvica', +e.target.value)
                  }}
                />
              )}
            />
          </Col>
        </FormGroup>
      </Form>
    </Container>
  )
}

export default PaperStyle
