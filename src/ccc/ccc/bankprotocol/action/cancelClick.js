//U2vE+7+Ip7MUZRC3b5c8MEqjieIsknRHDXnol3GsokOrfXPe8J/8j9P/SF/9WmE4
import { cardCache, promptBox } from "nc-lightapp-front";
import { toggleShow, getData } from "../card/events/page";
let { getCurrentLastId } = cardCache;
/**
 * 取消
 * @param {*} props
 *
 */
export default function cancelClick(props, pk) {
  //新增
  let id = pk;
  if (props.getUrlParam("status") === "add") {
    let last_pk = getCurrentLastId(this.dataSource);
    if (id) {
      last_pk = id;
    }
    if (last_pk) {
      cancel.call(this, props, last_pk);
    } else {
      cancel.call(this, props, null);
    }
  } else {
    // 编辑
    cancel.call(this, props, "", id);
  }
}

const cancel = function (props, last_pk, id) {
  promptBox({
    color: "warning",
    title: this.state.json["36610CC-000023"],
    content: this.state.json["36610CC-000024"] /* 国际化处理： 确定要取消吗*/,
    beSureBtnClick: () => {
      props.form.EmptyAllFormValue(this.formId);
      props.cardTable.setAllTabsData(null, this.tabOrder);
      props.setUrlParam({
        status: "browse",
        operate: null,
        id: last_pk ? last_pk : id,
      });
      toggleShow.call(this);
      getData.call(this);
    },
  });
};

//U2vE+7+Ip7MUZRC3b5c8MEqjieIsknRHDXnol3GsokOrfXPe8J/8j9P/SF/9WmE4