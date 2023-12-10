//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz
import { ajax } from "nc-lightapp-front";
import { appCode } from "../../cons/constant.js";
import { buttonVisible } from "./buttonVisible";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";
import { afterEvent } from "./index";

export default function (props, callback) {
  let appCode = props.getSearchParam("c") || props.getUrlParam("c");
  props.createUIDom(
    {
      pagecode: this.pageId, //页面id
      appcode: appCode,
    },
    (data) => {
      if (data) {
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button, () => {
            buttonVisible.call(this, props);
          });
        }
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta.call(this, meta, props);
          props.meta.setMeta(meta);
          orgVersionView(props, this.formId);
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
              props.form.setFormItemsValue("form_execadj", {
                pk_org: { value: pk_org, display: org_Name },
                pk_org_v: { value: pk_org_v, display: org_v_Name },
              });
              afterEvent.call(
                this,
                props,
                "form_execadj",
                "pk_org",
                pkorg,
                null,
                null,
                null,
                true
              );
              this.props.resMetaAfterPkorgEdit();
              this.props.form.setFormItemsDisabled("form_execadj", {
                pk_org: false,
              });
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
        callback && callback();
      }
    }
  );
}

function modifierMeta(meta, props) {
  let status = this.props.getUrlParam("status");
  meta[this.formId].status = status;

  //参照过滤
  meta[this.formId].items.map((item) => {
    //发送方组织，接收方组织：根据用户权限过滤
    if (item.attrcode == "pk_org") {
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
    //授信使用单位根据用户权限过滤
    if (item.attrcode == "pk_usecompany") {
      item.queryCondition = () => {
        return {
          funcode: props.getSearchParam("c"), //appcode获取
          TreeRefActionExt:
            "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter",
        };
      };
    }
    //授信类别过滤
    if (item.attrcode == "pk_cctype") {
      item.queryCondition = () => {
        let pk_protocol = props.form.getFormItemsValue(this.formId, [
          "pk_protocol",
        ])[0].value;
        let pk_cctypes = null;
        if (pk_protocol) {
          let data = { pk: pk_protocol };
          ajax({
            url: "/nccloud/ccc/bankprotocol/CCTypeGridRef.do",
            async: false,
            data: data,
            success: (res) => {
              if (res.data) {
                let arr = res.data.join();
                if (arr && arr.length > 0) {
                  pk_cctypes = res.data.join();
                } else {
                  pk_cctypes = "null";
                }
              }
            },
          });
        }

        return {
          pk_cctype: pk_cctypes, //appcode获取
        };
      };
    }

    //授信协议
    if (item.attrcode == "pk_protocol") {
      item.queryCondition = () => {
        let pk_org = props.form.getFormItemsValue(this.formId, ["pk_org"])[0]
          .value;
        return {
          protocolstatus: "NOEXECUTE,EXECUTING",
          pk_org: pk_org,
        };
      };
    }

    //过滤贷款银行protocoltype
    if (item.attrcode == "pk_bankdoc") {
      item.queryCondition = () => {
        const pk_protocol = props.form.getFormItemsValue(
          this.formId,
          "pk_protocol"
        ).value;
        let pk_creditbank = null;
        let pk_bankdocs = null;
        pk_protocol &&
          ajax({
            url: "/nccloud/ccc/bankprotocol/ProtocolQuery.do",
            async: false, //此处必须要同步，保证pk_bankdocs被赋到值
            data: { pk: pk_protocol },
            success: (res) => {
              res.data && (pk_creditbank = res.data);
              pk_creditbank &&
                ajax({
                  url: "/nccloud/ccc/bankprotocol/BanPkRef.do",
                  async: false, //此处必须要同步，保证pk_bankdocs被赋到值
                  data: { pk_bankdoc: pk_creditbank },
                  success: (res) => {
                    if (res.data && res.data[0]) {
                      pk_bankdocs = res.data[0].pk_banktype;
                    }
                  },
                });
            },
          });
        return {
          pk_banktype: pk_bankdocs,
        };
      };
    }

    if (item.attrcode.indexOf("def") > -1) {
      item.queryCondition = (p) => {
        let pk_org = this.props.form.getFormItemsValue(this.formId, "pk_org");
        pk_org = pk_org && pk_org.value;
        let pk_group = this.props.form.getFormItemsValue(
          this.formId,
          "pk_group"
        );
        pk_group = pk_group && pk_group.value;
        return {
          pk_org: pk_org,
          pk_group: pk_group,
        };
      };
    }
  });

  return meta;
}

//pmFWCFu5nhKkBzYmrkBakf+lQVKdyk87KLwZjZQkFsqCT47On8r5AsmdJEIVPVDz