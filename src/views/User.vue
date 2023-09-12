<script >
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, inject, onMounted, reactive, toRaw, nextTick } from 'vue';
import util from './../utils/util';
export default {
  name: 'User',
  setup() {
    const api = inject('$api');//vue3 没有this,通过祖孙间通信传递数据 
    // user为表单查询条件
    const user = reactive({
      state: 1
    });
    const createdUser = reactive({
      state: 3
    });
    // userList 表单查询结果，用于Table中的数据
    const userList = ref([]);
    // pager:{pageNum,pageSize,total} total表示查询结果的数目
    const pager = reactive({
      pageNum: 1,
      pageSize: 10
    });
    // 查询结果的表头字段
    const userColums = reactive([
      { prop: 'userId', label: '用户ID' },
      { prop: 'userName', label: '用户名' },
      { prop: 'userEmail', label: '用户邮箱' },
      {
        prop: 'role', label: '用户角色',
        formatter(row, column, value) {
          return { 1: '普通用户', 0: '系统管理员' }[value];
        }
      },
      {
        prop: 'state', label: '用户状态',
        formatter(row, column, value) {
          return { 1: '在职', 2: '离职', 3: '试用期' }[value];
        }
      },
      {
        prop: 'createTime', label: '注册时间',
        formatter(row, column, value) {
          return util.dataFormater(value);
        }
      },
      {
        prop: 'lastLoginTime', label: '最后登录时间',
        formatter(row, column, value) {
          return util.dataFormater(value);
        }
      },
    ]);
    // el-form表单控件本身
    const formRef = ref();
    const tableRef = ref();
    // 新增表单控件本身ref
    const ruleFormRef = ref();
    const checkedUserIds = ref();
    // 弹窗显示控制值
    const dialogVisible = ref(false);
    // 级联组件 props对象
    const cascaderProps = { checkStrictly: true, value: '_id', label: 'deptName' };
    // 新增表单规则对象
    const rules = reactive({
      userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      userEmail: [{ required: true, message: '请输入正确的邮箱格式', trigger: 'blur' }],
      mobile: [{ pattern: /^1[3-9][0-9]{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }],
      deptId: [{ required: true, message: '请输入用户部门', trigger: 'blur' }],
    });
    const roleList = ref([]);
    const deptList = ref([]);
    const action = ref('add');
    // 发请求获取用户数据  getUserList([option,])  返回一个对象 { page, list } 
    const getUserList = async () => {
      try {
        const { page, list } = await api.getUserList({ ...user, ...pager });
        userList.value = list;
        pager.total = page.total;
      }
      catch (error) { console.log(error); }
    };
    // 根据查询条件 获取用户数据 传递params: 表单数据user
    const handleQuery = () => {
      getUserList();
    };
    // 使用el提供的函数进行表单重置  formEl指 FormRef表单
    const handleReset = (formEl) => {
      formEl.resetFields();
    };
    // 改变pageSize，则重新请求数据
    const handleCurrentChange = (val) => {
      pager.pageNum = val;
      getUserList();
    };
    // 删除单行数据
    const handleDelete = async (row) => {
      const comfirmRes = await ElMessageBox.confirm(
        '确认删除该用户相关数据吗？',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err => console.log(err));
      if (comfirmRes == 'confirm') {
        await api.userDel({ userIds: [row.userId] });
        ElMessage.success('删除成功');
        getUserList();
      } else { return; }
    };
    // 删除table复选框多行数据
    const handleDeleteAll = async () => {
      if (!checkedUserIds.value || checkedUserIds.value.length == 0) {
        ElMessage.error('请选择要删除的用户');
        return;
      }
      const comfirmRes = await ElMessageBox.confirm(
        '确认删除该用户相关数据吗？',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err => console.log(err));
      if (comfirmRes == 'confirm') {
        const res = await api.userDel({ userIds: checkedUserIds.value });
        if (res.nModified > 0) {
          ElMessage.success('删除成功');
          getUserList();
        } else {
          ElMessage.error('修改失败');
        }
      } else {

      }
    };
    // elementUI table 获取已勾选的行的数据
    const handleSelectionChange = (val) => {
      const arr = val.map(item => item.userId);
      checkedUserIds.value = arr;
    };
    // 用户新增按钮控制弹窗
    const handleCreate = () => {
      action.value = 'add';
      dialogVisible.value = true;
    };
    // 提交表单  formEl指 ruleFormRef表单
    const submitForm = async (formEl) => {
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const params = toRaw(createdUser);
          params.action = action.value;
          params.userEmail = (params.action == 'edit') ? params.userEmail : params.userEmail + "@imooc.com";
          const res = await api.submitUser(params);
          formEl.resetFields();
          getUserList();
          dialogVisible.value = false;
          ElMessage.success("用户创建成功");
        }
      });
    };
    // 重置表单
    const resetForm = (formEl) => {
      formEl.resetFields();
      dialogVisible.value = false;
    };
    const handleEdit = (row) => {
      console.log(row);
      action.value = 'edit';
      dialogVisible.value = true;
      //  nextTick 是将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它;
      nextTick(() => {
        Object.assign(createdUser, row);
      });

    };
    // 初始化时，获取所有的用户数据
    onMounted(async () => {
      getUserList();
      // 初始化或者打开弹窗时调接口拿数据;
      roleList.value = await api.getRoleList();
      deptList.value = await api.getDeptList();
    });

    // 返回所有的数据和方法
    return {
      user,
      userList,
      userColums,
      pager,
      formRef,
      tableRef,
      dialogVisible,
      createdUser,
      cascaderProps,
      rules,
      ruleFormRef,
      roleList,
      deptList,
      action,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handleDeleteAll,
      handleSelectionChange,
      handleCreate,
      resetForm,
      submitForm,
      handleEdit
    };
  }
};
</script>

<template>
  <div class="user-wrapper">
    <div class="query-form">
      <el-form ref="formRef" :inline="true" :model="user" class="demo-form-inline">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" clearable />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" clearable />
        </el-form-item>
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state" clearable>
            <el-option label="所有" :value="0" />
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="2" />
            <el-option label="试用期" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset(formEl)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="select-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handleDeleteAll">删除</el-button>
      </div>
      <el-table ref="tableRef" :data="userList" stripe style="width: 100%" type='selection'
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="{ prop, label, formatter } in userColums" :key="prop" :prop="prop" :label="label"
          :formatter="formatter" />
        <el-table-column fixed="right" label="Operations" width="150">
          <template #default="scope"> <!-- 插槽 -->
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" small background layout="prev, pager, next" :page-size="pager.pageSize"
        :total="pager.total * 1" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogVisible" title="新增用户" width="30%" @close="ruleFormRef.resetFields()">
      <el-form ref="ruleFormRef" :model="createdUser" label-width="100px" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="createdUser.userName" :disabled="action == 'edit'" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="createdUser.userEmail" :disabled="action == 'edit'" placeholder="请输入用户邮箱">
            <template #append>imooc.com </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="createdUser.mobile" placeholder="请输入用户手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="createdUser.job" placeholder="请输入用户岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="createdUser.state" placeholder="请选择用户状态">
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="2" />
            <el-option label="试用期" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="createdUser.roleList" multiple placeholder="请选择用户系统角色" style="width: 100%">
            <el-option v-for="role in roleList" :key="role._id" :label="role.roleName" :value="role._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-cascader v-model="createdUser.deptId" :options="deptList" :props="cascaderProps" placeholder="请选择用户所属部门"
            style="width: 100%" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
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