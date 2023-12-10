//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz
//引入tmpub下的这两个方法
import {
  setDefOrg2AdvanceSrchArea,
  setDefOrg2ListSrchArea
} from "../../../../../tmpub/pub/util/index";
import { btnLimit, card, list } from "../../cons/constant.js";
import { bodyButtonClick } from "./bodyButtonClick";

export default function(json, props) {
  let appCode = props.getSearchParam("c") || props.getUrlParam("c");
  let that = this;
  props.createUIDom(
    {
      pagecode: this.pageId, //页面code
      appcode: appCode
    },
    data => {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, props, meta, json);
          //给高级查询区域赋默认业务单元(在setMeta之前使用)
          setDefOrg2AdvanceSrchArea(props, that.searchId, data);
          props.meta.setMeta(meta);
          //给列表查询区域赋默认业务单元(在setMeta之后使用)
          setDefOrg2ListSrchArea(props, that.searchId, data);
        }
        if (data.button) {
          /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent(
            "delete",
            json["36610CCA-000035"]
          ); /* 国际化处理： 确认要删除吗?*/
          // props.button.setButtonVisible('Commit', false);
        }
      }
    }
  );
}

function modifierMeta(props, meta, json) {
  //参照过滤
  meta[this.searchId].items.map(item => {
    //发送方组织，接收方组织：根据用户权限过滤
    if (item.attrcode == "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    }
    // //授信协议
    if (item.attrcode == "pk_protocol") {
      item.queryCondition = () => {
        let pk_org = props.search.getSearchValByField(this.searchId, "pk_org")
          .value.firstvalue;
        return {
          protocolstatus: "NOEXECUTE,EXECUTING",
          ischecksagafrozen: "false", // 不需要过滤冻结状态单据的前端必须传此过滤条件
          pk_org: pk_org
        };
      };
    }
    // 自定义项
    if (item.attrcode.indexOf("vdef") > -1) {
      item.queryCondition = p => {
        let pk_org = props.search.getSearchValByField(this.searchId, "pk_org")
          .value.firstvalue;
        return {
          pk_org
        };
      };
    }
  });
  meta[this.tableId].pagination = true;
  //操作列点击事件
  meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
    if (item.attrcode == "pk_protocol") {
      item.render = (text, record, index) => {
        return (
          <a
            style={{ color: "#007ace", cursor: "pointer" }}
            onClick={() => {
              props.pushTo("/card", {
                status: "browse",
                id: record[this.primaryId].value,
                pagecode: card.pageCode
              });
            }}
          >
            {record && record.pk_protocol && record.pk_protocol.display}
          </a>
        );
      };
    }
    return item;
  });

  //添加操作列
  meta[this.tableId].items.push({
    itemtype: "customer",
    attrcode: "opr",
    label: json["36610CCA-000036"] /* 国际化处理： 操作*/,
    width: 200,
    fixed: "right",
    className: "table-opr",
    visible: true,
    render: (text, record, index) => {
      return props.button.createErrorButton({
        record: record,
        showBack: false, // 是否显示回退按钮
        sucessCallBack: () => {
          let buttonAry = [];
          let busistatus = record.vbillstatus && record.vbillstatus.value;
          switch (busistatus) {
            case "-1": //自由态
              buttonAry = ["commit", "edit", "delete"];
              break;
            case "0": //保存态
              buttonAry = ["edit", "commit", "uncommit"];
              break;
            case "1": //审批通过
              buttonAry = ["uncommit"];
              break;
            case "3": //提交态
              buttonAry = ["uncommit"];
              break;
          }
          return props.button.createOprationButton(buttonAry, {
            area: list.bodyCode,
            buttonLimit: btnLimit,
            onButtonClick: (props, key) =>
              bodyButtonClick.call(this, key, record, index)
          });
        }
      });
    }
  });
  return meta;
}

//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz