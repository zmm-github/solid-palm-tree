//0GI1xcoeligdpMeXoHBphlvRhYRLv0Y+TeZ3ZFfdzxoj9S008sZrDYayU0N3HXq7
import { toast } from "nc-lightapp-front";
import { setEditabByKeys, setBodyDisabledByCreditType } from "./afterEvent";

export default function tableButtonClick(
  props,
  key,
  text,
  record,
  index,
  isCela
) {
  let pk_org = props.form.getFormItemsValue(this.formId, "pk_org");
  let isTypeContral = props.form.getFormItemsValue(
    this.formId,
    "credittypecontral"
  ); //分授信类别credittype
  let isBankContral = props.form.getFormItemsValue(
    this.formId,
    "creditbankcontral"
  ); //分贷款银行pk_bankdoc
  let isUnitControl = props.form.getFormItemsValue(
    this.formId,
    "creditunitcontral"
  ); //分授信单位pk_org
  let protocoltype = props.form.getFormItemsValue(this.formId, "protocoltype")
    .value; //协议类型
  let pk_creditbank = props.form.getFormItemsValue(
    this.formId,
    "pk_creditbank"
  ); //授信银行
  let checkedResult = checkOrg.call(this, isBankContral, isUnitControl, pk_org);
  if (!checkedResult.checkedFlag) return; // 如果组织为null，则不可以增行，删行
  let checkedRows = (checkedRows = props.cardTable.getCheckedRows(
    this.tabCode
  )); //所选的数据
  let isChange = this.props.getUrlParam("operate"); //是否是变更
  let selectTab = this.props.cardTable.getCurTabKey(); //当前选择的页签
  this.currTableId = selectTab;
  switch (key) {
    //行 新增
    case "addrow":
      if (selectTab == this.tableId1) {
        // setColEditByNewRow.call(
        //   this,
        //   props,
        //   isTypeContral,
        //   isBankContral,
        //   isUnitControl
        // );
        handelAddRow2Table1.call(
          this,
          props,
          pk_org,
          pk_creditbank,
          isCela,
          index
        );
      } else {
        props.cardTable.addRow(this.tabCode, index, {}, true);
      }

      // 根据协议类型设置子表编辑性
      setBodyDisabledByCreditType.call(this, protocoltype);
      break;
    //行 删除
    case "deleterow":
      //变更时，只允许删除担保页签行
      if (isChange === "change") {
        if (isSelectedData.call(this, checkedRows)) return;
        deleteRow.call(this);
      } else {
        if (isSelectedData.call(this, checkedRows)) return;
        deleteRow.call(this);
      }
      break;
    case "unfold": //展开
    case "fold": //收起
      props.cardTable.openTabModel &&
        props.cardTable.toggleTabRowView(this.tabCode, record);
      break;
    //编辑态展开
    case "cela":
      props.cardTable.openTabModel &&
        props.cardTable.openTabModel(this.tabCode, "edit", record, index);
      break;
  }
}

/**
 * 判断是否选择数据
 * @param {*} checkedRows
 */
function isSelectedData(checkedRows) {
  if (!checkedRows.length) {
    toast({
      color: "warning",
      content: this.state.json["36610CC-000018"],
    }); /* 国际化处理： 请选中行数据!*/
    return true;
  }
}

/**
 * 删除行
 * @param {*} checkedRows
 */
const deleteRow = function () {
  let currTableId = this.props.cardTable.getCurTabKey();
  let checkedRows = this.props.cardTable.getCheckedRows(this.tabCode);
  let chceckedIndex = checkedRows.map((item) => item.index);
  if (checkedRows.length > 0) {
    this.props.cardTable.delTabRowsByIndex(currTableId, chceckedIndex);
  }
};

/**
 * 组织校验
 * @param {*} isBankContral
 * @param {*} isUnitControl
 * @param {*} pk_org
 */
function checkOrg(isBankContral, isUnitControl, pk_org) {
  let checkedFlag = true;
  let pk_creditbank;
  if (!isBankContral.value) {
    pk_creditbank = { display: null, value: null };
  }
  if (!isUnitControl.value) {
    pk_org = { display: null, value: null };
  }
  if (pk_org.value == "") {
    checkedFlag = false;
  }
  return { checkedFlag, pk_creditbank };
}

/**
 * 新增行编辑性控制
 * @param {*} props
 * @param {*} isTypeContral
 * @param {*} isBankContral
 * @param {*} isUnitControl
 */
function setColEditByNewRow(
  props,
  isTypeContral,
  isBankContral,
  isUnitControl
) {
  //处理分授信三个按钮的编辑后事件
  let isArr = [
    { value: isTypeContral.value, key: "credittype" },
    { value: isBankContral.value, key: "pk_bankdoc" },
    { value: isUnitControl.value, key: "pk_org" },
  ];
  for (let item in isArr) {
    if (isArr[item].value) {
      props.cardTable.setColEditableByKey(
        this.tableId1,
        isArr[item].key,
        false
      );
    } else {
      props.cardTable.setColEditableByKey(this.tableId1, isArr[item].key, true);
    }
  }
}

/**
 * 新增行处理
 * @param {*} props
 * @param {*} pk_org
 * @param {*} pk_creditbank
 * @param {*} isCela
 */
function handelAddRow2Table1(props, pk_org, pk_creditbank, isCela, index) {
  let protocoltype = props.form.getFormItemsValue(this.formId, "protocoltype");
  let pk_currtype = props.form.getFormItemsValue(this.formId, "pk_currtype");
  let olcrate = props.form.getFormItemsValue(this.formId, "olcrate");
  let fundplan = props.form.getFormItemsValue(this.formId, "pk_fundplan");
  //企业授信
  if (protocoltype.value == 1) {
    if (isCela) {
      let handleItems = [
        {
          attrcode: "pk_org",
          valAndDispaly: pk_org,
        },
        {
          attrcode: "pk_bankdoc",
          valAndDispaly: pk_creditbank,
        },
        {
          attrcode: "controltype",
          valAndDispaly: {
            value: "CONTROL",
            display: this.state.json["36610CC-000017"],
          },
        },
        {
          attrcode: "olcrate",
          valAndDispaly: olcrate,
        },
        {
          attrcode: "pk_currtype",
          valAndDispaly: pk_currtype,
        },
        {
          attrcode: "pk_fundplan",
          valAndDispaly: fundplan,
        },
      ];
      batchSetTablVal(props, this.tableId1, handleItems, index + 1);
    } else {
      props.cardTable.addRow(
        this.tabCode,
        index,
        {
          pk_org: pk_org,
          pk_bankdoc: pk_creditbank,
          controltype: {
            value: "CONTROL",
            display: this.state.json["36610CC-000017"],
          } /* 国际化处理： 控制*/,
          pk_currtype: pk_currtype,
          olcrate: olcrate,
          pk_fundplan: fundplan,
        },
        true
      );
    }
  } else if (protocoltype.value == 2) {
    //集团授信
    if (isCela) {
      let handleItems = [
        {
          attrcode: "pk_currtype",
          valAndDispaly: pk_currtype,
        },
        {
          attrcode: "controltype",
          valAndDispaly: {
            value: "CONTROL",
            display: this.state.json["36610CC-000017"],
          },
        },
        {
          attrcode: "olcrate",
          valAndDispaly: olcrate,
        },
        {
          attrcode: "pk_fundplan",
          valAndDispaly: fundplan,
        },
      ];
      batchSetTablVal(props, this.tableId1, handleItems, index + 1);
    } else {
      props.cardTable.addRow(
        this.tabCode,
        index,
        {
          controltype: {
            value: "CONTROL",
            display: this.state.json["36610CC-000017"],
          } /* 国际化处理： 控制*/,
          pk_currtype: pk_currtype,
          olcrate: olcrate,
          pk_fundplan: fundplan,
        },
        true
      );
    }
  }
  props.cardTable.setColEditableByKey(this.tableId1, "empty", true);
}

/**
 * 批量settabval方法
 * @param {*} props
 */
function batchSetTablVal(props, moduleId, items, index) {
  items.map((item) => {
    props.cardTable.setTabValByKeyAndIndex(
      moduleId,
      index,
      item.attrcode,
      item.valAndDispaly
    );
  });
}

//0GI1xcoeligdpMeXoHBphlvRhYRLv0Y+TeZ3ZFfdzxoj9S008sZrDYayU0N3HXq7