<script >
import { ElMessage } from 'element-plus';
import { ref, inject, onMounted, reactive, toRaw, } from 'vue';
import { useStore } from 'vuex';
import util from './../utils/util';
export default {
  name: 'Approve',
  setup() {
    const api = inject('$api');//vue3 没有this,通过祖孙间通信传递数据 
    // apply为表单查询条件
    const applyQuery = reactive({
      applyState: 1
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
      { prop: 'applyUser.userName', label: '申请人' },
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
    const auditFormRef = ref();
    const auditForm = ref();
    const applyId = ref();
    // 弹窗显示控制值
    const dialogVisible = ref(false);
    // 新增表单规则对象
    const rules = {
      remark: [{ required: true, message: '请输入审核备注', trigger: 'blur' }],
    };
    const userInfo = useStore().state.userInfo;
    // 发请求获取申请数据  getApplyList([option,])  返回一个对象 { page, list } 
    const getApplyList = async () => {
      try {
        const { page, list } = await api.getApplyList({ ...applyQuery, ...pager, type: 'approve' });
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
    const handleApprove = (row) => {
      dialogVisible.value = true;
      auditForm.value = [
        { prop: 'applyUser', label: '申请人', value: row.applyUser.userName },
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
        { prop: 'remark', label: '备注', value: '' },
      ];
      applyId.value = row._id;
    };
    // 提交表单  formEl指 auditFormRef表单
    const submitApprove = (formEl, action) => {
      formEl.validate(async (valid, fields) => {
        if (valid) {
          const params = { _id: applyId.value, remark: auditForm.value.remark, action };
          const res = api.submitApprove(params);
          ElMessage.success("处理成功");
          formEl.resetFields();
          dialogVisible.value = false;
          getApplyList();
          useStore().commit('saveNoticeCount', useStore().state.noticeCount - 1);
        }
      });
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
      createdApply,
      rules,
      auditFormRef,
      auditForm,
      userInfo,
      getApplyList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleApprove,
      submitApprove,
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
            <el-option label="全部" value="" />
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
      <el-table ref="tableRef" :data="applyList" stripe style="width: 100%">
        <el-table-column v-for="{ prop, label, formatter } in applyColums" :key="prop" :prop="prop" :label="label"
          :formatter="formatter" />
        <el-table-column fixed="right" label="操作" width="80">
          <template #default="scope"> <!-- 插槽 -->
            <el-button size="small" @click="handleApprove(scope.row)"
              v-if="scope.row.curAuditUserName == userInfo.userName && [1, 2].includes(scope.row.applyState)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" small background layout="prev, pager, next" :page-size="pager.pageSize"
        :total="pager.total * 1" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogVisible" title="审核" destroy-on-close>
      <el-form ref="auditFormRef" :model="auditForm" label-width="120px" label-suffix=":" :rules="rules">
        <el-form-item v-for="{ prop, label, value } in auditForm" :key="prop" :label="label" :prop="`${prop}`">
          <el-input v-if="prop == 'remark'" type="textarea" :rows="3" placeholder="请输入审核备注"
            v-model="auditForm[`${prop}`]" />
          <span v-else>{{ value }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="submitApprove(auditFormRef, 'pass')">审核通过</el-button>
          <el-button @click="submitApprove(auditFormRef, 'reject')">驳回</el-button>
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