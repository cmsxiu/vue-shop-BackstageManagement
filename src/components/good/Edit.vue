<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理 </el-breadcrumb-item>
      <el-breadcrumb-item>修改商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-alert
        title="修改商品信息"
        type="info"
        show-icon
        center
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :active="+active"
        finish-status="success"
        align-center
        style="font-size: 12px"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs侧边导航栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="active"
          :before-leave="beforeTabLeave"
          @tab-click="activeTabs"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类："
              prop="goods_cat"
            >
              <el-cascader
                v-model="addForm.goods_cat"
                :options="parentCateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              v-for="item in tabManyData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group
                v-model="item.attr_vals"
                size="mini"
              >
                <el-checkbox
                  border
                  :label="item"
                  v-for="(item, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              v-for="item in tabOnlyData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture-card"
              :headers="setHeader"
            >
              <i
                slot="default"
                class="el-icon-plus"
              ></i>
              <div
                slot="tip"
                class="el-upload__tip"
              >只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-dialog :visible.sync="bigUploadImg">
              <img
                width="100%"
                :src="dialogImageUrl"
                alt=""
              >
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button
              type="primary"
              class="addGoods"
              @click="addGoods"
            >修改商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: false,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      tabManyData: [],
      tabOnlyData: [],
      active: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        // 图片的数据
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 50, message: '商品名称字数在 1 - 50位', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { type: 'number', message: '商品数量必须是大于0的整数' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 图片上传URL
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      bigUploadImg: false,
      dialogImageUrl: '',
      disabled: false,
      setHeader: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  methods: {
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.parentCateList = res.data
    },
    // 选择商品分类
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return this.$message.error('请选择三级分类')
      }
    },
    // 切换事件
    beforeTabLeave (current, before) {
      if (before === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 切换tabs
    async activeTabs () {
      if (this.active === '1') {
        const { data: res } = await this.$http.get('categories/' + this.addForm.goods_cat[2] + '/attributes',
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.tabManyData = res.data
      } else if (this.active === '2') {
        const { data: res } = await this.$http.get('categories/' + this.addForm.goods_cat[2] + '/attributes',
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.tabOnlyData = res.data
      }
    },
    // 移出图片
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 上传图片成功后的处理
    handleSuccess (res) {
      if (res.meta.status !== 200) this.$message.error('上传失败')
      this.$message.success('上传成功')
      const picInfo = {
        pic: res.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 预览图片
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.bigUploadImg = true
    },
    addGoods () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写所有必填项')
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理静态属性
        this.tabOnlyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理动态参数
        this.tabManyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        // 发起数据请求
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.put('goods/' + this.$route.query.goodsId, form)
        // if (res.meta.status !== 201) {
        //   return this.$message.error('修改商品失败！')
        // }
        console.log(res)
        this.$message.success('修改商品成功！')
        this.$router.push('/goods')
      })
    },
    async getGoodsData () {
      const { data: res } = await this.$http.get('goods/' + this.$route.query.goodsId)
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败：' + res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      res.data.goods_cat = res.data.goods_cat.split(',')
      res.data.goods_cat.forEach((item, i) => {
        res.data.goods_cat[i] = +item
      })
      this.addForm = res.data
    }
  },
  mounted () {
    this.getParentCateList()
    this.getGoodsData()
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length !== 3) {
        return this.addForm.goods_cat[2]
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.box-card,
.el-steps,
.addGoods,
.el-tabs {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>