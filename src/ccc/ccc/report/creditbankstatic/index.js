//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
/*
 * @Author: shixin6
 * @PageInfo: 银行存款日记账
 * @Date: 2018-07-04 12:23:05
 */
import { createPage } from "nc-lightapp-front";
import { SimpleReport } from "nc-report";
import React, { Component } from "react";
import ReactDOM from "react-dom";
class CreditBankStaticQuery extends Component {
  constructor(props) {
    super(props);
  }

  setDefaultVal(searchId, props, flag, template) {
    let meta = template.template;
    let org_Name = template.context.org_Name;
    let pk_org = template.context.pk_org;
    meta["light_report"].items.map(item => {
      if (item.attrcode == "pk_org") {
        item.initialvalue = { display: org_Name, value: pk_org };
      }
    });
  }
  /**
   *  参照过滤
   * @param {*} meta
   * @param {*} props
   */
  disposeSearch(meta, props) {
    //财务组织，类别多选
    // meta['light_report'].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
    // meta['light_report'].items.find((e) => e.attrcode === 'pk_bankdoc').isMultiSelectedEnabled = true;

    //财务组织:全加载
    // meta['light_report'].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;

     let items = meta['light_report'].items;
     items.forEach((item) => {
     //财务组织
       if (item.attrcode == 'pk_org') {
         item.queryCondition = () => {
           return {
             funcode: '36610CBS',
             TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
           };
         };
       }
     });
    return meta; // 处理后的过滤参照返回给查询区模板
  }

  /**
   * searchId: 查询区需要的searchId参数
   * 'vname': 需要附默认值的字段
   * {value: '111'}: 显示值，区间为[]，具体可以对照平台查询区修改
   * 'like': 为oprtype字段值
   */
  setDefaultVal(searchId, props) {
    // ajax({
    //   url: '/nccloud/cmp/report/orgdefault.do',
    //   success: (res) => {
    //     //查询财务组织设置默认值
    //     if (res.data) {
    //       props.search.setSearchValByField(searchId, 'pk_org', { value: res.data.value, display: res.data.display });
    //     }
    //   }
    // });
  }

  /**
   *  //查询区编辑后事件
   * props: props
   * searchId: 查询区需要的searchId参数
   * field: 编辑后的key
   * val: 编辑后的value
   */
  onAfterEvent(props, searchId, field, val) {
    // if (field == 'pk_org') {
    //   props.search.setSearchValByField(searchId, 'pk_account', { value: null });
    // }
  }

  /**
   * transSaveObject: transSaveObject参数
   * obj: 点击的联查item信息
   * data: 联查需要的参数
   * props: 平台props
   * url: 平台openTo第一个参数
   * urlParams: 平台openTo第二个参数
   * sessonKey: sessionStorage的key
   */
  setConnectionSearch(
    transSaveObject,
    obj,
    data,
    props,
    url,
    urlParams,
    sessonKey
  ) {
    if (obj && obj.key) {
      props.openTo(url, urlParams);
    }
  }

  render() {
    return (
      <div className="table">
        <SimpleReport
          showAdvBtn={true}
          setDefaultVal={this.setDefaultVal.bind(this)}
          disposeSearch={this.disposeSearch.bind(this)}
          onAfterEvent={this.onAfterEvent.bind(this)}
          setConnectionSearch={this.setConnectionSearch.bind(this)}
        />
      </div>
    );
  }
}
CreditBankStaticQuery = createPage({
  // mutiLangCode: '36070REPORT'
})(CreditBankStaticQuery);

export default CreditBankStaticQuery;
ReactDOM.render(<CreditBankStaticQuery />, document.getElementById("app"));

//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=