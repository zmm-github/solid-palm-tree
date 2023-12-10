//LIrQHD0E7YfrpqrP0180quyA1f3B+UZ7YE6pzxTs8Zg=
import { ajax, cardCache, toast } from "nc-lightapp-front";
import { buttonVisible } from "./buttonVisible";
import { baseReqUrl, javaUrl } from "../../cons/constant.js";
let { getCacheById, updateCache } = cardCache;

/**
 * 新增
 * @param {*} props  页面内置对象
 * @param {*} pks    下一页的pks
 */
export function pageClick(props, pks) {
  getCardData.call(this, pks);
  props.setUrlParam(pks);
}

/**
 * 新增
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 * @param {*} callback   成功回调函数
 */
export function getCardData(id, isFirst = false, isRefresh = false,callback) {
  this.props.setUrlParam({ id: id });
  let cardData = getCacheById(id, this.dataSource);
  let status = this.props.getUrlParam("status");
  if (cardData && !isRefresh) {
    //有缓存且不是刷新按钮
    let billno = cardData.head[this.formId].rows[0].values.vbillno.value;
    if (status !== "browse") {
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: false,
        billCode: billno
      });
    } else {
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: true,
        showBillCode: true,
        billCode: billno
      });
    }
    this.props.form.setAllFormValue({
      [this.formId]: cardData.head[this.formId]
    });
    // 默认处理
    buttonVisible.call(this, this.props);
    return;
  }
  let url = `${baseReqUrl}${javaUrl.card}.do`;
  ajax({
    url: url,
    data: {
      pk: id,
      pageCode: this.pageId
    },
    success: res => {
      let { success, data } = res;
      if (success) {
        if (data && data.head) {
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId]
          });
          let billno = res.data.head[this.formId].rows[0].values.vbillno.value;
          if (status !== "browse") {
            this.props.BillHeadInfo.setBillHeadInfoVisible({
              showBackBtn: false,
              billCode: billno
            });
          } else {
            this.props.BillHeadInfo.setBillHeadInfoVisible({
              showBackBtn: true,
              showBillCode: true,
              billCode: billno
            });
          }
          const temp_probankdoc = this.props.form.getFormItemsValue(
            this.formId,
            "temp_probankdoc"
          );
          const protocoltype = this.props.form.getFormItemsValue(
            this.formId,
            "protocoltype"
          ).value; //协议类型
          if (protocoltype === "1") {
            //企业授信
            this.props.form.setFormItemsDisabled(this.formId, {
              pk_bankdoc: true
            });
            this.props.form.setFormItemsValue(this.formId, {
              pk_bankdoc: temp_probankdoc
            });
          }
        }
        callback && callback()
        buttonVisible.call(this, this.props);
        // 更新缓存
        updateCache(this.primaryId, id, data, this.formId, this.dataSource);
      }
    },
    error: res => {
      toast({ color: "danger", content: res.message && res.message.message });
    }
  });
}
/**
 * 复制
 * @param {*} id         单据id
 * @param {*} isFirst    是否首次进入，是(didmount)的话要addCache，否updateCache, 默认否
 * @param {*} isRefresh  是否刷新按钮，是的话不取缓存数据，直接调取接口，并addCache, 默认否
 */
export function getCopyCardData(id, isFirst = false, isRefresh = false) {
  let status = this.props.getUrlParam("status");
  let url = `${baseReqUrl}${javaUrl.copy}.do`;
  let pks = [];
  pks.push(id);
  ajax({
    url: url,
    data: {
      pks: pks,
      pageCode: this.pageId
    },
    success: res => {
      let { success, data } = res;
      if (success) {
        if (data && data.head) {
          this.props.form.setAllFormValue({
            [this.formId]: data.head[this.formId]
          });
          let billno = res.data.head[this.formId].rows[0].values.vbillno.value;
          if (status !== "browse") {
            this.props.BillHeadInfo.setBillHeadInfoVisible({
              showBackBtn: false,
              billCode: billno
            });
          } else {
            this.props.BillHeadInfo.setBillHeadInfoVisible({
              showBackBtn: true,
              showBillCode: true,
              billCode: billno
            });
          }
          // const temp_probankdoc = this.props.form.getFormItemsValue(
          //   this.formId,
          //   "temp_probankdoc"
          // );
          const protocoltype = this.props.form.getFormItemsValue(
            this.formId,
            "protocoltype"
          ).value; //协议类型
          if (protocoltype === "1") {
            //企业授信
            this.props.form.setFormItemsDisabled(this.formId, {
              pk_bankdoc: true
            });
            // this.props.form.setFormItemsValue(this.formId, {
            //   pk_bankdoc: temp_probankdoc
            // });
          }
        }
        buttonVisible.call(this, this.props);
      }
    },
    error: res => {
      toast({ color: "danger", content: res.message && res.message.message });
    }
  });
}
/**
 * 处理是否可计量的联动效果
 * @param {*} bool         是否Disabled
 * @param {*} isSetVal     是否改变值
 */
export function resolveMeasurable(bool, isSetVal = false) {
  this.props.form.setFormItemsDisabled(this.formId, {
    p_specno: bool, //规格型号
    p_count: bool, //数量
    p_unit: bool, //单位
    p_price: bool, //单价
    p_quality: bool, //质量
    p_status: bool, //状况
    p_location: bool, //所在地

    datasource: true, //物权数据来源
    totalpledge: true, //累计已质（抵）押价值
    restpledge: true, //剩余质（抵）押价值
    srcbillno: true //来源单据号
  });
  if (isSetVal) {
    this.props.form.setFormItemsValue(this.formId, {
      p_specno: { display: null, value: null }, //规格型号
      p_count: { display: null, value: null }, //数量
      p_unit: { display: null, value: null }, //单位
      p_price: { display: null, value: null }, //单价
      p_quality: { display: null, value: null }, //质量
      p_status: { display: null, value: null }, //状况
      p_location: { display: null, value: null } //所在地
    });
  }
}

//LIrQHD0E7YfrpqrP0180quyA1f3B+UZ7YE6pzxTs8Zg=