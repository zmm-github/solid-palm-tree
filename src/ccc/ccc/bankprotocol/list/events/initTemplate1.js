//sQld1OaD34tZblwSuoZXp+Xcd1rdaL9z/xmWCum54US2EBG0/K3QNJl+53D27VYK
import { base } from "nc-lightapp-front";
import { cardPageId } from "../../constant/constant.js";
let { NCTooltip } = base;
export default function(props, callback) {
  let that = this;
  props.createUIDom(
    {
      pagecode: "36610CCL_Link" //页面code
    },
    function(data) {
      if (data) {
        if (data.template) {
          let meta = data.template;
          meta = modifierMeta(that, props, meta);
          props.meta.setMeta(meta);
        }
        if (data.button) {
          let button = data.button;
          props.button.setButtons(button);
        }
        callback && callback();
      }
    }
  );
}

function modifierMeta(that, props, meta) {
  meta[that.tableId].pagination = true;
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
                  showBackBtn: true,
                  pagecode: cardPageId
                });
                props.setUrlParam({
                  scene: "linksce",
                  ntbparadimvo: that.ntbparadimvo
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
  return meta;
}

//sQld1OaD34tZblwSuoZXp+Xcd1rdaL9z/xmWCum54US2EBG0/K3QNJl+53D27VYK