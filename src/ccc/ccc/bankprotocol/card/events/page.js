//LIrQHD0E7YfrpqrP0180quyA1f3B+UZ7YE6pzxTs8Zg=
import { ajax, cardCache } from "nc-lightapp-front";
import {
  ACTION_URL,
  CONST_CARD,
  tabs,
  ListPageId,
  PK_CODE,
} from "../../constant/constant";
import { versionControl } from "../../Util";
import { getEndDate, setBodyDisabledByCreditType } from "./afterEvent";
import { afterSetData } from "./buttonClick";
import buttonVisible from "./buttonVisible";
import initTemplate from "./initTemplate";
import initTemplate1 from "./initTemplate1";
import initTemplate2 from "./initTemplate2";
import tableButtonClick from "./tableButtonClick";
import { BusinessOperator } from "./BusinessOperator";
let { getCurrentLastId, getCacheById, updateCache, addCache } = cardCache;

/**
 * 银行授信协议卡片页页面相关事件
 * @author dongyue7
 * @status 持续重构中
 */

export function afterGetLang(props) {
  if (this.props.getUrlParam("scene") == "approvesce") {
    initTemplate1.call(this, props, () => {
      let id = this.props.getUrlParam("id");
      this.setState({ showPagination: false });
      this.billID = id;
      getData.call(this);
      toggleShow.call(this);
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
      });
    });
  } else if (
    this.props.getUrlParam("scene") == "linksce" ||
    this.props.getUrlParam("ntbparadimvo")
  ) {
    initTemplate2.call(this, props, () => {
      let id = this.props.getUrlParam("id");
      this.setState({ showPagination: false });
      this.billID = id;
      getData.call(this);
      toggleShow.call(this);
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        showBackBtn:
          this.props.getUrlParam("showBackBtn") == true ? true : false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
      });
    });
  } else {
    initTemplate.call(this, props, () => {
      getData.call(this);
      toggleShow.call(this);
    });
  }
}

//切换页面状态
export function toggleShow() {
  // 组织版本
  versionControl(this.props);
  let status = this.props.getUrlParam("status");
  let isChange = this.props.getUrlParam("operate");
  //协议类型
  let protocoltype = this.props.form.getFormItemsValue(
    this.formId,
    "protocoltype"
  );
  //错误弹出信息
  let sagaGtxid = this.props.form.getFormItemsValue(this.formId, "saga_gtxid");
  let sagaStatus = this.props.form.getFormItemsValue(
    this.formId,
    "saga_status"
  );
  if (sagaGtxid && sagaStatus && sagaStatus.value == "1") {
    this.props.socket.showToast({
      gtxid: sagaGtxid.value,
      billpk: this.props.form.getFormItemsValue(this.formId, PK_CODE).value,
    });
  }
  protocoltype = protocoltype && protocoltype.value;
  if (status !== "browse") {
    this.props.cardTable.setStatus(this.tableId1, "edit");
    this.props.cardTable.setStatus(this.tableId2, "edit");
    this.props.form.setFormStatus(this.formId, "edit");
    this.props.BillHeadInfo.setBillHeadInfoVisible({
      showBackBtn: false, //控制显示返回按钮: true为显示,false为隐藏 ---非必传
      showBillCode: false, //控制显示单据号：true为显示,false为隐藏 ---非必传
    });
    //表体：以下字段不可编辑
    this.props.cardTable.setColEditableByKey(
      this.tableId1,
      ["pk_org_v", "pk_currtype", "pk_bankdoc", "pk_fundplan"],
      isChange === "change"
    );
    //变更
    //表头：以下字段不可编辑
    this.props.form.setFormItemsDisabled(this.formId, {
      pk_org: isChange === "change",
      pk_org_v: isChange === "change",
      protocolcode: isChange === "change",
      pk_creditbank: isChange === "change",
      pk_currtype: isChange === "change",
      protocoltype: isChange === "change",
      olcrate: isChange === "change",
      usetype: isChange === "change",
      inheritprotocol: isChange === "change",
      summary: isChange === "change",
      periodcount: isChange === "change",
      periodunit: isChange === "change",
      begindate: isChange === "change",
      enddate: isChange === "change",
      pk_fundplan: isChange === "change",
      credittypecontral: isChange === "change",
      creditbankcontral: isChange === "change",
      creditunitcontral: isChange === "change" || protocoltype === "1",
    });
  } else {
    this.props.cardTable.setStatus(this.tableId1, status);
    this.props.cardTable.setStatus(this.tableId2, status);
    this.props.form.setFormStatus(this.formId, status);
    let last_pk = getCurrentLastId(this.dataSource);
    if (last_pk == null) {
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        billCode: "",
      });
    }
    this.props.BillHeadInfo.setBillHeadInfoVisible({
      showBackBtn: true,
      showBillCode: true,
    });
    this.props.cardTable.toggleTabTable &&
      this.props.cardTable.toggleTabTable(this.tabCode); //浏览态关闭展开侧拉框
    this.props.cardTable.closeModel(this.tabCode); //编辑态关闭展开侧拉框
  }
  if (status === "edit" || status === "copy") {
    this.props.form.setFormItemsDisabled(this.formId, { pk_org: true }); //财务组织
    this.props.cardTable.setStatus(this.tabCode, "edit");
    setBodyDisabledByCreditType.call(this, protocoltype);
  }
  buttonVisible.call(this, this.props);
}

//卡片返回按钮
export function handleClick() {
  let backType = this.props.getUrlParam("backType");
  if (backType && backType === "card") {
    this.props.setUrlParam({ pageType: "", backType: "" });
    this.state.newestVersion &&
      onTreeSelect.call(this, this.state.newestVersion);
    if (this.state.isVersion) {
      this.setState({ isVersion: false });
      this.setState({ isVersion: false }, () => {
        getData.call(this);
      });
    }
  } else {
    //先跳转列表
    this.props.pushTo("/list", {
      status: "browse",
      scene: this.props.getUrlParam("scene"),
      pk_ntbparadimvo: this.props.getUrlParam("pk_ntbparadimvo"),
      showntbparadimvo: this.props.getUrlParam("ntbparadimvo"),
      pagecode: ListPageId,
    });
  }
}

/**
 * 卡片数据查询
 * @param {Function} callback - 成功回掉函数
 */
export function getData(callback) {
  let status = this.props.getUrlParam("status");
  if (status == "add") {
    this.props.form.EmptyAllFormValue(this.formId);
    this.props.cardTable.setAllTabsData(null, this.tabOrder);
  }
  if (status == "browse") {
    //浏览态
    let pk = this.props.getUrlParam("id");
    if (!pk) return;
    let pks = [];
    pks.push(pk);
    if (pks.length > 0) {
      let data = { pk: pk, pageCode: this.pageId };
      ajax({
        url: ACTION_URL.QUERY_BY_PK,
        data: data,
        success: (res) => {
          if (res.data) {
            if (res.data.head) {
              this.props.form.setAllFormValue({
                [this.formId]: res.data.head[this.formId],
              });
              let billno =
                res.data.head[this.formId].rows[0].values.protocolcode.value;
              this.props.BillHeadInfo.setBillHeadInfoVisible({
                billCode: billno,
              });
            }
            if (res.data.bodys) {
              this.props.cardTable.setAllTabsData(
                res.data.bodys,
                this.tabOrder,
                afterSetData.bind(
                  this,
                  this.props,
                  Object.keys(res.data.bodys)
                ),
                Object.keys(res.data.bodys)
              );
              if(res.data.bodys.table_credit){
                res.data.bodys.table_credit.rows.forEach((item)=>{
                  if(item.values.vdef3.value==='NOCOMMIT'){
                    item.values.vdef3.display='待提交';
                  }else if(item.values.vdef3.value==='NOAUDIT'){
                    item.values.vdef3.display='待审批';
                  }else if(item.values.vdef3.value==='NOEXECUTE'){
                    item.values.vdef3.display='未使用';
                  }else if(item.values.vdef3.value==='EXECUTING'){
                    item.values.vdef3.display='使用中';
                  }else if(item.values.vdef3.value==='FINISHED'){
                    item.values.vdef3.display='已结束';
                  }else{
                    item.values.vdef3.display='已冻结';
                  }
                })
                this.props.cardTable.setTableData(tabs.tabCreCode,{rows:res.data.bodys.table_credit.rows})
              }
              
            }
            callback && callback();
            let cacheflag = getCacheById(pk, CONST_CARD.CacheKey);
            if (cacheflag) {
              updateCache(
                this.billPK,
                pks,
                res.data,
                this.formId,
                CONST_CARD.CacheKey
              );
            } else {
              addCache(pk, res.data, this.formId, CONST_CARD.CacheKey);
            }
          } else {
            this.props.form.setAllFormValue({
              [this.formId]: { rows: [] },
            });
            this.props.cardTable.setAllTabsData(null, this.tabOrder);
          }
          buttonVisible.call(this, this.props);
          // 设置当前界面不可编辑
          this.props.form.setFormStatus(this.formId, "browse");
          this.tabOrder.forEach((tableId) => {
            this.props.cardTable.setStatus(tableId, "browse");
          });
        },
      });
    } else {
      this.props.BillHeadInfo.setBillHeadInfoVisible({
        billCode: "",
      });
    }
  }
  if (status == "edit") {
    //编辑态
    let data = { pk: this.props.getUrlParam("id"), pageCode: this.pageId };
    ajax({
      url: ACTION_URL.QUERY_BY_PK,
      data: data,
      success: (res) => {
        if (res.data) {
          if (res.data.head) {
            this.props.form.setAllFormValue({
              [this.formId]: res.data.head[this.formId],
            });
            let billno =
              res.data.head[this.formId].rows[0].values.protocolcode.value;
            this.props.BillHeadInfo.setBillHeadInfoVisible({
              billCode: billno,
            });
            let protocoltype = this.props.form.getFormItemsValue(
              this.formId,
              "protocoltype"
            );
            //集团授信时使用单位控制可以编辑
            if (protocoltype && protocoltype.value == "2") {
              this.props.form.setFormItemsDisabled(this.formId, {
                creditunitcontral: false,
              });
            }
          }
          if (res.data.bodys) {
            this.props.cardTable.setAllTabsData(
              res.data.bodys,
              this.tabOrder,
              null,
              Object.keys(res.data.bodys)
            );
          }
        } else {
          this.props.form.setAllFormValue({
            [this.formId]: { rows: [] },
          });
          this.props.cardTable.setAllTabsData(null, this.tabOrder);
        }
        //处理分授信三个按钮的编辑后事件
        let isTypeContral = this.props.form.getFormItemsValue(
          this.formId,
          "credittypecontral"
        ); //分授信类别credittype
        let isBankContral = this.props.form.getFormItemsValue(
          this.formId,
          "creditbankcontral"
        ); //分贷款银行pk_bankdoc
        let isUnitControl = this.props.form.getFormItemsValue(
          this.formId,
          "creditunitcontral"
        ); //分授信单位pk_org_v
        let isArr = [
          {
            value: isTypeContral.value,
            key: "credittype",
            display: this.state.json["36610CC-000013"],
          } /* 国际化处理： 授信类别*/,
          {
            value: isBankContral.value,
            key: "pk_bankdoc",
            display: this.state.json["36610CC-000014"],
          } /* 国际化处理： 贷款银行*/,
          {
            value: isUnitControl.value,
            key: "pk_org_v",
            display: this.state.json["36610CC-000015"],
          } /* 国际化处理： 授信使用单位*/,
        ];
        for (let item in isArr) {
          if (isArr[item].value) {
            this.props.cardTable.setColEditableByKey(
              this.tableId1,
              isArr[item].key,
              false
            );
          } else {
            this.props.cardTable.setColValue(this.tableId1, isArr[item].key, {
              display: "",
              value: "",
            });
            this.props.cardTable.setColEditableByKey(
              this.tableId1,
              isArr[item].key,
              true
            );
          }
        }
      },
    });
  }
  if (status == "copy") {
    //复制
    let pk = this.props.getUrlParam("id");
    let pks = [];
    pks.push(pk);
    //let data = { pk: this.props.getUrlParam('id'), pageCode: this.pageId };
    let data = { pks: pks, pageCode: this.pageId };
    ajax({
      url: ACTION_URL.COPY,
      data: data,
      success: (res) => {
        console.log('success：'+res)
        if (res.data) {
          if (res.data.head) {
            this.props.form.setAllFormValue({
              [this.formId]: res.data.head[this.formId],
            });
           
            let { protocolcode, protocoltype } = res.data.head[
              this.formId
            ].rows[0].values;
            // 单据号
            protocolcode = protocolcode && protocolcode.value;
            // 协议类型
            protocoltype = protocoltype && protocoltype.value;
            // 设置当前单据头部单据号显示
            this.props.BillHeadInfo.setBillHeadInfoVisible({
              billCode: protocolcode,
            });
            //协议类型 控制 集团授信时使用单位 的编辑性
            if (protocoltype == "2") {
              this.props.form.setFormItemsDisabled(this.formId, {
                creditunitcontral: false,
              });
            } else {
              this.props.form.setFormItemsDisabled(this.formId, {
                creditunitcontral: true,
              });
            }
          }
          if (res.data.bodys) {
            this.props.cardTable.setAllTabsData(
              res.data.bodys,
              this.tabOrder,
              null,
              Object.keys(res.data.bodys)
            );
          }
          toggleShow.call(this);
          this.props.form.setFormItemsDisabled(this.formId, {
            pk_org: true,
          });
          getCreditSum.call(this,res.data.head.form_info.rows[0].values.pk_org.value);
        } else {
          this.props.form.setAllFormValue({
            [this.formId]: { rows: [] },
          });
          this.props.cardTable.setAllTabsData(null, this.tabOrder);
        }
        //处理分授信三个按钮的编辑后事件
        let isTypeContral = this.props.form.getFormItemsValue(
          this.formId,
          "credittypecontral"
        ); //分授信类别credittype
        let isBankContral = this.props.form.getFormItemsValue(
          this.formId,
          "creditbankcontral"
        ); //分贷款银行pk_bankdoc
        let isUnitControl = this.props.form.getFormItemsValue(
          this.formId,
          "creditunitcontral"
        ); //分授信单位pk_org_v
        let isArr = [
          {
            value: isTypeContral.value,
            key: "credittype",
            display: this.state.json["36610CC-000013"],
          } /* 国际化处理： 授信类别*/,
          {
            value: isBankContral.value,
            key: "pk_bankdoc",
            display: this.state.json["36610CC-000014"],
          } /* 国际化处理： 贷款银行*/,
          // {
          //     value: isUnitControl.value,
          //     key: "pk_org_v",
          //     display: this.state.json["36610CC-000015"]
          // } /* 国际化处理： 授信使用单位*/
        ];
        for (let item in isArr) {
          if (isArr[item].value) {
            this.props.cardTable.setColEditableByKey(
              this.tableId1,
              isArr[item].key,
              false
            );
          } else {
            this.props.cardTable.setColValue(this.tableId1, isArr[item].key, {
              display: "",
              value: "",
            });
            this.props.cardTable.setColEditableByKey(
              this.tableId1,
              isArr[item].key,
              true
            );
          }
        }
        

      },
    });

    
  }
}

export function getCreditSum(pk_org){
    ajax({
      url:`/nccloud/ccc/bankprotocol/credit.do`,
      data: pk_org,
      success: (res) => {
          this.props.cardTable.setTableData(tabs.tabCreCode,{rows: []});
          res.data.data.forEach((item)=>{
            let status;
            if(item.protocolstatus==='NOCOMMIT'){
              status='待提交';
            }else if(item.protocolstatus==='NOAUDIT'){
              status='待审批';
            }else if(item.protocolstatus==='NOEXECUTE'){
              status='未使用';
            }else if(item.protocolstatus==='EXECUTING'){
              status='使用中';
            }else if(item.protocolstatus==='FINISHED'){
              status='已结束';
            }else{
              status='已冻结';
            }
            let accountnum=item.cdtlnamt*1.00;
            let pk_banktype={display:item.banktypename,value:item.banktype};
            let pk_bankdoc={display:item.bankname,value:item.pk_bankdoc};
            let accnum={display:accountnum,value:accountnum};
            let vdef2={display:item.enddate,value:item.enddate}; 
            let vdef3={display:status,value:item.protocolstatus};
            let vdef4={display:item.protocolcode,value:item.protocolcode};
            let vdef5={display:item.pk_protocol,value:item.pk_protocol};
            
            this.props.cardTable.addRow(tabs.tabCreCode,0,{'pk_banktype':pk_banktype,'pk_bankdoc':pk_bankdoc,'accnum':accnum,'vdef5':vdef5,'vdef2':vdef2,'vdef3':vdef3,'vdef4':vdef4}, false);
            
          });
     
         
      }
    })
}

// 提交指派
export function getAssginUsedr(value) {
  BusinessOperator.call(
    this,
    this.props,
    "submit",
    ACTION_URL.SUBMIT,
    this.state.json["36610CC-000002"],
    value
  ); /* 国际化处理： 提交成功！*/
}

//提交指派取消
export function compositeTurnOff(value) {
  this.setState({
    compositedata: null,
    compositedisplay: false,
  });
}

//获取列表肩部信息
export function getTableHead() {
  return (
    <div className="shoulder-definition-area">
      <div className="definition-icons">
        {this.props.button.createButtonApp({
          area: tabs.btnCode,
          buttonLimit: 3,
          onButtonClick: tableButtonClick.bind(this),
          popContainer: document.querySelector(".header-button-area"),
        })}
      </div>
    </div>
  );
}

//同步树鼠标滑过事件
export function onTreeMouseEnter(key) {
  this.props.syncTree.setIconVisible(this.treeId, [
    {
      key: key, //节点的refpk
      value: {
        //默认都为true显示，隐藏设为false
        addIcon: false,
        delIcon: false,
        editIcon: false,
      },
    },
  ]);
}

//同步树节点点击事件
export function onTreeSelect(key, data) {
  if (key !== "-1") {
    ajax({
      url: ACTION_URL.CARDVERSION,
      data: {
        pk: key,
        pageCode: this.pageId,
      },
      success: (res) => {
        let { success, data } = res;
        if (success) {
          if (data && data.head) {
            this.props.form.setAllFormValue({
              [this.formId]: data.head[this.formId],
            });
          }
          if (data && data.bodys) {
            this.tabOrder &&
              this.props.cardTable.setAllTabsData(data.bodys, this.tabOrder);
          }
        }
      },
    });
  }
}

// 创建同步树
export function initVersionTree() {
  const treeRoot = {
    isleaf: false,
    pid: "__root__",
    refname: this.state.json["36610CC-000003"] /* 国际化处理： 版本号*/,
    refpk: "-1",
  };
  ajax({
    url: ACTION_URL.LISTVERSION,
    data: {
      queryAreaCode: "search",
      querytype: "tree",
      querycondition: {},
      pageCode: this.pageId,
      pageInfo: { pageIndex: 0, pageSize: "100" },
      def1: this.props.getUrlParam("id"), //主键
    },
    success: (res) => {
      let { success, data } = res;
      if (success) {
        let treeData = this.props.syncTree.createTreeData(data.data.rows);
        let newestVersion,
          maxVer = 0;
        for (let i = 0; i < treeData.length; i++) {
          if (maxVer < treeData[i].versionno) {
            maxVer = treeData[i].versionno;
            newestVersion = treeData[i].refpk;
          }
        }
        this.setState(
          {
            newestVersion: newestVersion,
            isVersion: true,
          },
          () => {
            this.props.syncTree.setSyncTreeData(this.treeId, [
              Object.assign(treeRoot, { children: treeData }),
            ]);
            this.props.syncTree.setNodeSelected(this.treeId, newestVersion);
            onTreeSelect.call(this, newestVersion);
          }
        );
      }
    },
  });
}

//LIrQHD0E7YfrpqrP0180quyA1f3B+UZ7YE6pzxTs8Zg=