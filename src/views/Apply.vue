<script >
import { ElMessage } from 'element-plus';
import { ref, inject, onMounted, reactive, toRaw } from 'vue';
import util from './../utils/util';
export default {
  name: 'Apply',
  setup() {
    const api = inject('$api');//vue3 没有this,通过祖孙间通信传递数据 
    // apply为表单查询条件
    const applyQuery = reactive({
      applyState: 0
    });
    const createdApply = reactive({
      leaveTime: "0天"
    });
    // applyList 申请休假列表，用于Table中的数据
    const applyList = ref([]);
    // pager:{pageNum,pageSize,total} total表示查询结果的数目
    const pager = reactive({
      pageNum: 1,
      pageSize: 10
    });
    // 申请列表的表头字段
    const applyColums = reactive([
      { prop: 'orderNo', label: '单号' },
      {
        label: '休假时间', formatter(row, column, value) {
          return (util.dataFormater(new Date(row.startTime), "yyyy-MM-dd")
            + "到"
            + util.dataFormater(new Date(row.endTime), "yyyy-MM-dd"));
        }
      },
      { prop: 'leaveTime', label: '休假时长' },
      {
        prop: 'applyType', label: '休假类型',
        formatter(row, column, value) {
          return { 1: '事假', 2: '调休', 3: '年假' }[value];
        }
      },
      { prop: 'reasons', label: '休假原因' },
      {
        prop: 'createTime', label: '申请时间',
        formatter(row, column, value) {
          return util.dataFormater(value);
        }
      },
      {
        prop: 'auditUsers', label: '审批人',
      },
      {
        prop: 'curAuditUserName', label: '当前审批人',
      },
      {
        prop: 'applyState', label: '审批状态', formatter(row, col, value) {
          return { 1: "待审批", 2: "审批中", 3: "审批拒绝", 4: "审批通过", 5: "作废" }[value];
        }
      },
    ]);
    // el-form表单控件本身
    const formRef = ref();
    const tableRef = ref();
    // 新增表单控件本身ref
    const dialogForm = ref();
    // 弹窗显示控制值
    const dialogVisible = ref(false);
    // 新增表单规则对象
    const rules = {
      applyType: [{ required: true, message: '请输入休假类型', trigger: 'change' }],
      startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
      endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
      reasons: [{ required: true, message: '请输入休假原因', trigger: ['change', 'blur'] }],
    };
    const action = ref('create');
    const setpVisible = ref(false);
    const stepNo = ref(0);
    const stepColums = ref();
    // 发请求获取申请数据  getApplyList([option,])  返回一个对象 { page, list } 
    const getApplyList = async () => {
      try {
        const { page, list } = await api.getApplyList({ ...applyQuery, ...pager });
        applyList.value = list;
        pager.total = page.total;
      }
      catch (error) { console.log(error); }
    };
    // 根据查询条件 获取申请数据 传递params: 表单数据apply
    const handleQuery = () => {
      getApplyList();
    };
    // 使用el提供的函数进行表单重置  formEl指 FormRef表单
    const handleReset = (formEl) => {
      formEl.resetFields();
    };
    // 改变pageSize，则重新请求数据
    const handleCurrentChange = (val) => {
      pager.pageNum = val;
      getApplyList();
    };
    // 提交表单  formEl指 dialogForm表单
    const submitForm = async (formEl) => {
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const params = toRaw(createdApply);
          params.action = action.value;
          const res = await api.submitApply(params);
          formEl.resetFields();
          getApplyList();
          dialogVisible.value = false;
          ElMessage.success("申请创建成功");
        }
      });
    };
    // 重置表单
    const resetForm = (formEl) => {
      formEl.resetFields();
      dialogVisible.value = false;
    };
    const handleApply = () => {
      action.value = 'create';
      dialogVisible.value = true;
    };
    const handleEdit = (row) => {
      action.value = 'edit';
      setpVisible.value = true;
      stepNo.value = row.applyState > 2 ? 3 : row.applyState;
      stepColums.value = [
        {
          prop: 'applyType', label: '休假类型', value: { 1: '事假', 2: '调休', 3: '年假' }[row.applyType]
        },
        {
          prop: 'applyDate', label: '休假时间', value: (util.dataFormater(new Date(row.startTime), "yyyy-MM-dd")
            + "到" + util.dataFormater(new Date(row.endTime), "yyyy-MM-dd"))
        },
        { prop: 'leaveTime', label: '休假时长', value: row.leaveTime },
        { prop: 'reasons', label: '休假原因', value: row.reasons },
        { prop: 'applyState', label: '审批状态', value: { 1: "待审批", 2: "审批中", 3: "审批拒绝", 4: "审批通过", 5: "作废" }[row.applyState] },
        { prop: 'curAuditUserName', label: '审批人', value: row.curAuditUserName },
      ];
    };
    const handleDelete = async (_id) => {
      const params = { _id, action: "delete" };
      const res = await api.submitApply(params);
      ElMessage.success("删除成功");
      getApplyList();
    };
    const handleDateChange = () => {
      const { startTime, endTime } = createdApply;
      if (!startTime || !endTime) return;
      if (startTime > endTime) {
        ElMessage.error('结束时间不能早于开始时间');
        createdApply.endTime = "";
      } else {
        createdApply.leaveTime = (((endTime - startTime) / (24 * 60 * 60 * 1000)) + 1) + "天";
      }
    };

    // 初始化时，获取所有的申请数据
    onMounted(async () => {
      getApplyList();
    });

    // 返回所有的数据和方法
    return {
      applyQuery,
      applyList,
      applyColums,
      pager,
      formRef,
      tableRef,
      dialogVisible,
      setpVisible,
      createdApply,
      rules,
      dialogForm,
      action,
      stepNo,
      stepColums,
      getApplyList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      resetForm,
      submitForm,
      handleDelete,
      handleEdit,
      handleApply,
      handleDateChange
    };
  }
};
</script>

<template>
  <div class="apply-wrapper">
    <div class="query-form">
      <el-form ref="formRef" :inline="true" :model="applyQuery" class="demo-form-inline">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="applyQuery.applyState" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="待审批" :value="1" />
            <el-option label="审批中" :value="2" />
            <el-option label="审批拒绝" :value="3" />
            <el-option label="审批通过" :value="4" />
            <el-option label="作废" :value="5" />
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
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table ref="tableRef" :data="applyList" stripe style="width: 100%">
        <el-table-column v-for="{ prop, label, formatter } in applyColums" :key="prop" :prop="prop" :label="label"
          :formatter="formatter" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope"> <!-- 插槽 -->
            <el-button size="small" @click="handleEdit(scope.row)">查看</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row._id)"
              v-if="[1, 2].includes(scope.row.applyState)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" small background layout="prev, pager, next" :page-size="pager.pageSize"
        :total="pager.total * 1" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogVisible" title="休假申请" @close="dialogForm.resetFields()">
      <el-form ref="dialogForm" :model="createdApply" label-width="100px" :rules="rules" status-icon>
        <el-form-item label="休假类型" prop="applyType">
          <el-select v-model="createdApply.applyType" placeholder="请选择休假类型">
            <el-option label="事假" :value="1" />
            <el-option label="调休" :value="2" />
            <el-option label="年假" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" required>
          <el-row>
            <el-col :span="10">
              <el-form-item prop="startTime">
                <el-date-picker type="date" v-model="createdApply.startTime" placeholder="请选择开始日期"
                  @change="handleDateChange" />
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="10">
              <el-form-item prop="endTime">
                <el-date-picker type="date" v-model="createdApply.endTime" placeholder="请选择结束日期"
                  @change="handleDateChange" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" prop="leaveTime">
          {{ createdApply.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input type="textarea" :row="3" v-model="createdApply.reasons" placeholder="请输入休假原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="resetForm(dialogForm)">取消</el-button>
          <el-button type="primary" @click="submitForm(dialogForm)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="setpVisible" ref="stepForm" title="申请休假" destroy-on-close>
      <el-steps :active="stepNo" align-center>
        <el-step title="待审批" />
        <el-step title="审批中" />
        <el-step title="审批通过/拒绝" />
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item v-for="{ prop, label, value } in stepColums" :key="prop" :label="label">{{
          value }}
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="setpVisible = !setpVisible">关闭</el-button>
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