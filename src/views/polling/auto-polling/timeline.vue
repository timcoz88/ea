<template>
  <li class="el-timeline-item">
    <div class="el-timeline-item__tail"/>

    <div
      v-if="!$slots.dot"
      :class="[
        `el-timeline-item__node--${size || ''}`,
        `el-timeline-item__node--${type || 'primary'}`
      ]"
      :style="{
        backgroundColor: color
      }"
      class="el-timeline-item__node"
    >
      <i
        v-if="icon"
        :class="icon"
        class="el-timeline-item__icon"
      />
    </div>
    <div v-if="$slots.dot" class="el-timeline-item__dot">
      <slot name="dot"/>
    </div>

    <div class="el-timeline-item__wrapper">
      <div
        v-if="!hideTimestamp && placement === 'top'"
        class="el-timeline-item__timestamp is-top">
        {{ timestamp }}
      </div>

      <div class="el-timeline-item__content">
        <slot/>
      </div>

      <div
        v-if="!hideTimestamp && placement === 'bottom'"
        class="el-timeline-item__timestamp is-bottom">
        {{ timestamp }}
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ElTimelineItem',
  props: {
    timestamp: {
      type: String,
      default: ''
    },

    hideTimestamp: {
      type: Boolean,
      default: false
    },

    placement: {
      type: String,
      default: 'bottom'
    },

    type: {
      type: String,
      default: ''
    },

    color: {
      type: String,
      default: ''
    },

    size: {
      type: String,
      default: 'normal'
    },

    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

  .el-timeline-item {
    position: relative;
    padding-bottom: 20px
  }

  .el-timeline-item__wrapper {
    position: relative;
    padding-left: 28px;
    top: -3px
  }

  .el-timeline-item__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid #E4E7ED
  }

  .el-timeline-item__icon {
    color: #FFF;
    font-size: 13px
  }

  .el-timeline-item__node {
    position: absolute;
    background-color: #E4E7ED;
    border-radius: 50%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
  }

  .el-timeline-item__node--normal {
    left: -1px;
    width: 12px;
    height: 12px
  }

  .el-timeline-item__node--large {
    left: -2px;
    width: 14px;
    height: 14px
  }

  .el-timeline-item__node--primary {
    background-color: #409EFF
  }

  .el-timeline-item__node--success {
    background-color: #67C23A
  }

  .el-timeline-item__node--warning {
    background-color: #E6A23C
  }

  .el-timeline-item__node--danger {
    background-color: #F56C6C
  }

  .el-timeline-item__node--info {
    background-color: #909399
  }

  .el-timeline-item__dot {
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
  }

  .el-timeline-item__content {
    color: #303133
  }

  .el-timeline-item__timestamp {
    color: #909399;
    line-height: 1;
    font-size: 13px
  }

  .el-timeline-item__timestamp.is-top {
    margin-bottom: 8px;
    padding-top: 4px
  }

  .el-timeline-item__timestamp.is-bottom {
    margin-top: 8px
  }
</style>
