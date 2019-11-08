<template>
  <el-card style="margin: 20px">
    <el-button type="primary" @click="download">下载</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="key"
        label="key"
        width="150"
      />
      <el-table-column
        prop="value"
        label="value"
      >
        <template slot-scope="scope"><div v-html="scope.row.value">{{ scope.row.value|valueFilter }}</div></template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  filters: {
    valueFilter(json) {
      if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2)
      }
      json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    const that = this
    const obj = this.$route.params.name.response
    Object.keys(obj).forEach(function(key) {
      const arr = { 'key': key, 'value': obj[key] }
      that.tableData.push(arr)
    })
  },
  methods: {
    download() {

    }
  }
}
</script>

<style scope>

</style>
