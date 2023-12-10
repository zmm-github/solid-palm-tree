//zPpBovT29EyoCeGjE4sa1SxOWyB+laCJdN0l4GcqN3YHNmNjbVdbS8+efSFCfwNC
import { ajax, toast } from "nc-lightapp-front";
import { searchBtnClick } from "./search";
import { card, baseReqUrl, javaUrl } from "../../cons/constant.js";
import { BusinessInnerOperator } from "./BusinessOperator";
import { orgVersionView } from "../../../../../tmpub/pub/util/version/index";

/**
 * table-button点击事件
 * @param {*} key     注册按钮编码
 * @param {*} record  当前单据的全数据
 */
export function bodyButtonClick(key, record, index) {
  this.innerTs = record.ts.value;
  switch (key) {
    case "edit": //修改
      editBill.call(this, record);
      break;
    case "delete": //删除
      BusinessInnerOperator(
        this,
        key,
        this.props,
        record,
        index,
        this.tableId,
        this.pageId,
        baseReqUrl + javaUrl.delete,
        this.state.json["36610CCA-000016"]
      ); /* 国际化处理： 删除成功！*/
      break;
    case "commit": //提交
      BusinessInnerOperator(
        this,
        key,
        this.props,
        record,
        index,
        this.tableId,
        this.pageId,
        baseReqUrl + javaUrl.commit,
        this.state.json["36610CCA-000017"]
      ); /* 国际化处理： 提交成功！*/
      break;
    case "uncommit": //收回
      BusinessInnerOperator(
        this,
        key,
        this.props,
        record,
        index,
        this.tableId,
        this.pageId,
        baseReqUrl + javaUrl.uncommit,
        this.state.json["36610CCA-000018"]
      ); /* 国际化处理： 收回成功！*/
      break;
    default:
      break;
  }
}

/**
 * 修改
 * @param {*} data         数据
 */
function editBill(record) {
  this.props.pushTo("/card", {
    status: "edit",
    id: record[this.primaryId].value,
    pagecode: card.pageCode
  });
  orgVersionView(this.props, "form_execadj");
}

/**
 * 按钮交互
 * @param {*} data         数据
 * @param {*} path         接口地址
 * @param {*} content      toast弹框显示内容
 * @param {*} isBatch      是否是批量操作
 */
export function bodyBtnOperation(data, path, content, isBatch = false) {
  if (isBatch && !data.pks.length) {
    toast({
      color: "warning",
      content: this.state.json[
        "36610CCA-000019"
      ] /* 国际化处理： 请选择至少一条数据!*/
    });
    return;
  }
  ajax({
    url: `${baseReqUrl}${path}.do`,
    data,
    success: res => {
      if (res.success) {
        toast({ color: "success", content });
        searchBtnClick.call(this, this.props, null, false, false);
        if (path === javaUrl.delete) {
          let { deleteCacheId } = this.props.table;
          deleteCacheId(this.tableId, data.pks[0]);
        }
      }
    }
  });
}

//zPpBovT29EyoCeGjE4sa1SxOWyB+laCJdN0l4GcqN3YHNmNjbVdbS8+efSFCfwNC