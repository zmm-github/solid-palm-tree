//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz
import { ajax } from "nc-lightapp-front";
import { tabs, TEMPLATE, btnLimit } from "../../constant/constant.js";
import { versionControl } from "../../Util/index";
import buttonVisible from "./buttonVisible";
import tableButtonClick from "./tableButtonClick";
import FundPlanTreeRef from "../../../../../uapbd/refer/fiacc/FundPlanTreeRef";
import { afterEvent } from "./index";

export default function (props, callback) {
  let that = this;
  props.createUIDom(
    {
      pagecode: "36610CC_C01",
    },
    (data) => {
      if (data) {
        console.log(data, "data");
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button, () => {
            buttonVisible.call(this, props);
          });
        }
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(that, meta, props);
          props.meta.renderTabs(meta, tabs.tabOrder, tabs.showTab, () => {
            callback && callback();
          });
          //版本控制
          versionControl(props);
        }
        if (data.context) {
          let context = data.context;
          if (props.getUrlParam("status") === "add") {
            if (context.pk_org) {
              //设置默认组织
              let { pk_org, org_Name, pk_org_v, org_v_Name } = data.context;
              let pkorg = {
                value: context.pk_org,
                display: context.org_Name,
              };
              props.form.setFormItemsValue(TEMPLATE.FORM_ID, {
                pk_org: { value: pk_org, display: org_Name },
                pk_org_v: { value: pk_org_v, display: org_v_Name },
              });
              that.props.resMetaAfterPkorgEdit();
              that.props.form.setFormItemsDisabled(TEMPLATE.FORM_ID, {
                pk_org: false,
              });
              afterEvent.call(
                that,
                that.props,
                TEMPLATE.FORM_ID,
                "pk_org",
                pkorg,
                null,
                null,
                null,
                true
              );
            } else {
              props.initMetaByPkorg();
            }
          } else if (!props.getUrlParam("status")) {
            props.initMetaByPkorg();
            props.form.setFormItemsDisabled(this.formId, { pk_org: true });
          }
        } else {
          props.initMetaByPkorg();
        }
      }
    }
  );
}

function modifierMeta(meta, props) {
  let formId = TEMPLATE.FORM_ID;
  let tableId1 = TEMPLATE.TABLE_DETAIL;
  let tableId2 = TEMPLATE.TABLE_GUARANTEE;
  let formId1 = TEMPLATE.FORM_BASE_ID;

  meta[formId].items.map((item) => {
    //发送发组织，接收方组织：根据用户权限过滤
    if (item.attrcode == "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }

    //继承授信协议
    if (item.attrcode == "inheritprotocol") {
      item.queryCondition = () => {
        let pk_creditbank = props.form.getFormItemsValue(formId, [
          "pk_creditbank",
        ])[0].value;
        let pk_org = props.form.getFormItemsValue(formId, ["pk_org"])[0].value;
        let pk_currtype = props.form.getFormItemsValue(formId, [
          "pk_currtype",
        ])[0].value;
        return {
          pk_org: pk_org, //当前受信人
          pk_creditbank: pk_creditbank, //同一授信银行
          pk_currtype: pk_currtype, //同一币种
          protocolstatus: "FINISHED", //已经结束的授信
          isinherit: "N", //未继承的授信协议
        };
      };
    }

    if (item.attrcode.indexOf("vdef") > -1) {
      item.queryCondition = (p) => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
        pk_org = pk_org && pk_org.value;
        let pk_group = this.props.form.getFormItemsValue(
          this.formId,
          "pk_group"
        );
        pk_group = pk_group && pk_group.value;
        return {
          pk_org,
          pk_group,
        };
      };
    }

    //资金计划项目
    if (item.attrcode == "pk_fundplan") {
      item.queryCondition = () => {
        let pk_org = props.form.getFormItemsValue(formId, ["pk_org"])[0].value;
        let pk_group = props.form.getFormItemsValue(formId, ["pk_group"])[0]
          .value;
        return {
          pk_org: pk_org,
          pk_group: pk_group,
        };
      };
    }
  });

  // /** 担保 **/
  meta[tableId2].items.map((item) => {
    if (item.attrcode == "guarantee") {
      item.queryCondition = () => {
        let beginDate = props.form.getFormItemsValue(formId, "begindate");
        let endDate = props.form.getFormItemsValue(formId, "enddate");
        return {
          guastartdate: beginDate && beginDate.value,
          guaenddate: endDate && endDate.value,
        };
      };
    }
  });
  // /** 授信明细侧拉 **/
  meta["tableDetailEdit"].items.map((item) => {
    //授信使用单位：用户有权限的组织
    if (item.attrcode == "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
    //表体贷款银行过滤
    if (item.attrcode == "pk_bankdoc") {
      item.isCacheable = false;
      item.queryCondition = () => {
        let pk_creditbank = props.form.getFormItemsValue(formId, [
          "pk_creditbank",
        ])[0].value; //组织
        let pk_bankdocs = null;
        if (pk_creditbank) {
          let data = { pk_bankdoc: pk_creditbank };
          ajax({
            url: "/nccloud/ccc/bankprotocol/BanPkRef.do",
            async: false,
            data: data,
            success: (res) => {
              if (res.data && res.data[0]) {
                pk_bankdocs = res.data[0].pk_banktype;
                console.log(pk_bankdocs);
              }
            },
          });
        }
        return {
          pk_banktype: pk_bankdocs,
        };
      };
    }
    //资金计划项目侧拉：
    if (item.attrcode == "pk_fundplan") {
      item.render = function (text, record, index) {
        return FundPlanTreeRef({
          queryCondition: () => {
            let pk_org = props.cardTable.getValByKeyAndIndex(
              tableId1,
              index,
              "pk_org"
            ).value;
            let pk_group = props.form.getFormItemsValue(formId, ["pk_group"])[0]
              .value;
            return {
              pk_org: pk_org,
              pk_group: pk_group,
            };
          },
        });
      };
    }
  });
  // /** 担保合约侧拉 **/
  meta["tableGuaranteeEdit"].items.map((item) => {
    if (item.attrcode == "guarantee") {
      item.queryCondition = () => {
        let pk_org = props.form.getFormItemsValue(formId, ["pk_org"])[0].value; //组织
        let begindate = props.form.getFormItemsValue(formId, ["begindate"])[0]
          .value; //开始日期
        let guaranteetype = props.form.getFormItemsValue(formId, [
          "guaranteetype",
        ])[0].value; //担保方式
        let pk_creditbank = props.form.getFormItemsValue(formId, [
          "pk_creditbank",
        ])[0].value; //授信银行
        let guatype = null;
        if (guaranteetype == "warrant") {
          guatype = 1;
        } else if (guaranteetype == "guaranty") {
          guatype = 2;
        } else if (guaranteetype == "pledge") {
          guatype = 3;
        } else if (guaranteetype == "mixed") {
          guatype = 4;
        }
        return {
          pk_org: pk_org,
          guastartdate: begindate,
          guaenddate: begindate,
          isprotocol: true,
          guatype: guatype,
          contracttype: "1",
          pk_creditor: pk_creditbank,
          //GridRefActionExt: 'nccloud.web.ccc.ref.builder.GuaranteeRefBuilder'
        };
      };
    }
  });
  let langData = this.props.MultiInit.getLangData("36610CC");
  for (let item of Object.keys(meta.gridrelation)) {
    meta[item].items.push({
      attrcode: "opr",
      label: langData && langData.json["36610CC-000016"] /* 国际化处理： 操作*/,
      itemtype: "customer",
      fixed: "right",
      className: "table-opr",
      visible: true,
      width: "210px",
      render: (text, record, index) => {
        let { isPaste } = this.state;
        let status = this.props.getUrlParam("status");
        let buttonAry = [];
        if (["add", "edit", "change", "copy"].includes(status)) {
          //编辑态
          buttonAry = isPaste
            ? ["copyThisRow"]
            : ["cela", "copy", "insert", "delete"];
        } else {
          //浏览态
          buttonAry = [record.expandRowStatus ? "fold" : "unfold"];
        }

        return this.props.button.createOprationButton(buttonAry, {
          area: tabs.bodyCode,
          buttonLimit: btnLimit,
          onButtonClick: (props, key) =>
            tableButtonClick.call(this, props, key, text, record, index),
        });
      },
    });
  }
  return meta;
}

//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz