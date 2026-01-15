// src/components/tiptap-ui/stanza-button.jsx
import { useCurrentEditor } from '@tiptap/react'
import { Button } from "@/components/tiptap-ui-primitive/button"

export function StanzaButton() {
  const { editor } = useCurrentEditor()
  if (!editor) return null

  let label = "Add Stanza"
  return (
    <Button
      onClick={() => editor.chain().focus().addStanza().run()}
      data-style="ghost"
      title={label}
      tooltip={label}
      type="button"
      aria-label={label}
      role="button"
    >
      Stanza 
    </Button>
  )
}
