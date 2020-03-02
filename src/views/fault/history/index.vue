<template>
  <el-card style="margin: 20px" class="history-page dark">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
              v-model.trim="filter.searchVal"
              type="text"
              class="filter-input"
              placeholder="请输入搜索内容"
              @keyup.enter.native="handleSearch"
          >
            <el-select
                slot="prepend"
                v-model="filter.searchType"
                class="filter-select"
                style="width: 160px;"
                placeholder="请选择查询类型">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
            </el-select>
          </el-input>
        </el-col>
        <!--<el-col :span="4">
          <el-input
            v-model.trim="filter.hostnm"
            type="text"
            class="filter-input mr-10"
            placeholder="主机名"
          />
        </el-col>-->
        <el-col :span="4">
          <el-select
              v-model="filter.categoryId"
              class="filter-select"
              placeholder="主机类型"
          >
            <el-option
                v-for="(item,key) in typeList"
                :key="key"
                :label="item"
                :value="key"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
              v-model="filter.dbtype"
              class="filter-select"
              placeholder="数据库类型"
          >
            <el-option
                v-for="(item,key) in typeList"
                :key="key"
                :label="item"
                :value="key"
            />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button
              type="primary"
              @click="handleSearch"
          >
            搜索
          </el-button>
          <el-button
              type="dark"
              @click="handleClear">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-content">
      <div class="table-box">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="序号"
            width="50"
          />
          <el-table-column
            label="级别"
            width="70"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.msglvl | msgType">{{ scope.row.msglvl }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="dsn"
            label="数据库"
            width="80"
          />
          <el-table-column
            prop="hostip"
            label="主机地址"
            width="80"
          />
          <el-table-column
            prop="msgdata"
            label="事件"
          />
          <el-table-column
            prop="msgtm"
            label="预警时间"
            width="160"
          >
            <template slot-scope="{row}">
              {{ row.msgtm | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="msgstat"
            label="状态"
            width="100"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.msgstat | msgstat }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="optm"
            label="处理时间"
            width="100"
          >
            <template slot-scope="{row}">
              {{ row.optm | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="opresult"
            label="处理结果"
            width="100"
          />
          <el-table-column
            prop="opuser"
            label="处理人"
            width="100"
          />
        </el-table>
      </div>
      <div class="page-box">
        <pagination
          v-if="total > 0"
          :current-page="page"
          :total="total"
          @page="handlePage"
        />
      </div>
    </div>
  </el-card>
</template>

<script>
import repo from '@/services/modules/fault'
import Pagination from '@/components/Pagination'

/* const statusMap = {
  0: 'NEW',
  1: '待处理',
  2: '已处理',
  3: '忽略'
}*/

export default {
  components: {
    Pagination
  },

  filters: {
    msgType(msg) {
      if (msg === '紧急') {
        return 'danger'
      }
      if (msg === '重要' || msg === '严重') {
        return 'warning'
      }
      return ''
    },
    msgstat(val) {
      const list = [
        'NEW', '已确认', '已处理', '忽略'
      ]
      return list[val]
    }
  },

  data() {
    return {
      filter: {
        searchType: 'hostip'
      },
      typeList: [],
      tableLoading: false,
      page: 1,
      total: 0,
      tableData: [],
      options: [
        {
          value: 'hostip',
          label: '主机ip'
        }, {
          value: 'dsn',
          label: '数据库名'
        }]
    }
  },

  created() {
    this.handleList(this.getFilter())
  },

  methods: {
    handleSearch() {
      this.handleList(this.getFilter())
    },
    handleClear() {
      this.filter = {}
      this.handleList(this.getFilter())
    },
    getFilter() {
      return Object.assign({}, {
        page: this.page,
        [this.filter.searchType]: this.filter.searchVal,
        categoryId: this.filter.categoryId,
        dbtype: this.filter.dbtype
      })
    },
    handlePage(page) {
      this.page = page
      this.handleList(this.getFilter())
    },
    handleList(filter = {}) {
      this.tableLoading = true
      repo.getHistory(filter)
        .then(({ results: data }) => {
          this.tableData = data.results
          this.total = data.totalCount
        }, Function.prototype).then(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>
<style lang="sass" scoped>
.history-page

  .filter-box
    display: flex
    align-items: center

  .table-content

    .table-header

      .title
        margin: 38px 0 20px 0
        line-heght: 24px

      .choice-btn
        border: 1px solid #DCDFE6
        width: 120px
        height: 36px
        line-heght: 36px
        margin-bottom: 11.5px
        display: flex
        align-items: center
        border-radius: 5px

        .btn
          padding: 0 15px
          height: 19px
          font-size: 14px
          color: #5E6166

        .btn-all
          border-right: 1px solid #DCDFE6

    .table-box

      .btn
</style>
