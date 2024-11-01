import { useState } from 'react'
import * as React from 'react'
import { Remarkable } from 'remarkable'
import { linkify } from 'remarkable/linkify'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import Box from '@mui/material/Box'
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import { value } from '@shared/constants'
import { ViewEditButton } from './Button/ViewEditButton'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const md = new Remarkable('full', {
  html: true,
  typographer: true
})

md.use(linkify)

export const MD = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()

  const [text, setText] = useState(selectedNote?.content)

  const [editing, setEditing] = useState(false)

  const toggleEditing = () => {
    if (editing == true) {
      value.val = 0
    } else {
      value.val = 1
    }

    setEditing(!editing)
  }

  if (!selectedNote) return null

  const elements = document.querySelectorAll('a[id*="fnref"]')

  elements.forEach((el) => {
    el.setAttribute('target', '_self')
  })

  const back = document.querySelectorAll('a[class=footnote-backref]')

  back.forEach((el) => {
    el.setAttribute('target', '_self')
  })

  return (
    <div className="overflow-hidden">
      <base target="_blank" />
      <CustomTabPanel value={value.val} index={1}>
        <TextareaAutosize
          ref={editorRef}
          name="textarea"
          title=""
          id="markdown"
          className="bg-transparent caret-yellow-500 outline-none resize-none w-full h-full text-2xl -my-6 z-10 monospace"
          defaultValue={selectedNote.content}
          required
          onChange={(e) => {
            setText(e.target.value)
            selectedNote.content = text
            handleAutoSaving
          }}
          onBlur={handleBlur}
          onFocus={() => setText(selectedNote.content)}
          key={selectedNote.title}
          autoFocus
        />
        <div className="py-20" />
      </CustomTabPanel>
      <CustomTabPanel value={value.val} index={0}>
        <div
          id="md"
          className="md select-text -my-6 z-10 outline-none monospace [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: md.render(selectedNote.content) }}
        />
        <div className="py-20" />
      </CustomTabPanel>
      <ViewEditButton isEditing={editing} onClick={toggleEditing} />
    </div>
  )
}
