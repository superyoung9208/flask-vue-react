<template>
    <div class="container">
        <div class="row">
            <a-modal
            title="新增用户"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
            >
            <a-form :form="userForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="名字" :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
                <a-input
                    v-decorator="[
                    'name',
                    ]"
                    placeholder="名字"
                >
                    <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                </a-input>
                </a-form-item>
                <a-form-item label="年龄" :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
                <a-input
                    v-decorator="[
                    'age',]"
                    placeholder="年龄"
                >
                    <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                </a-input>
                </a-form-item>
                <a-form-item label="地址" :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
                <a-input
                    v-decorator="[
                    'address',]"
                    placeholder="地址"
                >
                    <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                </a-input>
                </a-form-item>
            </a-form>
            </a-modal>
            <a-modal
            title="新增节点"
            :visible="treeNodeVisible"
            @ok="handleAddNodeOk"
            @cancel="handleAddNodeCancel"
            >
            <a-form :form="addNodeForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="标题" :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
                <a-input
                    v-decorator="[
                    'title',
                    ]"
                    placeholder="标题"
                >
                    <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                </a-input>
                </a-form-item>
            </a-form>
            </a-modal>
            <div class="col-lg-3">
                <a-card>
                    <a-tree :tree-data="treeData" :expandedKeys.sync="expandedKeys">
                        <!-- <template #title="{ key: treeKey, title, id, parentId, children }"> -->
                        <template #title="{ title, key: treeKey }">
                          <span>{{ title }}</span>
                          <span v-if="treeKey.split('-').length <= 3" style="{marginLeft: 12px}"><a-icon type="plus-circle"/></span>
                        <!-- <a-dropdown v-if="treeKey.split('-').length > 3" :trigger="['contextmenu']">
                            <span>{{ title }}</span>
                            <template #overlay>
                            <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey, id, parentId)">
                                <a-menu-item key="2">删除</a-menu-item>
                            </a-menu>
                            </template>
                        </a-dropdown> -->
                        <!-- <a-dropdown v-else-if="treeKey.split('-').length <= 3" :trigger="['contextmenu']">
                          <span>{{ title }}</span>
                          <template #overlay>
                          <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey, id, parentId)">
                              <a-menu-item key="1">新增</a-menu-item>
                              <a-menu-item key="2" v-if="children === null">删除</a-menu-item>
                          </a-menu>
                          </template>
                        </a-dropdown> -->
                        </template>
                    </a-tree>
                </a-card>
            </div>
            <div class="col-lg-9">
                <a-space direction="vertical">
                <a-card>
                    <a-form layout="inline" :form="form" @submit="handleSubmit">
                        <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
                        <a-input
                            v-decorator="[
                            'name',
                            ]"
                            placeholder="名字"
                        >
                            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                        </a-form-item>
                        <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
                        <a-input
                            v-decorator="[
                            'age',]"
                            placeholder="年龄"
                        >
                            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                        </a-form-item>
                        <a-form-item>
                        <a-space>
                          <a-button type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError()) || !hasPerm('query')">
                              查询
                          </a-button>
                          <a-button type="primary" @click="reset">
                              重置
                          </a-button>
                        </a-space>
                        </a-form-item>
                    </a-form>
                </a-card>
                <a-card>
                    <a-space direction="vertical">
                    <div>
                        <a-button :disabled="!hasPerm('add')" type="primary" @click="showModal">新增用户</a-button>
                    </div>
                    <a-table :columns="columns" :data-source="data">
                        <a slot="name" slot-scope="text">{{ text }}</a>
                        <template slot="operation" slot-scope="text, record">
                          <a-popconfirm
                            v-if="data.length"
                            title="确认删除?"
                            @confirm="() => onDelete(record.key)"
                          >
                            <a :disabled="!hasPerm('delete')" href="javascript:;">删除</a>
                          </a-popconfirm>
                        </template>
                    </a-table>
                    </a-space>
                </a-card>
                </a-space>
            </div>
        </div>

    </div>
</template>

<script>

const treeData = [
  {
    id: 1,
    title: '华夏集团',
    key: '0-0',
    parentId: 0,
    children: [
      {
        parentId: 1,
        id: 2,
        title: '华夏北京分公司',
        key: '0-0-0',
        children: [
          { id: 4, title: '研发部', key: '0-0-0-0', parentId: 2 },
          { id: 5, title: '企业部', key: '0-0-0-1', parentId: 2 }
        ]
      },
      {
        id: 3,
        parentId: 1,
        title: '华夏成都分公司',
        key: '0-0-1',
        children: [
          { id: 6, title: '市场部', key: '0-0-1-0', parentId: 3 },
          { id: 7, title: '财务部', key: '0-0-1-1', parentId: 3 }
        ]
      }
    ]
  }
]

const columns = [
  {
    title: '名字',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
    // width: 80
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const data = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '长安街'
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '王府井'
  },
  {
    key: '3',
    name: '王二',
    age: 32,
    address: '地安门'
  }
]

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

export default {
  name: 'Demo', // this is the name of the component
  data() {
    return {
      currentUserPermission: [],
      treeData,
      expandedKeys: ['0-0-0', '0-0-1'],
      currentTreeKey: null,
      currentId: null,
      hasErrors,
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
      userForm: this.$form.createForm(this, { name: 'add_user' }),
      addNodeForm: this.$form.createForm(this, { name: 'add_node' }),
      data,
      columns,
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      treeNodeVisible: false
    }
  },
  created() {
    // this.getUserPermission()
    // const ciphertest = this.$cryptoJs.AES.encrypt('add,edit', 'thisIsSecretKey').toString()
    // console.log(ciphertest)
    // const bytes = this.$cryptoJs.AES.decrypt(ciphertest, 'thisIsSecretKey')
    // const originalText = bytes.toString(this.$cryptoJs.enc.Utf8)
    // console.log(ciphertest)
    // console.log(originalText)
  },
  mounted() {
    // console.log('demo')
    window.addEventListener('message', function(e) {
      if (e.data.params) {
        console.log(e.data.params)
      }
    }, false)
  },
  methods: {

    /**
     * 是否有权限
     *
     * @permType 权限类型
    */
    hasPerm(permType) {
      return this.currentUserPermission.indexOf(permType) > -1
    },

    async getUserPermission() {
      const { name } = this.$router.history.current
      // console.log(this.$router)
      const path = `/users/permissions/?moduleName=${name}`
      const { data, status } = await this.$axios.get(path)
      // console.log(resp)
      if (status === 200 && Array.isArray(data)) {
        this.currentUserPermission = data
      }
    },

    // Only show error after a field is touched.
    userNameError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('userName') && getFieldError('userName')
    },
    // Only show error after a field is touched.
    passwordError() {
      const { getFieldError, isFieldTouched } = this.form
      return isFieldTouched('password') && getFieldError('password')
    },
    reset() {
      // this.$form.resetFields(['name', 'age'])
      this.form.resetFields()
      this.data = data
      this.treeData = treeData
    },
    getItemById(itemArray, id) {
      // console.log(2222)
      let target = null
      let targetIndex = -1
      const findFn = (arr, key) => {
        if (arr && key) {
          arr.some((item, index) => {
            if (item.id === key) {
              target = item
              targetIndex = index
              return true
            }
            findFn(item.children, key)
            return false
          })
        }
      }
      findFn(itemArray, id)
      return [target, targetIndex]
    },
    onContextMenuClick(treeKey, menuKey, id, parentId) {
      this.currentTreeKey = treeKey
      this.currentId = id
      switch (menuKey) {
        case '1':
          this.showAddNodeModal()
          break
        case '2':
          // console.log(2)
          this.$confirm({
            title: '确认删除此节点？',
            content: 'Some descriptions',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
              if (parentId && parentId !== 0) {
                const [parent] = this.getItemById(this.treeData, parentId)
                console.log(parent)
                const [, targetIndex] = this.getItemById(parent.children, id)
                parent.children.splice(targetIndex, 1)
                if (parent.children.length === 0) {
                  parent.children = null
                }
              } else {
                this.treeData = this.treeData.filter(({ id: deleteId }) => {
                  return id !== deleteId
                })
              }
            },
            onCancel() {
              console.log('Cancel')
            }
          })
          break
        default:
          console.log(menuKey)
      }
      console.log(treeKey, menuKey)
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const { name: queryName, age: queryAge } = values
          if (!!queryName && !!queryAge) {
            this.data = data
            return
          }
          let currentData = [...this.data]
          if (queryName && typeof queryName === 'string') {
            currentData = currentData.filter(({ name }) => {
              return name.includes(queryName)
            })
          }
          if (queryAge && typeof queryAge === 'string') {
            currentData = currentData.filter(({ age }) => {
              return +queryAge === age
            })
          }
          this.data = currentData
        }
      })
    },
    handleOk(e) {
      this.ModalText = 'The modal will be closed after two seconds'
      this.confirmLoading = true
      this.userForm.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const currentKey = this.data.length + 1
          this.data = [...this.data, { key: currentKey, ...values }]
        }
      })
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleAddNodeOk() {
      this.addNodeForm.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          const [target] = this.getItemById(this.treeData, this.currentId)
          if (target.children !== null) {
            const id = new Date().getTime()
            const key = `${this.currentTreeKey}-${target.children.length}`
            target.children = [...target.children, { ...values, id, key, parentId: target?.id }]
          } else {
            const id = new Date().getTime()
            const key = `${this.currentTreeKey}-0`
            target.children = [{ ...values, id, key, parentId: target?.id }]
          }
          this.handleAddNodeCancel()
          // console.log('Received values of form: ', values)
          // const currentKey = this.data.length + 1
          // this.data = [...this.data, { key: currentKey, ...values }]
        }
      })
    },
    showModal() {
      this.visible = true
    },
    showAddNodeModal() {
      this.treeNodeVisible = true
    },
    handleAddNodeCancel() {
      this.treeNodeVisible = false
    },
    handleCancel(e) {
      console.log('Clicked cancel button')
      this.userForm.resetFields()
      this.visible = false
    },
    onDelete(key) {
      const data = [...this.data]
      this.data = data.filter(item => item.key !== key)
    }
  }
}
</script>
<style scoped>
  .anticon-plus-circle {
    vertical-align: 0;
    margin-left: 0.5rem;
    color: green;
  }
</style>
