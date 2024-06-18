import React from 'react'
import { Kalam } from 'next/font/google'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import Draggable from 'react-draggable'

import { NoteLayer } from '@/types/canvas'
import { cn, getContrastingTextColor } from '@/lib/utils'
import { useMutation } from '@/liveblocks.config'

const font = Kalam({ subsets: ['latin'], weight: ['400'] })

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96
  const scaleFactor = 0.15
  const fontSizeBasedOnHeight = height * scaleFactor
  const fontSizeBasedOnWidth = width * scaleFactor

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize)
}

interface NoteProps {
  id: string
  layer: NoteLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  selectionColor?: string
}

export const Note = ({
  layer,
  onPointerDown,
  id,
  selectionColor,
}: NoteProps) => {
  const { x, y, width, height, fill, value } = layer

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get('layers')

    liveLayers.get(id)?.set('value', newValue)
  }, [])

  const handleContentChange = (e: ContentEditableEvent) =>
    updateValue(e.target.value)

  return (
    <Draggable defaultPosition={{ x, y }}>
      <foreignObject
        width={width}
        height={height}
        onPointerDown={e => onPointerDown(e, id)}
        style={{
          outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
          padding: '10px',
          borderRadius: '10px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          cursor: 'move',
        }}
        className="shadow-md drop-shadow-xl"
      >
        <ContentEditable
          html={value || 'Text'}
          onChange={handleContentChange}
          className={cn(
            'h-full w-full flex items-center justify-center text-center outline-none',
            font.className
          )}
          style={{
            fontSize: calculateFontSize(width, height),
            color: fill ? getContrastingTextColor(fill) : '#000',
          }}
        />
      </foreignObject>
    </Draggable>
  )
}
