<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

     <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <!--<el-select v-model="selectProject" style="margin-top: 6px;" @change="selectProjectChange">
      <el-option v-for="item in projectList"
        :key="item.value"
        :label="item.label"
        :value="item.value"></el-option>
    </el-select>-->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--<search id="header-search" class="right-menu-item" />-->

<!--
        <error-log class="errLog-container right-menu-item hover-effect" />
-->
        <!--<svg-icon class-name="data-source-icon" icon-class="data-source" style="width: 26px;height: 48px;cursor: pointer;" @click="linkTo('svg')"/>
        <i class="el-icon-user-solid" style="width: 28px;font-size: 25px;height: 60px;vertical-align: middle;cursor: pointer;margin-left:10px;" @click="linkTo('i')"></i>-->
         <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

       <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
           <router-link to="/">
            <el-dropdown-item>工作台</el-dropdown-item>
          </router-link>
           <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { getOtherURL } from '@/api/home'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data(){
    return{
      projectList:[{
        label:'智能监控',
        value:'智能监控'
      },
      {
        label:'自动化运维',
        value:'自动化运维'
      },{
        label:'质量审核',
        value:'质量审核'
      }],
      selectProject:'智能监控',
      urlArr1:'',//用户管理
      urlArr2:'',//数据源管理
      urlArr3:'' //质量审核
    }
  },
  created(){
    if(this.$router.history.current.path.includes('auto-task')){
        this.selectProject = '自动化运维'
        this.$router.options.routes[1].hidden = false
        this.$router.options.routes[0].hidden = true
    }else if(this.$router.history.current.path.includes('overview')){
        this.selectProject='智能监控'
        this.$router.options.routes[1].hidden = true
        this.$router.options.routes[0].hidden = false
    }
  },
  mounted(){
    this.getURL()
  },
  methods: {
    getURL(){
      getOtherURL().then(({results:data}) => {
          data.results.forEach(ele => {
            if(ele.url_type == 1){
              this.urlArr1 = ele.url
            }else if(ele.url_type == 2){
              this.urlArr2 = ele.url
            }else if(ele.url_type == 4){
              this.urlArr3 = ele.url
            }
          });
      }).catch(err => this.$message.error(err.message))
    },
    linkTo(val){
      if(val == 'svg'){
        window.location.href = this.urlArr2
      }else if(val == 'i'){
        window.location.href = this.urlArr1
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    selectProjectChange(value){
      if(value == '质量审核'){
        location.href=this.urlArr3
      }else{
        this.$store.commit('SET_PROJECTVALUE',value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
