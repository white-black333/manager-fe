<script >
import { ElMessage } from 'element-plus';
import util from './../utils/util';
export default {
  name: 'Menu',
  data() {
    return {
      // 菜单列表
      menuList: [],
      // 查询的条件
      menuQuery: { menuState: 1 },
      // 弹出对话窗表单的数据
      createdMenu: { menuState: 1, menuType: 1, parentId: [null] },
      // 是否显示对话框
      dialogVisible: false,
      // 菜单表格字段
      menuColums: [
        { prop: 'menuName', label: '菜单名称', width: 180 },
        { prop: 'icon', label: '图标' },
        {
          prop: 'menuType', label: '菜单类型', formatter(row, column, value) {
            return { '1': "菜单", '2': '按钮' }[value];
          }
        },
        { prop: 'menuCode', label: '权限标识' },
        { prop: 'path', label: '路由地址' },
        { prop: 'component', label: '组件路径' },
        {
          prop: 'menuState', label: '菜单状态', formatter(row, column, value) {
            return { '1': "正常", '2': '停用' }[value];
          }
        },
        {
          prop: 'createTime', label: '创建时间', width: 110, formatter(row, column, value) {
            return util.dataFormater(value);
          }
        }
      ],
      // 表单验证规则
      rules: {
        menuName: [{ required: true, message: "请输入菜单名称", trigger: 'blur' },
        { max: 10, min: 2, message: "长度在2-8个字符之间", trigger: 'blur' }]
      },
      // 操作类别 add,edit,delete
      action: ''
    };
  },
  // 初始化
  mounted() {
    this.getMenuList();
  },
  methods: {
    // 获取菜单列表
    async getMenuList() {
      const res = await this.$api.getMenuList(this.menuQuery);
      if (res) {
        this.menuList = res;
      }
    },
    // 查询菜单列表
    handleQuery() {
      this.getMenuList();
    },
    // 重置表单
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
    // 创建/新增 菜单方法
    handleAdd(type, value) {
      this.dialogVisible = true;
      this.action = 'add';
      console.log('value._id=>', value._id);
      console.log('value.parentId=>', value.parentId);
      if (type == 2) {
        this.createdMenu.parentId = [...value.parentId, value._id].filter((item) =>
          item// 返回一个数组，其中只包括通过 item为True 的元素。 
        );
        console.log('this.createdMenu.parentId=>', this.createdMenu.parentId);
      }
    },
    // 编辑菜单方法
    handleEdit(value) {
      this.dialogVisible = true;
      this.action = 'edit';
      this.$nextTick(() => {
        Object.assign(this.createdMenu, value);
      });
    },
    // 删除菜单方法
    async handleDelete({ _id }) {
      await this.$api.submitMenu({ _id, action: 'delete' });
      ElMessage.success('删除成功');
      this.getMenuList();
    },
    // 点击x时重置表单
    closeDialog(formName) {
      this.$refs[formName].resetFields();
    },
    // 取消 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    // 确认 提交表单数据
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid, fileds) => {
        const { action, createdMenu } = this;
        const params = { action, ...createdMenu };
        if (valid) {
          const res = await this.$api.submitMenu(params);
          this.dialogVisible = false;
          this.$refs[formName].resetFields();
          ElMessage.success("更新成功");
          this.getMenuList();
        }
      });

    }
  }
};
</script>

<template>
  <div class="menu-wrapper">
    <div class="query-form">
      <el-form ref="formRef" :inline="true" :model="menuQuery" class="demo-form-inline">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuQuery.menuName" placeholder="请输入菜单名称" clearable />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="menuQuery.menuState" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset('formRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="select-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table ref="tableRef" :data="menuList" stripe style="width: 100%" row-key="_id"
        :tree-props="{ children: 'children' }">
        <el-table-column v-for="{ prop, label, formatter, width } in menuColums" :key="prop" :prop="prop" :label="label"
          :formatter="formatter" :width="width" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope"> <!-- 插槽 -->
            <el-button size="small" type="primary" @click="handleAdd(2, scope.row)">新增</el-button>
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="创建菜单" width="30%" @close="closeDialog('dialogForm')">
      <el-form ref="dialogForm" :model="createdMenu" label-width="100px" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader v-model="createdMenu.parentId" :options="menuList"
            :props="{ value: '_id', label: 'menuName', checkStrictly: true }" placeholder="请选择父级菜单" style="width: 50%"
            clearable />
          <span> 不选，直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="createdMenu.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="createdMenu.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="createdMenu.menuType == 1">
          <el-input v-model="createdMenu.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="createdMenu.menuType == 1">
          <el-input v-model="createdMenu.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="createdMenu.menuType == 2">
          <el-input v-model="createdMenu.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="组件地址" prop="component" v-show="createdMenu.menuType == 1">
          <el-input v-model="createdMenu.component" placeholder="请输入组件地址" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="createdMenu.menuType == 1">
          <el-radio-group v-model="createdMenu.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="resetForm('dialogForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('dialogForm')"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
// 表单公共样式
.query-form {
  background-color: #ffffff;
  padding: 22px 20px 0;
  border-radius: 5px;
}

.select-table {
  border-radius: 5px;
  background: #ffffff;
  margin-top: 20px;
  margin-bottom: 20px;

  .action {
    border-radius: 5px 5px 0px 0px;
    background: #ffffff;
    padding: 20px;
    border-bottom: 1px solid #ece8e8;
  }

  .pagination {
    text-align: right;
    padding: 10px;
  }
}
</style>