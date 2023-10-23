import { Box } from '@fower/react'
import { ChevronDown } from 'lucide-react'
import { Path, Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ListContentElement, ListElement } from '../types'

interface Props {
  element: ListContentElement
}

export const Chevron = ({ element }: Props) => {
  const editor = useSlate()

  function toggle() {
    const path = findNodePath(editor, element)!

    Transforms.setNodes<ListContentElement>(
      editor,
      {
        collapsed: !element.collapsed,
      },
      { at: path },
    )
  }

  return (
    <Box
      square4
      toCenter
      roundedFull
      cursorPointer
      opacity-0
      opacity-100--$nodeContent--hover
      gray600
      border
      borderGray200
      onClick={() => {
        toggle()
      }}
    >
      <ChevronDown size={12} />
    </Box>
  )
}