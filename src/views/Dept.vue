<script >
import { ElMessage } from 'element-plus';
import util from './../utils/util';
export default {
  name: 'Dept',
  data() {
    return {
      // 部门列表
      deptList: [],
      // 查询的条件
      deptQuery: {},
      // 弹出对话窗表单的数据
      createdDept: { parentId: [null] },
      // 是否显示对话框
      dialogVisible: false,
      // 部门表格字段
      deptColums: [
        { prop: 'deptName', label: '部门名称' },
        { prop: 'userName', label: '负责人' },
        {
          prop: 'updateTime', label: '更新时间', width: 110, formatter(row, column, value) {
            return util.dataFormater(value);
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
        parentId: [{ required: true, message: "请选择上级部门", trigger: 'blur' }],
        deptName: [{ required: true, message: "请输入部门名称", trigger: 'blur' }],
        user: [{
          required: true, message: "请选择负责人", trigger: 'blur'
        }]
      },
      action: '',
      userList: []
    };
  },
  // 初始化
  mounted() {
    this.getDeptList();
    this.getUserList();
  },
  methods: {
    // 获取部门列表
    async getDeptList() {
      try {
        const res = await this.$api.getDeptList(this.deptQuery);
        this.deptList = res;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 获取所有用户列表
    async getUserList() {
      try {
        const res = await this.$api.getUserAllList();
        this.userList = res;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 查询部门列表
    handleQuery() {
      this.getDeptList();
    },
    // 重置表单
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
    // 创建部门方法
    handleAdd() {
      this.dialogVisible = true;
      this.action = 'add';
    },
    // 编辑部门方法
    handleEdit(value) {
      this.dialogVisible = true;
      this.action = 'edit';
      this.$nextTick(() => {
        Object.assign(this.createdDept, value, { user: `${value.userId}/${value.userName}/${value.userEmail}` });
      });
    },
    // 删除部门方法
    async handleDelete({ _id }) {
      await this.$api.submitDept({ _id, action: 'delete' });
      ElMessage.success('删除成功');
      this.getDeptList();
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
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { action, createdDept } = this;
          const params = { action, ...createdDept };
          await this.$api.submitDept(params);
          this.$refs[formName].resetFields();
          this.dialogVisible = false;
          ElMessage.success('创建成功');
          this.getDeptList();
        }
      });
    },
    selectChange(val) {
      const [userId, userName, userEmail] = val.split('/');
      Object.assign(this.createdDept, { userId, userName, userEmail });
    }
  }
};
</script>

<template>
  <div class="dept-wrapper">
    <div class="query-form">
      <el-form ref="formRef" :inline="true" :model="deptQuery" class="demo-form-inline">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptQuery.deptName" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset('formRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="select-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table ref="tableRef" :data="deptList" row-key="_id" stripe default-expand-all style="width: 100%"
        :tree-props="{ children: 'children' }">
        <el-table-column v-for="{ prop, label, formatter, width } in deptColums" :key="prop" :prop="prop" :label="label"
          :formatter="formatter" :width="width" />
        <el-table-column fixed="right" label="操作" width="140">
          <template #default="scope"> <!-- 插槽 -->
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="创建部门" width="30%" @close="closeDialog('dialogForm')">
      <el-form ref="dialogForm" :model="createdDept" label-width="100px" :rules="rules">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader v-model="createdDept.parentId" :options="deptList"
            :props="{ value: '_id', label: 'deptName', checkStrictly: true }" placeholder="请选择上级部门名称" clearable
            :show-all-levels="true" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="createdDept.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select v-model="createdDept.user" placeholder="请选择负责人" @change="selectChange">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input disabled v-model="createdDept.userEmail" />
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