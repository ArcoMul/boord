<template>
  <component
    :is="tag"
    contenteditable="true"
    :spellcheck="allowSpellcheck"
    :class="{ placeholder: !hasInnerText && placeholder }"
    @input="
      updateHasInnerText($event)
      update($event)
    "
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
      hasFocus: false,
      hasInnerText: !this.isEmptyString(this.content)
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
        if (!this.hasFocus && this.previewContent) {
          this.$el.innerHTML = this.previewContent
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
    keydown(event) {
      this.hasTyped = true
      if (event.keyCode === 13) {
        this.$emit('update', this.$el.innerText)
        this.$emit('submit')
        if (this.closeOnBreak) {
          event.preventDefault()
          this.$el.blur()
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
      this.$emit('update', this.$el.innerText)
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
