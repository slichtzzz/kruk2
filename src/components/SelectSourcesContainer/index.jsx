import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { RFReactSelect } from '../../utils/RFReactSelect.jsx'
import { setSource } from '../../slices/symbolSlice.js'

const SelectSourcesContainer = () => {
  const dispatch = useDispatch()
  const sources = useSelector(state => state.symbols.sources) || []
  const currentSource = useSelector(state => state.symbols.currentSource)
  const isLoading = useSelector(state => state.symbols.isLoading)
  const { control, setValue } = useForm({
    defaultValues: {
      sourceId: currentSource || "1",
    },
  })

  const watchedSourceId = useWatch({ control, name: 'sourceId' })
  useEffect(() => {
    if (currentSource) {
      setValue('sourceId', String(currentSource))
    }
  }, [currentSource, setValue])

  useEffect(() => {
    if (watchedSourceId) {
      dispatch(setSource(watchedSourceId))
    }
  }, [watchedSourceId, dispatch])

  const selectedSource = sources.find(s => String(s._id) === String(watchedSourceId))

  const options = sources.map(item => ({
    label: item.shortname,
    value: String(item._id),
  }))

  return (
    <div className="field">
      <label>Источник</label>
      <div className="d-flex align-items-center gap-2">
        <Controller
          name="sourceId"
          control={control}
          render={({ field }) => (
            <RFReactSelect
              options={options}
              value={options.find(opt => opt.value === String(field.value)) || null}
              onChange={(selected) => field.onChange(selected ? selected.value : null)}
            />
          )}
        />
        {isLoading && <Spinner animation="border" size="sm" variant="primary" />}
      </div>

      {/* Панель детальной информации об источнике */}
      {selectedSource && (
        <div className="mt-3 p-3 bg-light border rounded shadow-sm">
          <div className="border-bottom pb-2 mb-2" style={{ minWidth: '300px' }}>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Автор</div>
            <div className="small fw-bold">{selectedSource.author || '—'}</div>
          </div>
          <div style={{ minWidth: '300px' }}>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Название</div>
            <div className="small">{selectedSource.name}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectSourcesContainer
