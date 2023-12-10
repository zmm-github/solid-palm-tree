//OWmq6Ugo6jPE4W7xoi1UXhDArbPBxo2bVte0t40e0oTxo72243X7MAOHHYWUnhZs
/**
 * 编辑后事件
 * @param {*} props     页面内置对象
 * @param {*} moduleId  区域id
 * @param {*} key       操作的键
 * @param {*} value     当前值
 * @param {*} oldvalue  旧值/新旧值集合
 */
import { ajax, toast } from "nc-lightapp-front";
import { baseReqUrl, javaUrl } from "../../cons/constant";
export default function afterEvent(props, moduleId, key, value, oldvalue) {
  console.log(key, value, oldvalue);
  let eventData = this.props.createHeadAfterEventData(
    this.pageId,
    this.formId,
    "",
    moduleId,
    key,
    value
  );
  switch (key) {
    case "pk_org":
      if (oldvalue == null || (value.value && value.value !== oldvalue.value)) {
        getAfterEvent.call(this, eventData, (res) => {
          props.resMetaAfterPkorgEdit();
          props.form.setAllFormValue({
            [this.formId]: res.data && res.data.head[this.formId],
          });
          this.props.form.setFormItemsValue(this.formId, {
            updatedir: {
              display: this.state.json["36610CCA-000000"],
              value: "USE",
            },
          }); /* 国际化处理： 占用*/
          this.props.form.setFormItemsValue(this.formId, {
            execadjstatus: {
              display: this.state.json["36610CCA-000001"],
              value: "NOSUB",
            },
          }); /* 国际化处理： 待提交*/
        });
      } else if (!value || !value.value) {
        //清空数据
        props.form.EmptyAllFormValue();
        props.initMetaByPkorg();
      }
      break;
    case "pk_cccurrtype":
      if (value.value !== oldvalue.value) {
        getAfterEvent.call(this, eventData, (res) => {
          props.form.setAllFormValue({
            [this.formId]: res.data && res.data.head[this.formId],
          });
        });
      }
    case "ccamount":
      if (value.value !== oldvalue.value) {
        if (+value.value < 0) {
          toast({
            color: "warning",
            content: this.state.json["36610CCA-000002"],
          }); /* 国际化处理： 金额必须大于零*/
          this.props.form.setFormItemsValue(this.formId, {
            ccamount: { display: "", value: "" },
          });
        } else {
          getAfterEvent.call(this, eventData, (res) => {
            props.form.setAllFormValue({
              [this.formId]: res.data && res.data.head[this.formId],
            });
          });
        }
      }
      break;
    case "pk_protocol":
      if (value.value !== oldvalue.value) {
        let proRefVal = value.values;
        getAfterEvent.call(this, eventData, (res) => {
          props.form.setAllFormValue({
            [this.formId]: res.data && res.data.head[this.formId],
          });
          const protocoltype = props.form.getFormItemsValue(
            this.formId,
            "protocoltype"
          ).value; //协议类型
          if (protocoltype === "1") {
            //企业授信
            props.form.setFormItemsValue(this.formId, {
              pk_bankdoc: {
                display: proRefVal && proRefVal.bankdocname.value,
                value: proRefVal && proRefVal.pk_creditbank.value,
              },
            });
            props.form.setFormItemsDisabled(this.formId, { pk_bankdoc: true });
          } else if (protocoltype === "2") {
            //集团授信
            props.form.setFormItemsValue(this.formId, {
              pk_bankdoc: { display: "", value: "" },
            });
            props.form.setFormItemsDisabled(this.formId, { pk_bankdoc: false });
          }
          let currtypeValue =
            res.data.head[this.formId].rows[0].values.pk_currtype &&
            res.data.head[this.formId].rows[0].values.pk_currtype.value;
          let currtypeOldValue = props.form.getFormItemsValue(
            this.formId,
            "pk_currtype"
          ).value;
          let mount =
            res.data.head[this.formId].rows[0].values.ccamount &&
            res.data.head[this.formId].rows[0].values.ccamount;
          afterEvent.call(
            this,
            props,
            moduleId,
            "pk_currtype",
            currtypeValue,
            currtypeOldValue
          );
          props.form.setFormItemsValue(this.formId, {
            ccamount: { value: mount.value, scale: mount.scale },
          });
        });
      }
      break;
    case "pk_currtype": // 币种
      if (value.value && value.value !== oldvalue.value) {
        getAfterEvent.call(this, eventData, (res) => {
          props.form.setAllFormValue({
            [this.formId]: res.data && res.data.head[this.formId],
          });
        });
      }
      break;
    default:
      break;
  }
}

function getAfterEvent(data, callback) {
  ajax({
    url: `${baseReqUrl}${javaUrl.afterevent}.do`,
    async: false,
    data: data,
    success: (res) => {
      if (res.success) {
        callback && callback(res);
      }
    },
  });
}

//OWmq6Ugo6jPE4W7xoi1UXhDArbPBxo2bVte0t40e0oTxo72243X7MAOHHYWUnhZs