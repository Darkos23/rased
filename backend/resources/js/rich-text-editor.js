import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

export default function richTextEditor(initialValue = '') {
    return {
        editor: null,
        value: initialValue,

        init() {
            this.editor = new Editor({
                element: this.$refs.editorEl,
                extensions: [
                    StarterKit,
                    Underline,
                    TextAlign.configure({ types: ['heading', 'paragraph'] }),
                    Link.configure({ openOnClick: false }),
                    Placeholder.configure({ placeholder: this.$el.dataset.placeholder || '' }),
                ],
                content: initialValue,
                onUpdate: ({ editor }) => {
                    this.value = editor.getHTML()
                },
            })
        },

        run(fn) {
            fn(this.editor.chain().focus())
            this.editor.chain().focus().run()
        },

        isActive(name, attrs = {}) {
            return this.editor ? this.editor.isActive(name, attrs) : false
        },

        setLink() {
            const url = window.prompt('URL')
            if (url === null) return
            if (url === '') {
                this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
                return
            }
            this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        },

        destroy() {
            this.editor?.destroy()
        },
    }
}
