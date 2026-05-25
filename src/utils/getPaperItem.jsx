import React from 'react'
import { Bucvica, Text, Syllable, Break } from '../containers'
import { parseHightsForBravura } from '../utils/musicMap.js';

const getPaperItem = (
  form,
  value,
  notes,
  text,
  type,
  paragraphIndex,
  pageIndex,
  index,
  changePage,
  removeSyllablebyIndex,
) => {
  const processedNotes = parseHightsForBravura(notes);
  switch (type) {
    case 'KRUK': {
      return (
        <Syllable
          value={value}
          notesData={processedNotes}
          text={text}
          key={parseInt(index, 10)}
          paragraphIndex={paragraphIndex}
          pageIndex={pageIndex}
          index={parseInt(index, 10)}
        />
      )
    }
    case 'BUCVICA': {
      return (
        <Bucvica
          form={form}
          removeSyllablebyIndex={removeSyllablebyIndex}
          changePage={changePage}
          text={text}
          index={parseInt(index, 10)}
          paragraphIndex={paragraphIndex}
          pageIndex={pageIndex}
        />
      )
    }
    case 'TEXT': {
      return (
        <Text
          text={text}
          pageIndex={pageIndex}
          index={parseInt(index, 10)}
          key={parseInt(`${pageIndex}${paragraphIndex}${index}`, 10)}
        />
      )
    }
case 'BREAK': {
  return (
    <Break
      index={parseInt(index, 10)}
      pageIndex={pageIndex}
      paragraphIndex={paragraphIndex}
      removeSyllablebyIndex={removeSyllablebyIndex}
      changePage={changePage}
    />
  )
}
    default:
      return null
  }
}

export default getPaperItem
