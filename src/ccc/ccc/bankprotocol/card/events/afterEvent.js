//OWmq6Ugo6jPE4W7xoi1UXhDArbPBxo2bVte0t40e0oTxo72243X7MAOHHYWUnhZs
import { ajax, promptBox } from "nc-lightapp-front";
//引入配置常量定义
import {
  formId,
  tableId1,
  cardPageId,
  tabs,
  TEMPLATE,
  ACTION_URL,
} from "../../constant/constant";
import moment from "moment";
import {getCreditSum} from "./page";
import tableButtonClick from "./tableButtonClick";
const dateFormat = "YYYY-MM-DD HH:mm:ss";
/**
 * 大家不要复制 此部分代码，大家写代码也不应按着这样的思路去处理，容易给大家造成误导 ！！！
 */
/**
 * 卡片编辑后事件，包括主表、授信明细子表、担保合同子表编辑后事件
 * @param {*} props
 * @param {*} moduleId 当前编辑后事件触发的 区域编码
 * @param {*} key	当前编辑字段 code
 * @param {*} value  主表下 返回 当前编辑字段的 新值 子表下 返回 当前编辑字段的 value 值
 * @param {*} changedrows 主表下 返回当前编辑字段的 旧值 子表下 返回 当前变更的 行数据 包括新值 和 旧值
 * @param {*} index 主表下 返回 当前编辑字段的 新值 子表下 返回 当前编辑字段所在行 下标 index
 * @param {*} record 主表返回 undefined 子表返回 当前变更的行数据
 * @param {*} flag 主表返回 undefined 子表返回 "line"
 */
export default function afterEvent(
  props,
  moduleId,
  key,
  value,
  changedrows,
  index,
  record,
  flag
) {
  

  console.log(moduleId, key, value, changedrows, index, record, flag);
  // 主表中需要走编辑后事件的字段
  const headItems = [
    "pk_org",
    "pk_currtype",
    "cdtlnamt",
    "olcrate",
    "glcrate",
    "gllcrate",
    "periodcount",
    "periodunit",
    "begindate",
    "protocoltype",
    "guaranteetype",
    "credittypecontral",
    "creditbankcontral",
    "creditunitcontral",
    "credittype",
    "pk_creditbank",
    "controlmethod",
    "useguamoney",
    "pk_fundplan",
  ];
  // 授信明细子表中需要走编辑后事件的字段
  const bodyDetailItems = ["cdtlnamt", "pk_currtype"];
  // 贷款合同子表中需要走编辑后事件的字段
  const bodyGuaranteeItems = [
    "guarantee",
    "pk_currtype",
    "useguamoney",
    "olcguarate",
  ];

  let moduleId1 = props.cardTable.getCurTabKey();
  if (headItems.includes(key) && moduleId == this.formId) {
    // 走主编编辑后事件
    headItemAfterEditHandler.call(
      this,
      moduleId,
      key, // 字段
      value, // 新值
      changedrows, // 旧值
      flag
    );
  } else if (
    changedrows &&
    bodyDetailItems.includes(key) &&
    moduleId1 == TEMPLATE.TABLE_DETAIL
  ) {
    // 走授信明细子表编辑后事件
    bodyDetailAfterEditHandler.call(
      this,
      props,
      moduleId,
      key,
      value,
      changedrows,
      index,
      record,
      flag
    );
  } else if (
    changedrows &&
    bodyGuaranteeItems.includes(key) &&
    moduleId1 == TEMPLATE.TABLE_GUARANTEE
  ) {
    // 走担保合同子表编辑后事件
    bodyGuaranteeAfterEditHandler.call(
      this,
      props,
      moduleId,
      key,
      value,
      changedrows,
      index,
      record
    );
  }
}

/**
 * 处理表头字段编辑后事件
 * @param {*} props
 * @param {*} key
 * @param {*} value 新值
 * @param {*} oldvalue 旧值
 * @param {*} falg
 */
export const headItemAfterEditHandler = function (
  moduleId,
  key,
  value,
  oldvalue,
  flag
) {

  let props = this.props;
  if(key==='pk_org'){
    let data=value.value;
    getCreditSum.call(this,data)
    
  }
  
  

  //获取页面数据
  let eventData = props.createTabsAfterEventData(
    cardPageId,
    "form_info",
    tabs.tabOrder,
    moduleId,
    key,
    value
  ); //编辑后事件整单数
  eventData.areacode = "form_info";
  //处理分授信三个按钮的编辑后事件
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
  let protocoltype = props.form.getFormItemsValue(this.formId, "protocoltype"); //协议类型
  let pk_creditbank = props.form.getFormItemsValue(
    this.formId,
    "pk_creditbank"
  ); //授信银行
  let isArr = {
    credittypecontral: { value: isTypeContral.value, key: "credittype" },
    creditbankcontral: { value: isBankContral.value, key: "pk_bankdoc" },
    creditunitcontral: { value: isUnitControl.value, key: "pk_org" },
  };
  if (
    ["credittypecontral", "creditbankcontral", "creditunitcontral"].includes(
      key
    )
  ) {
    let tabData = props.cardTable.getTabData(tableId1);
    let i = 0,
      indexArr = [];
    tabData.rows &&
      tabData.rows.forEach((item) => {
        indexArr.push(i++);
        if (!isArr[key].value) {
          item.values[isArr[key].key] = {
            display: null,
            value: null,
          };
        }
      });
    props.cardTable.setTabData(tableId1, tabData);
    props.cardTable.setIndexsEditabByKeys(tableId1, indexArr, {
      [isArr[key].key]: isArr[key].value,
    });
    if (
      protocoltype.value == 1 &&
      key == "creditbankcontral" &&
      isBankContral.value
    ) {
      props.cardTable.setColValue(tableId1, "pk_bankdoc", pk_creditbank);
    }
  }
  //处理银行授信协议引用担保编辑后事件
  let guaranteetype = props.form.getFormItemsValue(
    this.formId,
    "guaranteetype"
  ); //担保方式
  let istype = null;

  //条件分支判断 选择非信用或者非空
  if (guaranteetype.value === "credit" || guaranteetype.value === "") {
    istype = {
      guaranteetypeflag: { value: false, key: "guaranteetypeflag" },
    };
  } else {
    istype = {
      guaranteetypeflag: { value: true, key: "guaranteetypeflag" },
    };
  }
  if (["guaranteetype"].includes(key)) {
    let tabData = props.cardTable.getTabData(tableId1);
    let i = 0,
      indexArr2 = [];
    tabData.rows &&
      tabData.rows.forEach((item) => {
        indexArr2.push(i++);
        if (!istype["guaranteetypeflag"].value) {
          item.values[istype["guaranteetypeflag"].key] = {
            display: null,
            value: null,
          };
        }
      });
    props.cardTable.getTabData(tableId1, tabData);
    props.cardTable.setIndexsEditabByKeys(tableId1, indexArr2, {
      [istype["guaranteetypeflag"].key]: istype["guaranteetypeflag"].value,
    });
    props.form.setFormItemsDisabled(formId, { guaranteetypeflag: true }); //是否可编辑,true不可编辑
    props.form.setFormItemsValue(formId, {
      guaranteetypeflag: { value: istype["guaranteetypeflag"].value },
    }); //修改内容
  }
  //清空数据
  if (!value || !value.value) {
    // 字段值清空，处理相关连内容逻辑
    clearHeadItem.call(this, props, key, oldvalue, value);
  } else if (
    !oldvalue || !oldvalue.value || flag ? true : value.value != oldvalue.value
  ) {
    //有变更 发起请求进行编辑后事件处理
    if (key === "pk_org") {
      
      
      //原本组织为空，则不弹框
      if (!oldvalue || !oldvalue.value || flag) {
        //组织选中值则恢复其余字段的编辑性
        props.resMetaAfterPkorgEdit();

        //处理组织编辑后事件
        handleOrgAfterEdit.call(this, props, eventData, key, value);
      } else {
        this.setState({
          oldorg: oldvalue.value,
          oldorgDis: oldvalue.display,
        });
        promptBox({
          color: "warning",
          content: this.state.json[
            "36610CC-000004"
          ] /* 国际化处理： 是否修改组织*/,
          beSureBtnClick: () => {
            //组织选中值则恢复其余字段的编辑性
            props.resMetaAfterPkorgEdit();
            handleOrgAfterEdit.call(this, props, eventData, key, value);
          },
          cancelBtnClick: () => {
            this.props.form.setFormItemsValue(this.formId, {
              pk_org: {
                value: this.state.oldorg,
                display: this.state.oldorgDis,
              },
            });
          },
        });
      }
    }
    //币种,原币额度,组织本币汇率
    if (
      key === "pk_currtype" ||
      key === "cdtlnamt" ||
      key === "olcrate" ||
      key === "glcrate" ||
      key === "gllcrate"
    ) {
      afterEventAjax.call(this, eventData).then((data) => {
        if (data.head) {
          props.form.setAllFormValue({ [formId]: data.head[formId] });
        }
        if (data.bodys) {
          props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
        }
        //默认组织币种，则组织汇率不可编辑
        if (key === "pk_currtype") {
          if (this.orgCurrtype.pk_currtype == value.value) {
            props.form.setFormItemsDisabled(formId, {
              olcrate: true,
            });
            props.form.setFormItemsValue(formId, {
              olcrate: { value: this.orgCurrtype.olcrate },
            });
          } else {
            props.form.setFormItemsDisabled(formId, {
              olcrate: false,
            });
          }
        } else if (key === "cdtlnamt") {
          // 原币金额自动带到明细表体
          // 需要和后端确认是否带出
          props.cardTable.setColValue(
            this.tableId1,
            "cdtlnamt",
            data.head["form_info"].rows[0].values.cdtlnamt
          );
          props.cardTable.setColValue(
            this.tableId1,
            "olccdtlnamt",
            data.head["form_info"].rows[0].values.olccdtlnamt
          );
        }
      });
    }
    //期间单位，授信期间，开始日期，结束日期
    if (key === "periodcount" || key == "periodunit" || key == "begindate") {
      let periodcount = props.form.getFormItemsValue(formId, "periodcount");
      let periodunit = props.form.getFormItemsValue(formId, "periodunit");
      let begindate = props.form.getFormItemsValue(formId, "begindate");
      let currtype = props.form.getFormItemsValue(formId, "pk_currtype");
      // 担保方式
      let guaType = props.form.getFormItemsValue(formId, "guaranteetype");
      let enddate;
      if (
        periodcount &&
        periodcount.value &&
        periodunit &&
        periodunit.value &&
        begindate &&
        begindate.value
      ) {
        // 修改开始日期 同步修改 结束日期
        enddate = getEndDate(
          begindate.value,
          periodunit.value,
          periodcount.value
        );
        props.form.setFormItemsValue(formId, {
          enddate: { value: enddate },
        });
        // 此处需要 同步更新 eventData 否则 后台返回的 vo 数据时 结束日期还是旧值
        eventData.card.head[this.formId].rows[0].values.enddate.value = enddate;
      }
      if (key === "begindate" && currtype && currtype.value) {
        afterEventAjax.call(this, eventData).then((data) => {
          if (data.head) {
            props.form.setAllFormValue({
              [formId]: data.head[formId],
            });
          }
          if (data.bodys) {
            props.cardTable.setAllTabsData(data.bodys, tabs.tabOrder, () => {
              setBodyDisabledByCreditType.call(this, protocoltype.value);
            });
          }
        });
      }
      if (key === "begindate" && guaType) {
        delTabData.call(this, props, "table_guarantee");
        if (guaType.value === "credit" || !guaType.value) {
          props.cardTable.tabKeyShowSwitch({
            table_detail: {
              show: true, //是否显示a页签
              isClear: false, //是否清空a页签数据，show: false才生效
              isCur: true, //是否切换选中a页签，show: true才生效
            },
            table_guarantee: {
              show: false,
              isClear: false,
              isCur: false,
            },
          });
        } else {
          props.cardTable.tabKeyShowSwitch({
            table_detail: {
              show: true, //是否显示a页签
              isClear: false, //是否清空a页签数据，show: false才生效
              isCur: false, //是否切换选中a页签，show: true才生效
            },
            table_guarantee: {
              show: true,
              isClear: false,
              isCur: true,
            },
          });
        }
      }
    }
    //协议类型
    if (key === "protocoltype") {
      let obj = {
        table_detail: {
          show: true, //是否显示a页签
          isClear: true, //是否清空a页签数据，show: false才生效
          isCur: true, //是否切换选中a页签，show: true才生效
        },
        table_guarantee: {
          show: false,
          isClear: false,
          isCur: false,
        },
      };
      // 清空担保方式字段
      props.form.setFormItemsValue(formId, {
        guaranteetype: { value: null },
      });
      setTabsSwitch.call(this, props, obj).then(() => {
        if (value.value === "1") {
          //企业授信
          //分授使用单位控制：不可编辑，为ture
          props.form.setFormItemsDisabled(formId, {
            creditunitcontral: true,
          });
          props.form.setFormItemsValue(formId, {
            creditunitcontral: { value: true },
          });
          tableButtonClick.call(this, props, "addrow", "", "", 0); // 表体自动增行
        } else if (value.value === "2") {
          //集团授信
          //分授使用单位控制 ：可编辑，为fasle
          props.form.setFormItemsDisabled(formId, {
            creditunitcontral: false,
          });
          props.form.setFormItemsValue(formId, {
            creditunitcontral: { value: false },
          });
        }
        setBodyDisabledByCreditType.call(this, value.value);
        // 子表 按钮是否可用
        bodyTableButtonDisabled.call(this, "creditunitcontral");
      });
    }
    //担保方式
    if (key === "guaranteetype") {
      let obj;
      if (value.value === "credit" || !value.value) {
        obj = {
          table_detail: {
            show: true, //是否显示页签
            isClear: false, //是否清空页签数据，show: false才生效
            isCur: true, //是否切换选中页签，show: true才生效
          },
          table_guarantee: {
            show: false,
            isClear: false,
            isCur: false,
          },
        };
      } else {
        obj = {
          table_detail: {
            show: true, //是否显示页签
            isClear: false, //是否清空页签数据，show: false才生效
            isCur: true, //是否切换选中页签，show: true才生效
          },
          table_guarantee: {
            show: true,
            isClear: false,
            isCur: true,
          },
        };
        props.button.setButtonDisabled(["addrow", "deleterow"], false); //增行删行可用
      }
      if (value.value !== oldvalue.value) {
        // 只要新旧值不相等 清空担保信息表体
        delTabData.call(this, props, "table_guarantee");
      }
      props.cardTable.tabKeyShowSwitch(obj);
    }
    if (key === "pk_creditbank") {
      // 自动带出贷款银行
      props.cardTable.setColValue(this.tableId1, "pk_bankdoc", value);
    }
    if (key === "pk_fundplan") {
      // 资金项目计划自动带到表体
      props.cardTable.setColValue(this.tableId1, key, value);
    }
    if (key === "controlmethod") {
      // 控制方式自动带到表体
      props.cardTable.setColValue(this.tableId1, "controltype", value);
      //controltype: { value: 'CONTROL', display: this.state.json['36610CC-000017'] } /* 国际化处理： 控制*/,
    }
  }
  // 子表 按钮是否可用
  bodyTableButtonDisabled.call(this, key);
};

/**
 * 处理明细表体的编辑后事件
 * @param {*} props
 * @param {*} key
 * @param {*} value
 * @param {*} changedrows
 * @param {*} index
 * @param {*} record
 */
const bodyDetailAfterEditHandler = function (
  props,
  moduleId,
  key,
  value,
  changedrows,
  index,
  record,
  flag
) {
  //授信明细
  moduleId = props.cardTable.getCurTabKey();
  //获取页面数据
  let eventData = props.createTabsAfterEventData(
    cardPageId,
    "form_info",
    tabs.tabOrder,
    moduleId,
    key,
    value
  ); //编辑后事件整单数据
  eventData.areacode = TEMPLATE.TABLE_DETAIL;
  //获取编辑的值
  eventData.newvalue = { value: eventData.newvalue };
  let cod = props.cardTable.getValByKeyAndIndex(moduleId, index, "olcrate")
    .value;
  let protocoltype = props.form.getFormItemsValue(this.formId, "protocoltype"); //协议类型

  //原币额度
  if (
    (key === "cdtlnamt" ||
      key === "olcrate" ||
      (key === "pk_currtype" && cod !== null)) &&
    moduleId == TEMPLATE.TABLE_DETAIL
  ) {
    if (key === "cdtlnamt") {
      let result;
      let money = props.cardTable
        .getTabVisibleRows(TEMPLATE.TABLE_DETAIL)
        .map((item) => item.values[key]);
      result = money.reduce((pre, next) => Number(pre) + Number(next.value), 0);
      // props.form.setFormItemsValue(formId, {
      //   cdtlnamt: { value: result }
      // });
      // headItemAfterEditHandler.call(
      //   this,
      //   props,
      //   moduleId,
      //   key,
      //   { value: result },
      //   flag
      // );
      // 走子表编辑后事件时主编中的 原币金额字段别没有赋值
      eventData.card.head[formId].rows[0].values[key].value = result;
    }
    afterEventAjax.call(this, eventData).then((data) => {
      if (data.head) {
        props.form.setAllFormValue({ [formId]: data.head[formId] });
      }
      if (data.bodys) {
        props.cardTable.setAllTabsData(data.bodys, tabs.tabOrder, () => {
          setBodyDisabledByCreditType.call(this, protocoltype.value);
        });
      }
    });
  }
};

/**
 * 处理担保表体的编辑后事件
 * @param {*} props
 * @param {*} key
 * @param {*} value
 * @param {*} changedrows
 * @param {*} index
 * @param {*} record
 */
//担保方式guatype，币种pk_currtype,担保金额guaamount，组织本币汇率olcguarate，组织本币金额gualcamount
//占用担保额度useguamoney，占用担保本币额度olcguacdtlnamt
//开始日期guastartdate，结束日期guaenddate
const bodyGuaranteeAfterEditHandler = function (
  props,
  moduleId,
  key,
  value,
  changedrows,
  index,
  record
) {
  // 担保合同
  let moduleId2 = props.cardTable.getCurTabKey();
  //获取页面数据
  let eventData = props.createTabsAfterEventData(
    cardPageId,
    "form_info",
    tabs.tabOrder,
    moduleId,
    key,
    value
  ); //编辑后事件整单数据
  eventData.areacode = TEMPLATE.TABLE_GUARANTEE;
  //获取编辑的值
  eventData.newvalue = { value: eventData.newvalue };
  if (key === "guarantee") {
    let guatype = props.form.getFormItemsValue(this.formId, "guaranteetype");
    if (value && value.values) {
      props.cardTable.setValByKeysAndIndex(moduleId, index, {
        guarantee: {
          display: value.values.contractno.value,
          value: value.values.pk_guacontract.value,
        }, //担保合约
        pk_currtype: {
          display: value.values.currname.value,
          value: value.values.pk_currtype.value,
        }, //担保币种
        guaamount: {
          value: value.values.guaamount.value,
          scale: value.values.guaamount.scale,
        }, //担保金额
        guatype: guatype, //担保方式
        olcrate: {
          value: value.values.olcrate.value,
          scale: value.values.olcrate.scale,
        }, //组织本币汇率
        gualcamount: {
          value: value.values.gualcamount.value,
          scale: value.values.gualcamount.scale,
        }, //组织本币金额
        guastartdate: {
          display: value.values.guastartdate.value,
          value: value.values.guastartdate.value,
        }, //开始日期
        guaenddate: {
          display: value.values.guaenddate.value,
          value: value.values.guaenddate.value,
        }, //结束日期
        // 目前担保参照里没有给出占用的值，等有了再取消注释
        // glcguarate: { display: value.values.glcguarate.value, value: value.values.glcguarate.value }, //占用担保集团汇率
        // gllguarate: { display: value.values.gllguarate.value, value: value.values.gllguarate.value }, //占用担保全局汇率
        // glcguacdtlnamt: { display: value.values.glcguacdtlnamt.value, value: value.values.glcguacdtlnamt.value },//占用担保集团本币额度
        // gllguacdtlnamt: { display: value.values.gllguacdtlnamt.value, value: value.values.gllguacdtlnamt.value },//占用担保全局本币额度
        // olcguarate: { display: value.values.olcguarate.value, value: value.values.olcguarate.value },//占用担保组织汇率
      });
      props.cardTable.setEditableByIndex(
        moduleId,
        index,
        [
          "pk_currtype",
          "guatype",
          "gualcamount",
          "guaamount",
          "guastartdate",
          "guaenddate",
        ],
        false
      );
    }
    setEditabByKeys(
      moduleId2,
      this.formId,
      props,
      "pk_currtype",
      "olcguarate",
      "pk_currtype",
      "pk_currtype"
    );
  } else if (
    (key === "useguamoney" ||
      key === "olcguarate" ||
      (key === "pk_currtype" && cod !== null)) &&
    moduleId2 == TEMPLATE.TABLE_GUARANTEE
  ) {
    afterEventAjax.call(this, eventData).then((data) => {
      if (data.bodys) {
        props.cardTable.setAllTabsData(data.bodys, tabs.tabOrder, () => {
          setEditabByKeys(
            moduleId2,
            this.formId,
            props,
            "pk_currtype",
            "olcguarate",
            "pk_currtype",
            "pk_currtype"
          );
        });
      }
    });
    props.cardTable.setEditableByIndex(
      moduleId,
      index,
      [
        "pk_currtype",
        "guatype",
        "gualcamount",
        "guaamount",
        "guastartdate",
        "guaenddate",
      ],
      false
    );
  }

  //占用担保额度
  if (key === "useguamoney") {
    const useguamoney = props.cardTable.getValByKeyAndIndex(
      moduleId,
      index,
      "useguamoney"
    ).value;
    const olcguarate = props.cardTable.getValByKeyAndIndex(
      moduleId,
      index,
      "olcrate"
    ).value;
    props.cardTable.setValByKeysAndIndex(this.formId, {
      olcguacdtlnamt: {
        display: useguamoney * olcguarate,
        value: useguamoney * olcguarate,
      },
    });
  }
};

/**
 * 处理组织编辑后事件
 * @param {*} props
 * @param {*} eventData
 */
const handleOrgAfterEdit = function (props, eventData, key, value) {
  afterEventAjax.call(this, eventData).then((data) => {
    let { head } = data;
    //更新表单数据
    props.form.setAllFormValue({ [formId]: head[formId] });
    if (key == "pk_org") {
      props.form.setFormItemsValue(formId, {
        crediter: { value: value.display },
      });
      props.form.setFormItemsDisabled(formId, { olcrate: true });
      let pk_currtype = head[this.formId].rows[0].values.pk_currtype.value;
      let olcrate = head[this.formId].rows[0].values.olcrate.value;
      this.orgCurrtype = {
        pk_currtype,
        olcrate,
      };
    }
    //清空表体
    props.cardTable.setAllTabsData(null, ["table_detail", "table_guarantee"]);
    //集团授信时使用单位控制可以编辑
    let protocoltype = props.form.getFormItemsValue(formId, "protocoltype");
    if (protocoltype.value == "2") {
      this.props.form.setFormItemsDisabled(formId, {
        creditunitcontral: false,
      });
    } else if (protocoltype.value == "1") {
      this.props.form.setFormItemsDisabled(formId, {
        creditunitcontral: true,
      });
      tableButtonClick.call(this, props, "addrow", "", "", 0); // 表体自动增行
    }
    //期间单位，授信期间，开始日期，结束日期
    let periodcount = props.form.getFormItemsValue(formId, "periodcount");
    let periodunit = props.form.getFormItemsValue(formId, "periodunit");
    let begindate = props.form.getFormItemsValue(formId, "begindate");
    let enddate;
    if (
      periodcount &&
      periodcount.value &&
      periodunit &&
      periodunit.value &&
      begindate &&
      begindate.value
    ) {
      enddate = getEndDate(
        begindate.value,
        periodunit.value,
        periodcount.value
      );
      props.form.setFormItemsValue(formId, {
        enddate: { value: enddate },
      });
    }
  });
};


 
 
  
  


/**
 * 清空表头字段处理逻辑
 * @param {*} props
 * @param {*} key
 * @param {*} oldvalue 旧值
 * @param {*} newvalue 新值
 */
const clearHeadItem = function (props, key, oldvalue, newvalue) {
  //清空资金组织需要交互确认
  if (key == "pk_org") {
    this.setState({
      oldorg: oldvalue.value,
      oldorgDis: oldvalue.display,
    });
    promptBox({
      color: "warning",
      content: this.state.json["36610CC-000004"] /* 国际化处理： 是否修改组织*/,
      beSureBtnClick: () => {
        //清空数据
        props.form.EmptyAllFormValue();
        props.cardTable.setAllTabsData(null, [
          TEMPLATE.TABLE_DETAIL,
          TEMPLATE.TABLE_GUARANTEE,
        ]);
        props.initMetaByPkorg();
      },
      cancelBtnClick: () => {
        props.form.setFormItemsValue(this.formId, {
          pk_org: {
            value: this.state.oldorg,
            display: this.state.oldorgDis,
          },
        });
      },
    });
  } else if (
    key === "pk_creditbank" ||
    key === "cdtlnamt" ||
    key === "pk_fundplan"
  ) {
    props.cardTable.setColValue(tableId1, key, { display: "", value: "" });
    if (key === "cdtlnamt") {
      props.cardTable.setColValue(tableId1, "olccdtlnamt", {
        display: "",
        value: "",
      });
    } else if (key === "pk_creditbank") {
      props.cardTable.setColValue(tableId1, "pk_bankdoc", {
        display: "",
        value: "",
      });
    }
  } else if (key === "guaranteetype") {
    // 当担保方式为空时 移除担保合同子表
    delTabData.call(this, props, "table_guarantee");
    props.cardTable.tabKeyShowSwitch({
      table_detail: {
        show: true, //是否显示a页签
        isClear: false, //是否清空a页签数据，show: false才生效
        isCur: true, //是否切换选中a页签，show: true才生效
      },
      table_guarantee: {
        show: false,
        isClear: false,
        isCur: false,
      },
    });
  }
};

/**
 * 根据期间获取结束日期
 *
 * @param {*} begin - 开始日期
 * @param {*} period - 期间
 * @param {*} periodUnit - 期间单位
 */
export function getEndDate(begindate, periodunit, periodcount) {
  if (!begindate || !periodunit || !periodcount) return;
  const transUnit = {
    DAY: "d", //日
    MONTH: "M", //月
    SEASON: "Q", //季
    YEAR: "y", //年
  };
  return moment(begindate)
    .add(+periodcount, transUnit[periodunit])
    .format(dateFormat);
}

/**
 * 由开始日期，期间，期间单位，得到结束日期
 *
 * @param {*} begindate
 * @param {*} periodunit
 * @param {*} periodcount
 */
export function getEndDate1(begindate, periodunit, periodcount) {
  let enddate;
  let beginDate = new Date(begindate);
  switch (periodunit) {
    case "MONTH":
      enddate = beginDate.setMonth(
        beginDate.getMonth() + parseInt(periodcount)
      );
      break;
    case "DAY":
      enddate = beginDate.setDate(beginDate.getDate() + parseInt(periodcount));
      break;
    case "YEAR":
      enddate = beginDate.setFullYear(
        beginDate.getFullYear() + parseInt(periodcount)
      );
      break;
    case "SEASON":
      enddate = beginDate.setMonth(
        beginDate.getMonth() + parseInt(periodcount) * 3
      );
      break;
  }
  let date = new Date(enddate);
  return formatTime(date);
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
}

//根据币种判断表体汇率编辑性
export const setEditabByKeys = function (
  tabCode,
  formId,
  props,
  key,
  rate,
  pk_currtype,
  body_currtype
) {
  if (key === "pk_currtype") {
    let head_currtype = props.form.getFormItemsValue(formId, pk_currtype).value;
    let arr = props.cardTable
      .getTabColValue(tabCode, body_currtype)
      .map((item) => item.value)
      .map((item) => item === head_currtype);
    props.cardTable.setIndexsEditabByKeys &&
      props.cardTable.setIndexsEditabByKeys(tabCode, arr, rate);
  }
};

// 时间格式化
function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
}

// 根据授信类别控制子表编辑性
export function setBodyDisabledByCreditType(ctype) {
  let isTypeContral = this.props.form.getFormItemsValue(
    formId,
    "credittypecontral"
  ).value;
  let isBankContral = this.props.form.getFormItemsValue(
    formId,
    "creditbankcontral"
  ).value;
  let isUnitControl = this.props.form.getFormItemsValue(
    formId,
    "creditunitcontral"
  ).value;
  if (ctype === "1") {
    //企业授信
    if (!isTypeContral) {
      this.props.cardTable.setColValue(tableId1, "credittype", {
        display: "",
        value: "",
      });
    }
    // 设置授信使用单位不可编辑
    this.props.cardTable.setColEditableByKey(this.tableId1, ["pk_org"], true);
    // 贷款银行根据分贷款银行控制字段的值控制编辑性
    this.props.cardTable.setColEditableByKey(
      this.tableId1,
      "pk_bankdoc",
      !isBankContral
    );
  } else {
    //集团授信
    // 设置贷款银行编辑性
    this.props.cardTable.setColEditableByKey(
      this.tableId1,
      ["pk_bankdoc"],
      !isBankContral
    );
    // 设置授信使用单位可编辑
    this.props.cardTable.setColEditableByKey(this.tableId1, ["pk_org"], false);
  }
  this.props.cardTable.setColEditableByKey(
    this.tableId1,
    ["credittype"],
    !isTypeContral
  ); //授信类别
}

// 设置子表多页签状态
function setTabsSwitch(props, obj) {
  return new Promise((resolve) => {
    let status = this.props.getUrlParam("status");
    props.cardTable.tabKeyShowSwitch(
      obj,
      status === "add" || status === "copy"
    ); // 清空明细子表
    resolve();
  });
}

// 编辑后事件接口ajax
function afterEventAjax(data) {
  return new Promise((resolve) => {
    ajax({
      url: ACTION_URL.AFTEREDIT,
      async: false,
      data,
      success: (res) => {
        let { success, data } = res;
        if (success && data) {
          resolve(data);
        }
      },
    });
  });
}

/**
 * 集团授信 勾选 分授信类别控制、分贷款银行控制、分授信使用单位控制 控制子表按钮是否可用
 * @param {*} key 当前编辑字段编码
 */
function bodyTableButtonDisabled(key) {
  if (
    key === "credittypecontral" ||
    key === "creditbankcontral" ||
    key === "creditunitcontral"
  ) {
    let { props } = this;
    // 分授信使用单位控制 子表按钮编辑性
    let curTabkey = props.cardTable.getCurTabKey();
    // 分授信类别控制
    let credittypecontral = props.form.getFormItemsValue(
      this.formId,
      "credittypecontral"
    );
    credittypecontral = credittypecontral && credittypecontral.value;
    // 分贷款银行控制
    let creditbankcontral = props.form.getFormItemsValue(
      this.formId,
      "creditbankcontral"
    );
    creditbankcontral = creditbankcontral && creditbankcontral.value;
    // 分授信使用单位控制
    let creditunitcontral = props.form.getFormItemsValue(
      this.formId,
      "creditunitcontral"
    );
    creditunitcontral = creditunitcontral && creditunitcontral.value;
    // 都为 false 时，子表按钮才不可用
    let isDisable = credittypecontral || creditbankcontral || creditunitcontral;
    if (curTabkey === "table_detail") {
      // 授信信息
      // 分授信使用单位控制
      props.button.setButtonDisabled(["addrow", "deleterow"], !isDisable);
    } else if (curTabkey === "table_guarantee") {
      // 担保合同
      props.button.setButtonDisabled(["addrow", "deleterow"], false); //增行删行可用
    }
  }
}

/**
 * 删除子表数据
 * @param {*} props 父组件传入参数集合
 * @param {*} key 子表页签key值
 */
function delTabData(props, key) {
  // 获取子表数据
  let data = props.cardTable.getTabData(key);
  // 删除后数据
  let result = [];
  for (let item of data.rows) {
    if (item.status !== "2") {
      // 不是新增数据
      if (["0", "1"].includes(item.status)) {
        //原有数据修改状态并保留
        item.status = "3";
      }
      result.push(item);
    }
  }
  // 重新赋值子表数据
  data.rows = result;
  props.cardTable.setTabData(key, data);
}

//OWmq6Ugo6jPE4W7xoi1UXhDArbPBxo2bVte0t40e0oTxo72243X7MAOHHYWUnhZs