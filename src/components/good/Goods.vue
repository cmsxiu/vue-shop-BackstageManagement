<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理 </el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div class="text item">
        <!-- 搜索与添加 -->
        <div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input
                placeholder="请输入商品名称"
                v-model="goodsQuery.query"
                clearable
                @clear="queryGoods"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="queryGoods"
                ></el-button>
              </el-input>

            </el-col>

            <el-col :span="3">
              <el-button
                type="primary"
                @click="openAddGoodsDialog"
              >添加商品</el-button>
            </el-col>
          </el-row>
        </div>

        <!-- 表格 -->
        <el-table
          :data="goodsList"
          stripe
          border
        >
          {{goodsList}}
          <el-table-column
            type="index"
            label="#"
          >
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
            width="500px"
          >
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格（元）"
          >
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量"
          >
          </el-table-column>
          <el-table-column
            prop="upd_time"
            label="创建时间"
          >

          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="operation">
              <el-tooltip
                class="item"
                effect="dark"
                content="修改商品"
                placement="top"
              >
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditGoods(operation.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除商品"
                placement="top"
              >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delGoods(operation.row.goods_id)"
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
        :current-page="goodsQuery.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="goodsQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      goodsList: [],
      goodsQuery: {
        query: '',
        pagenum: 1,
        pagesize: 10 // 当前每页显示多少数据
      },
      total: 0,
      addGoodsDialog: false
    }
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsQuery
      })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败：' + res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 查询商品
    async queryGoods () {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsQuery
      })
      if (res.meta.status !== 200) return this.$message.error('数据获取失败：' + res.meta.msg)

      if (res.data.total === 0) {
        return this.$message.error('未查询到该产品')
      }

      this.total = res.data.total
      this.goodsList = res.data.goods
      this.getGoodsList()
    },
    // 添加商品面板
    openAddGoodsDialog () {
    },
    // 关闭添加商品面板
    closeAddGoodsDialog () { },
    // 分页
    handleSizeChange (newSize) {
      // 监听最新的 pagesize 的变化
      this.goodsQuery.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      // 监听最新的页码值的变化
      this.goodsQuery.pagenum = newPage
      this.getGoodsList()
    },
    // 打开编辑面板
    openEditGoods () { },
    // 删除商品
    async delGoods (gid) {
      const confirmRes = await this.$confirm(
        '您确实要删除该商品吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmRes !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('goods/' + gid)
      if (res.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getGoodsList()
    }
  },
  mounted () {
    this.getGoodsList()
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
  .modifyPermissions {
    text-align: left;
  }
}
</style>