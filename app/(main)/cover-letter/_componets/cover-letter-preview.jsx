'use client';
import MDEditor from '@uiw/react-md-editor'
import React from 'react'

const CoverLetterPreview = ({letter}) => {
  return (
    <div>
      <MDEditor value={letter.content} height={700} preview='preview'/>
    </div>
  )
}

export default CoverLetterPreview
