//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz
import { base } from "nc-lightapp-front";
let { NCTooltip } = base;
import { setDefOrg2AdvanceSrchArea } from "../../../../../tmpub/pub/util/index";
import { setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";
import tableButtonClick from "./tableButtonClick";
import buttonDisable from "./buttonDisable";
import { cardPageId } from "../../constant/constant.js";
export default function(props, json) {
  let that = this;
  props.createUIDom(
    {
      pagecode: "36610CC_L01" //页面code
    },
    function(data) {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta(that, props, meta, json);
          setDefOrg2AdvanceSrchArea(props, that.searchId, data); //高级查询区赋值
          props.meta.setMeta(meta);
          setDefOrg2ListSrchArea(props, that.searchId, data); //普通查询区赋值
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
          props.button.setPopContent(
            "deleteI",
            json["36610CC-000053"]
          ); /* 国际化处理： 确认要删除该信息吗？*/
          buttonDisable.call(that, props, that.tableId);
        }
      }
    }
  );
}

function modifierMeta(that, props, meta, json) {
  meta[that.tableId].pagination = true;
  //财务组织:全加载
  meta[that.searchId].items.find(
    e => e.attrcode === "pk_org"
  ).isTreelazyLoad = false;

  meta[that.searchId].items.map(item => {
    //发送发组织，接收方组织：根据用户权限过滤
    if (item.attrcode == "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
        };
      };
    } else if (item.attrcode.indexOf("vdef") > -1) {
      // 自定义项
      item.queryCondition = p => {
        let pk_org = that.props.search.getSearchValByField(
          that.searchId,
          "pk_org"
        ).value.firstvalue;
        return {
          pk_org
        };
      };
    }
  });

  meta[that.tableId].items = meta[that.tableId].items.map((item, key) => {
    if (item.attrcode == "protocolcode") {
      item.render = (text, record, index) => {
        return (
          <NCTooltip
            placement="top"
            overlay={record.bill_no ? record.bill_no.value : ""}
          >
            <a
              style={{ cursor: "pointer" }}
              onClick={() => {
                props.pushTo("/card", {
                  status: "browse",
                  id: record.pk_protocol.value,
                  pagecode: cardPageId
                });
                that.setStateCache();
              }}
            >
              {record && record.protocolcode && record.protocolcode.value}
            </a>
          </NCTooltip>
        );
      };
    }
    return item;
  });

  //添加操作列
  meta[that.tableId].items.push({
    attrcode: "opr",
    label: json["36610CC-000016"] /* 国际化处理： 操作*/,
    width: 250,
    fixed: "right",
    className: "table-opr",
    visible: true,
    itemtype: "customer",
    render: (text, record, index) => {
      return props.button.createErrorButton({
        record: record,
        showBack: false, // 是否显示回退按钮
        sucessCallBack: () => {
          let buttonAry =
            record.protocolstatus.value == "NOCOMMIT" //待提交
              ? ["submitI", "editI", "deleteI"]
              : record.protocolstatus.value == "NOAUDIT" //待审批
              ? ["withdrawI"]
              : record.protocolstatus.value == "NOEXECUTE" //未执行
              ? ["withdrawI"]
              : record.protocolstatus.value == "FINISHED" //已结束
              ? ["unterminateI"]
              : record.protocolstatus.value == "FROZEN" //已冻结
              ? ["unfrozenI"]
              : record.protocolstatus.value == "EXECUTING" &&
                record.vbillstatus.value == "1" //在执行 and 审批通过
              ? ["changeI", "frozenI", "terminateI"]
              : record.protocolstatus.value == "EXECUTING" &&
                record.vbillstatus.value == "-1" //在执行 and 自由态
              ? ["submitI", "editI"]
              : record.protocolstatus.value == "EXECUTING" &&
                record.vbillstatus.value == "3" //在执行 and 提交
              ? ["withdrawI"]
              : [];
          return props.button.createOprationButton(buttonAry, {
            area: "list_inner",
            buttonLimit: 3,
            onButtonClick: (props, key) =>
              tableButtonClick.call(that, props, key, text, record, index)
          });
        }
      });
    }
  });
  return meta;
}

//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz