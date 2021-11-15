<template>
  <component
    :is="tag"
    :contenteditable="hasFocus"
    :spellcheck="allowSpellcheck"
    :class="{ placeholder: !hasInnerText && placeholder }"
    @input="
      updateHasInnerText($event)
      update($event)
    "
    @click="onClick"
    @blur="onBlur"
  />
</template>

<script>
import marked from 'marked'
import { debounce } from 'lodash'

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
      hasInnerText: !this.isEmptyString(this.content),
      contenteditable: false,
      marked: marked(this.content || '', { renderer })
    }
  },
  computed: {
    allowSpellcheck() {
      return this.spellcheck && this.hasFocus
    },
    hasContent() {
      return !this.isEmptyString(this.content)
    }
  },
  watch: {
    content(val) {
      this.marked = marked(val || '', { renderer })
      if (val !== this.$el.innerText) {
        this.$el.innerText = this.content
        this.hasInnerText = !this.isEmptyString(this.content)
      }
    }
  },
  mounted() {
    this.updateInnerText()
    if (this.focus) {
      this.$el.focus()
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
    updateHasInnerText(event) {
      this.hasInnerText = !this.isEmptyString(event.target.innerText)
    },
    update: debounce(
      function(event) {
        this.$emit('update', event.target.innerText, event)
      },
      300,
      { maxWait: 1000 }
    ),
    isEmptyString(value) {
      return (
        !value ||
        value === '' ||
        value === '\n' ||
        value === ' ' ||
        value === this.placeholder
      )
    },
    onClick(event) {
      if (this.hasFocus) {
        return
      }
      this.hasFocus = true
      this.updateInnerText()
      this.$nextTick(() => {
        this.$el.focus()
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
