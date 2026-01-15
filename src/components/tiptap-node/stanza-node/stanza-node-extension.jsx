// src/components/tiptap-node/stanza-node/stanza-node-extension.jsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import StanzaNodeView from "./stanza-node-view"



// create node that *contains* block children (paragraphs)
export const StanzaExtension = Node.create({
  name: "stanza",
  group: "block",
  atom: true,        // <--- IMPORTANT: allows multiple children
  content: "block*",         // <--- IMPORTANT: allows paragraphs inside
  selectable: true,
  draggable: true,           // <--- allows drag/reorder
  defining: true,            // treat this node as a meaningful block

  addAttributes() {
    return {
      id: { default: null, parseHTML: el => el.getAttribute("data-id"), renderHTML: attrs => (attrs.id ? { "data-id": attrs.id } : {}) },
      text: { default: "" },
    }
  },

  parseHTML() {
    return [{ tag: "div[data-type=stanza]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "stanza",
        dir:"rtl",
        class:
          "stanza-block p-2 border-1 border-gray-600 cursor-pointer text-white font-nastaliq text-lg whitespace-pre-line text-center tracking-widest",
        draggable: "true", // helpful for native drag visuals
      }), 
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer((props) => (
      <StanzaNodeView {...props} editor={this.editor} />
    ))
  },

  addCommands() {
    return {
      // insert stanza with a default paragraph inside
      addStanza:
        (attrs = {}) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: { id: attrs.id ?? `stanza-${Date.now()}` },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: attrs.text ?? ` ` }],
                },
              ],
            })
          },

      // replace the content inside a stanza by id (used by search)
      setStanzaContent:
        (id, text) =>
          ({ commands }) =>
            commands.command(({ tr, state, dispatch }) => {
              let found = false
              state.doc.descendants((node, pos) => {
                if (node.type.name === "stanza" && node.attrs.id === id) {
                  found = true
                  const from = pos + 1 // start of children
                  const to = pos + node.nodeSize - 1 // end of children
                  // remove old children
                  tr = tr.delete(from, to)
                  // create new paragraph node with the chosen text
                  const paragraph = state.schema.nodes.paragraph.create({}, state.schema.text(text))
                  tr = tr.insert(from, paragraph)
                }
              })
              if (found && dispatch) {
                dispatch(tr.scrollIntoView())
                return true
              }
              return false
            }),
    }
  },
})

export default StanzaExtension
