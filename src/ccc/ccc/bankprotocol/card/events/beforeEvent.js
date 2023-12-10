//mgBVjmwkvoNAq04L4PpN6XaHRuC9ppiRIjtpmKBjUqgejE9ghtk2vvLS7AFVfj2K
import { TEMPLATE } from '../../constant/constant.js';
import FundPlanTreeRef from '../../../../../uapbd/refer/fiacc/FundPlanTreeRef';
import { ajax } from 'nc-lightapp-front';
export default function beforeEvent(props, moduleId, key, value, index, record) {
	let meta = props.meta.getMeta();
	let tableId1 = TEMPLATE.TABLE_DETAIL;
	let tableId2 = TEMPLATE.TABLE_GUARANTEE;
	let formId = TEMPLATE.FORM_ID;
	//授信使用单位：用户有权限的组织
	meta[tableId1].items.map((item) => {
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'), //appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		//资金计划项目：
		if (item.attrcode == 'pk_fundplan') {
			item.render = function(text, record, index) {
				return FundPlanTreeRef({
					queryCondition: () => {
						let pk_org = props.cardTable.getValByKeyAndIndex(tableId1, index, 'pk_org').value;
						let pk_group = props.form.getFormItemsValue(formId, [ 'pk_group' ])[0].value;
						return {
							pk_org: pk_org,
							pk_group: pk_group
						};
					}
				});
			};
		}
		//表体贷款银行过滤
		if (item.attrcode == 'pk_bankdoc') {
			item.queryCondition = () => {
				let pk_creditbank = props.form.getFormItemsValue(formId, [ 'pk_creditbank' ])[0].value; //组织
				let pk_bankdocs = null;
				if (pk_creditbank) {
					let data = { pk_bankdoc: pk_creditbank };
					ajax({
						url: '/nccloud/ccc/bankprotocol/BanPkRef.do',
						async: false,
						data: data,
						success: (res) => {
							if (res.data && res.data[0]) {
								pk_bankdocs = res.data[0].pk_banktype;
								console.log(pk_bankdocs);
							}
						}
					});
				}
				return {
					pk_banktype: pk_bankdocs
				};
			};
		}
	});
	/** 担保 **/
	meta[tableId2].items.map((item) => {
		if (item.attrcode == 'guarantee') {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(formId, [ 'pk_org' ])[0].value; //组织
				let begindate = props.form.getFormItemsValue(formId, [ 'begindate' ])[0].value; //开始日期
				let guaranteetype = props.form.getFormItemsValue(formId, [ 'guaranteetype' ])[0].value; //担保方式
				let pk_creditbank = props.form.getFormItemsValue(formId, [ 'pk_creditbank' ])[0].value; //授信银行
				let guatype = null;
				if (guaranteetype == 'warrant') {
					guatype = 1;
				} else if (guaranteetype == 'guaranty') {
					guatype = 2;
				} else if (guaranteetype == 'pledge') {
					guatype = 3;
				} else if (guaranteetype == 'mixed') {
					guatype = 4;
				}
				return {
					pk_org: pk_org,
					guastartdate: begindate,
					guaenddate: begindate,
					isprotocol: true,
					guatype: guatype,
					contracttype: '1',
					pk_creditor: pk_creditbank
					//GridRefActionExt: 'nccloud.web.ccc.ref.builder.GuaranteeRefBuilder'
				};
			};
		}
	});
	props.meta.setMeta(meta);
	return true;
}

//mgBVjmwkvoNAq04L4PpN6XaHRuC9ppiRIjtpmKBjUqgejE9ghtk2vvLS7AFVfj2K