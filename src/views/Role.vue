<script >
import { ElMessage } from 'element-plus';
import util from './../utils/util';
export default {
  name: 'Role',
  data() {
    return {
      // 角色列表
      roleList: [],
      // 查询的条件
      menuQuery: {},
      // 弹出对话窗表单的数据
      createdRole: {},
      // 是否显示对话框
      dialogVisible: false,
      // 角色表格字段
      roleColums: [
        { prop: 'roleName', label: '角色名称' },
        { prop: 'remark', label: '备注' },
        {
          prop: 'permissionList', label: '权限列表', formatter: (row, column, value) => {
            const arr = [];
            const list = value.halfCheckedKeys || [];
            list.map((item) => {
              if (item) {
                arr.push(this.actionMap[item]);
              };
              //此时this指向表单的作用域
            });
            return arr.join(",");
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
        roleName: [{ required: true, message: "请输入角色名称", trigger: 'blur' }]
      },
      pager: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      action: '',
      permissionVisible: false,
      menuList: [],
      curRoleName: '',
      curRoleId: '',
      // 菜单映射表
      actionMap: []
    };
  },
  // 初始化
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      try {
        const { list, page } = await this.$api.getRoleList({
          ...this.menuQuery,
          ...this.pager
        });
        this.pager.total = page.total;
        this.roleList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 获取菜单列表
    async getMenuList() {
      const res = await this.$api.getMenuList();
      console.log('res=>', res);
      this.menuList = res;
      this.getActionMap();
    },
    // 递归遍历获取 菜单id与菜单名称对应值
    getActionMap() {
      const actionMap = {};
      const deep = (list) => {
        while (list.length) {
          const item = list.pop();
          if (item.children && item.action) {//筛选 有按钮的二级菜单
            actionMap[item._id] = item.menuName;
          } else if (item.children && !item.action) {//筛选 有二级菜单的一级菜单
            deep(item.children);
          }
        }
      };
      deep(JSON.parse(JSON.stringify(this.menuList)));
      this.actionMap = actionMap;
      console.log('actionMap=>', this.actionMap);
    },
    // 查询角色列表
    handleQuery() {
      this.getRoleList();
    },
    // 重置表单
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
    // 创建角色方法
    handleAdd() {
      this.dialogVisible = true;
      this.action = 'add';
    },
    // 编辑角色方法
    handleEdit(value) {
      this.dialogVisible = true;
      this.action = 'edit';
      this.$nextTick(() => {
        Object.assign(this.createdRole, value);
      });
    },
    // 删除角色方法
    async handleDelete({ _id }) {
      await this.$api.submitRole({ _id, action: 'delete' });
      ElMessage.success('删除成功');
      this.getRoleList();
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
          const { action, createdRole } = this;
          const params = { action, ...createdRole };
          await this.$api.submitRole(params);
          this.$refs[formName].resetFields();
          this.dialogVisible = false;
          ElMessage.success('创建成功');
          this.getRoleList();
        }
      });
    },
    // 分页 请求页码变更重新发请求获取roleList
    handleCurrentChange(currentValue) {
      this.pager.pageNum = currentValue;
      this.getRoleList();
    },
    // 设置权限
    setPermission(value) {
      this.permissionVisible = true;
      this.curRoleName = value.roleName;
      this.curRoleId = value._id;
      this.$nextTick(() => {
        const { checkedKeys } = value.permissionList;
        this.$refs['treeRef'].setCheckedKeys(checkedKeys);
      });
    },
    // 更新权限设置
    async submitPermissionForm() {
      const nodes = this.$refs['treeRef'].getCheckedNodes();//全选的节点信息
      console.log('nodes=>', nodes);
      const halfKeys = this.$refs['treeRef'].getHalfCheckedKeys();
      const parentKeys = [];
      const checkedKeys = [];
      // 遍历全选的节点
      nodes.map((node) => {
        if (!node.children) {//说明是按钮
          checkedKeys.push(node._id);
        } else {//说明是菜单
          parentKeys.push(node._id);
        }
      });
      const params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys)
        }
      };
      console.log('params=>', params);
      await this.$api.updatePermission(params);
      this.permissionVisible = false;
      ElMessage.success('设置成功');
      this.getRoleList();
    }
  }
};
</script>

<template>
  <div class="role-wrapper">
    <div class="query-form">
      <el-form ref="formRef" :inline="true" :model="menuQuery" class="demo-form-inline">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="menuQuery.roleName" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
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
      <el-table ref="tableRef" :data="roleList" stripe style="width: 100%">
        <el-table-column v-for="{ prop, label, formatter, width } in roleColums" :key="prop" :prop="prop" :label="label"
          :formatter="formatter" :width="width" />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope"> <!-- 插槽 -->
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="primary" @click="setPermission(scope.row)">设置权限</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" small background layout="prev, pager, next" :page-size="pager.pageSize"
        :total="pager.total * 1" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogVisible" title="创建角色" width="30%" @close="closeDialog('dialogForm')">
      <el-form ref="dialogForm" :model="createdRole" label-width="100px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="createdRole.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="createdRole.remark" type="textarea" rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="resetForm('dialogForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('dialogForm')"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="permissionVisible" title="设置权限" width="30%">
      <el-form ref="permissionForm" label-width="100px">
        <el-form-item label="角色名称">{{ curRoleName }}</el-form-item>
        <el-form-item label="选择权限" prop="permissionList">
          <el-tree ref="treeRef" :data="menuList" show-checkbox node-key="_id" default-expand-all
            :props="{ label: 'menuName' }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="permissionVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPermissionForm"> 确定 </el-button>
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