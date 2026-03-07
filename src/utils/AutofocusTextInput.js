import React, { useRef, useEffect } from 'react'
import ChooseOptions from '../components/ChooseOptions'

const AutoFocusTextInput = () => {
  const textInputRef = useRef(null)

  useEffect(() => {
    if (textInputRef.current?.focusTextInput) {
      textInputRef.current.focusTextInput()
    }
  }, [])

  return <ChooseOptions ref={textInputRef} />
}

export default AutoFocusTextInput
