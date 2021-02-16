/* global Vue */

const eventBus = new Vue()

Vue.component('tags-list', {
  template: `
    <div class="tag-list">
      <div class="tag-list__selected-tag">
        <span v-if="tag.tag" @click="clearSelectedTag()">{{ tag.tag }}</span>

        <span v-else>- no tag selected -</span>
      </div>
      <ul>
        <li class="tag" v-for="tag of tags" @click="selectTag(tag)">{{tag.tag }}</li>
      </ul>
    </div>
  `,
  data () {
    return {
      tags: [],
      tag: {},
    }
  },

  methods: {
    selectTag (tag) {
      eventBus.$emit('tag-selected', tag)
      this.setTag(tag)
    },

    clearSelectedTag () {
      eventBus.$emit('tag-selected', {})
      this.setTag()
    },

    setTag (tag = {}) {
      this.tag = tag
    },
  },

  async mounted () {
    const setTag = this.setTag

    const { data } = await fetch('/tags')
      .then((response) => response.json())

    eventBus.$on('tag-selected', (tag) => setTag(tag))

    this.tags = data.tags
      .sort((a, b) => ('' + a.tag).localeCompare(b.tag))
  },
})

Vue.component('file-list', {
  template: `
    <div class="file-list">
      <div class="file-list__selected-file">
        <span v-if="file.name" @click="clearSelectedFile()">{{ file.name }}</span>

        <span v-else>- no file selected -</span>
      </div>

      <ul>
        <li class="file-list__file" v-for="file of files" @click="selectFile(file)">{{ file.name }}</li>
      </ul>
    </div>
  `,
  data () {
    return {
      files: [],
      file: {},
      tagName: '',
    }
  },

  methods: {
    selectFile (file) {
      eventBus.$emit('file-selected', file)
      this.file = file
    },

    clearSelectedFile () {
      eventBus.$emit('file-selected', {})
      this.file = {}
    },

    async listFiles (tagName = '') {
      const x = this.tagName
      const params = (tagName) ? `/tagged/${tagName}` : x

      const { data } = await fetch(`/files${params}`)
        .then((response) => response.json())

      this.tagName = (tagName) || x
      this.files = data.files
        .sort((a, b) => ('' + a.name).localeCompare(b.name))
    },
  },

  mounted () {
    const listFiles = this.listFiles

    eventBus.$on('tag-selected', ({ tag }) => listFiles(tag))

    eventBus.$on('file-deleted', () => listFiles(''))

    listFiles()
  },
})

Vue.component('file-viewer', {
  template: `
    <div class="file-viewer">
      <div v-if="file.id">

        <video :src="stream" controls></video>

        <div>{{ file.name }}</div>

        <ul class="file-viewer__tag-list">
          <li class="file-viewer__tag" v-for="tag of file.tags" @click="selectTag(tag)">{{ tag.tag }}</li>
        </ul>

        <button @click="remove(file)">Delete</button>
      </div>
    </div>
  `,
  data () {
    return {
      file: {},
    }
  },

  computed: {
    stream () {
      return `/files/${this.file.id}/stream`
    },
  },

  methods: {
    async getFile (file) {
      this.file = {}

      const { data } = await fetch(`/files/${file.id}`)
        .then((response) => response.json())

      this.file = data.file
    },

    async remove (file) {
      if (!file.id) return

      const { data } = await fetch(`/files/${file.id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())

      if (!data.success) return

      eventBus.$emit('file-deleted')
    },

    selectTag (tag) {
      eventBus.$emit('tag-selected', tag)
      this.tag = tag
    },
  },

  mounted () {
    const getFile = this.getFile

    eventBus.$on('file-selected', (file) => {
      getFile(file)
    })
  },
})

// eslint-disable-next-line
new Vue({
  el: '#app',
  template: `
    <div id="app-container">
      <div class="frame-wrapper">
        <tags-list />
        <file-list />
        <file-viewer />
      </div>
    </div>
  `,
})
