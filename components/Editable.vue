<template>
  <component
    v-bind:is="tag"
    contenteditable="true"
    ref="elm"
    :spellcheck="allowSpellcheck"
    :class="{ placeholder: !this.hasContent }"
    @input="update"
    @keydown="keydown"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script>
import { debounce } from 'lodash'

export default {
  props: {
    content: String,
    previewContent: String,
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
      hasFocus: false
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
  methods: {
    updateInnerText() {
      if (this.hasContent || this.hasFocus) {
        if (!this.hasFocus && this.previewContent) {
          this.$el.innerHTML = this.previewContent
        } else {
          this.$el.innerText = this.content || ''
        }
      } else {
        this.$el.innerText = this.placeholder
      }
    },
    update: debounce(
      function (event) {
        this.$emit('update', event.target.innerText, event)
      },
      300,
      { maxWait: 1000 }
    ),
    keydown(event) {
      if (event.keyCode === 13) {
        this.$emit('submit')
        if (this.closeOnBreak) {
          event.preventDefault()
          this.$refs.elm.blur()
        }
      }
    },
    onFocus(event) {
      // HACK: first wait if a link is clicked, if so the link will be followed
      // if not the following will trigger to show the markdown
      setTimeout(() => {
        this.hasFocus = true
        if (!this.hasContent || this.previewContent) {
          this.updateInnerText()
        }
        this.$emit('focus')
      }, 100)
    },
    onBlur(event) {
      this.hasFocus = false
      this.updateInnerText()
      this.$emit('blur')
    }
  },
  watch: {
    content(val) {
      if (val !== this.$el.innerText) {
        this.$el.innerText = this.content
      }
    }
  }
}
</script>

<style scoped>
.placeholder {
  font-style: italic;
}
</style>
