<template>
  <component
    v-bind:is="tag"
    :contenteditable="hasFocus"
    ref="elm"
    :spellcheck="allowSpellcheck"
    :class="{ 'placeholder': !this.hasContent }"
    @input="update"
    @click="onClick"
    @blur="onBlur"
  />
</template>

<script>
import marked from 'marked'

const renderer = new marked.Renderer()
const linkRenderer = renderer.link
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text)
  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
}

export default {
  props: {
    content: String,
    tag: {
      type: String,
      default: 'span'
    },
    placeholder: {
      type: String,
      default: ''
    },
    focus: {
      type: Boolean,
      default: false
    },
    closeOnBreak: {
      type: Boolean,
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasFocus: false,
      contenteditable: false,
      marked: marked(this.content || '', { renderer })
    }
  },
  mounted() {
    this.updateInnerText()
    if (this.focus) {
      this.$refs.elm.focus()
    }
  },
  computed: {
    allowSpellcheck() {
      return this.spellcheck && this.hasFocus
    },
    hasContent() {
      return this.content && this.content !== '' && this.content !== '\n'
    }
  },
  watch: {
    content(val) {
      this.marked = marked(val || '', { renderer })
      if (val !== this.$el.innerText) {
        this.$el.innerText = this.content
      }
    }
  },
  methods: {
    updateInnerText() {
      if (this.hasContent || this.hasFocus) {
        if (!this.hasFocus) {
          this.$el.innerHTML = this.marked
        } else {
          this.$el.innerText = this.content || ''
        }
      } else {
        this.$el.innerText = this.placeholder
      }
    },
    update(event) {
      this.$emit('update', event.target.innerText, event)
    },
    onClick(event) {
      if (this.hasFocus) {
        return
      }
      this.hasFocus = true
      this.updateInnerText()
      this.$nextTick(() => {
        this.$refs.elm.focus()
      })
    },
    onBlur(event) {
      this.hasFocus = false
      this.updateInnerText()
      this.$emit('blur')
    }
  }
}
</script>

<style scoped>
.placeholder {
  font-style: italic;
}
</style>