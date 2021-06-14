<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理 </el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索与添加 -->
        <div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input
                placeholder="请输入内容"
                v-model="queryInfo.query"
                clearable
                @clear="queryOrders"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="queryOrders"
                ></el-button>
              </el-input>

            </el-col>
          </el-row>
        </div>

        <!-- 表格 -->
        <el-table
          :data="ordersList"
          stripe
          border
          :row-style="{lineHeight: '80px'}"
        >
          <el-table-column
            type="index"
            label="#"
          >
          </el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号"
          >
          </el-table-column>
          <el-table-column
            prop="order_price"
            label="订单价格"
          >
          </el-table-column>
          <el-table-column
            prop="pay_status"
            label="是否付款"
          >
            <!-- 使用组件插槽 -->
            <template v-slot="state">
              <el-tag v-if="state.row.pay_status === '1'">已付款</el-tag>
              <el-tag
                v-else
                type="danger"
              >未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_send"
            label="是否发货"
          >
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="下单时间"
          >
            <template v-slot="state">
              {{state.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="operation">
              <el-tooltip
                class="item"
                effect="dark"
                content="修改订单地址"
                placement="top"
              >
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEdit(operation.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="物流信息"
                placement="top"
              >
                <el-button
                  type="warning"
                  icon="el-icon-location-outline"
                  size="mini"
                  @click="queryLogistics(operation.row)"
                ></el-button>
              </el-tooltip>

            </template>

          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址 -->
      <el-dialog
        title="添加商品分类"
        :visible.sync="editAddressDialog"
        :hide-required-asterisk="false"
        width="50%"
        @close="closeEditAddressDialog"
      >
        <el-form
          ref="editAddressFormRef"
          :model="editAddressForm"
          :rules="editAddressFormRules"
          label-width="100px"
        >
          <el-form-item label="省市区/县：">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <el-cascader
              v-model="editAddressForm.address1"
              :options="cityData"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址："
            prop="address2"
          >
            <el-input v-model="editAddressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="closeEditAddressDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="submitAddres"
          >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 查询物流信息 -->
      <el-dialog
        title="物流进度"
        :visible.sync="queryLogisticsDialog"
        :hide-required-asterisk="false"
        width="50%"
        @close="closeQueryLogisticsDialog"
      >
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import cityData from './cityData.js'
export default {
  data () {
    return {
      ordersList: [],
      total: 0,
      cityData,
      // 获取列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10 // 当前每页显示多少数据
      },
      editAddressDialog: false,
      editAddressForm: {
        address1: [],
        address2: ''
      },
      editAddressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      // 查询物流信息
      queryLogisticsDialog: false,
      reverse: false,
      activities: [{
        content: '已签收,签收人是（快递已送代理点如有问题请联系11053685196）先生/女士，如有疑问请联系派件员寒亭魏飞飞(11053685196、0530-18194261)，如您未收到此快递，请拨打投诉电话：0530--17366376，感谢使用申通快递，期待再次为您服务',
        timestamp: '2020-07-15 12:39:56'
      }, {
        content: '山东潍坊寒亭营业厅-寒亭魏飞飞(11053685196,0530-18194261)-派件中',
        timestamp: '2020-07-15 08:38:57'
      }, {
        content: '已到达-山东潍坊寒亭营业厅',
        timestamp: '2020-07-15 06:38:13'
      }, {
        content: '山东潍坊转运中心-已发往-山东潍坊寒亭公司',
        timestamp: '2020-07-14 20:56:45'
      }, {
        content: '已到达-山东潍坊转运中心',
        timestamp: '2020-07-14 20:52:44'
      }, {
        content: '已到达-山东潍坊转运中心',
        timestamp: '2020-07-14 17:43:48'
      }, {
        content: '山东临沂转运中心-已发往-山东潍坊转运中心',
        timestamp: '2020-07-14 10:53:46'
      }, {
        content: '已到达-山东临沂转运中心',
        timestamp: '2020-07-14 10:43:31'
      }, {
        content: '安徽合肥转运中心-已发往-山东临沂转运中心',
        timestamp: '2020-07-14 02:43:20'
      }, {
        content: '已到达-安徽合肥转运中心',
        timestamp: '2020-07-14 02:41:40'
      }, {
        content: '安徽阜阳转运中心-已发往-安徽合肥转运中心',
        timestamp: '2020-07-13 15:03:30'
      }, {
        content: '安徽利辛公司-已发往-安徽阜阳转运中心',
        timestamp: '2020-07-13 14:47:56'
      }, {
        content: '安徽利辛公司-城南吴彦祖-已收件',
        timestamp: '2020-07-13 14:37:06'
      }]
    }
  },
  methods: {
    // 获取订单列表
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 查询商品
    async queryOrders () {
      this.$message.error('错误：后端并未给予查询方法')
      // const { data: res } = await this.$http.get('orders', {
      //   params: this.queryInfo
      // })
      // console.log(this.queryInfo.query)
      // if (res.meta.status !== 200) return this.$message.error('数据获取失败：' + res.meta.msg)
      // if (res.data.total === 0) {
      //   return this.$message.error('未查询到该产品')
      // }
      // this.total = res.data.total
      // this.ordersList = res.data.goods
      // this.getOrdersList()
    },
    handleSizeChange (newSize) {
      // 监听最新的 pageSize 的改变
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange (newPage) {
      // 监听 页码值 的改变
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 监听 switch 状态
    async userStateChanged (userInfo) {
      const { data: res } = await this.$http.put('users/' + userInfo.id + '/state/' + userInfo.mg_state + '')
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新状态失败：Error ' + res.meta.msg)
      }
      this.$message.success('更新状态成功')
    },
    setRoleDialogClosed () {
      // 监听用户权限对话框的关闭事件
      this.selectedRoleId = ''
      this.userInfo = {}
    },
    // 修改地址
    openEdit (uid) {
      this.editAddressDialog = true
      console.log(uid)
    },
    // 关闭修改地址面板
    closeEditAddressDialog () {
      this.editAddressDialog = false
    },
    // 添加商品分类
    submitAddres () {
      this.editAddressDialog = false
      this.$message.success('由于后端没有提供接口，所以默认添加成功')
      // this.$refs.editAddressFormRef.validate(async valid => {
      //   if (!valid) return this.$message.error('分类名称格式错误')
      //   const { data: res } = await this.$http.post(
      //     'categories',
      //     this.editAddressForm
      //   )
      //   console.log(res)
      //   if (res.meta.status !== 201) return this.$message.error('添加失败：' + res.meta.msg)
      //   this.$message.success('添加成功')
      //   this.getcateList()
      //   this.editAddressDialog = false
      //   // 分类父级id 默认
      //   this.editAddressForm.cat_pid = 0
      //   // 分类等级 默认
      //   this.editAddressForm.cat_level = 0
      // })
    },
    // 查询物流信息
    async queryLogistics () {
      this.$message.error('错误：后端提供的接口有误，您现在所查询的为静态数据')
      // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取物流进度失败！')
      // }
      // this.activities = res.data
      this.queryLogisticsDialog = true
    },
    // 关闭物流查询面板
    closeQueryLogisticsDialog () {
      console.log('关闭物流查询面板')
    }
  },
  created () {
    // 获取users列表
    this.getOrdersList()
  }
}
</script>
<style lang="less" scoped>
.box-card {
  width: 100%;
  height: 100%;
  min-width: 100%;
  margin-top: 20px;
  transition: all 0.5s;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;

  .text {
    font-size: 12px;
  }

  .el-row {
    margin-bottom: 20px;
    line-height: 0;
  }

  .el-pagination {
    margin-top: 15px;
    text-align: right;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>