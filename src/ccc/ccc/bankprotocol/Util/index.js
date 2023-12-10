//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
import { ajax,toast } from 'nc-lightapp-front';
import { TEMPLATE,ACTION_URL } from '../constant/constant';
import { orgVersionView } from '../../../../tmpub/pub/util/version/index';

/**
 * 组织多版本控制
 * @param {*} props 
 */
export const versionControl = function(props) {
	//组织版本试图
	orgVersionView(props, TEMPLATE.FORM_ID);
};
/**
 * 列表：得到所选数据的pks
 */
export const getBillPks = function() {
	let selectData = this.props.table.getCheckedRows(this.tableId);
	let pks = [];
	selectData.forEach((val) => {
		let pk;
		pk = val.data.values.pk_protocol.value;
		pks.push(pk);
	});
	return pks;
};

/**
 * 判断列表是否选择数据
 */
export const checkSelectedData = function(selectData) {
	if (selectData.length == 0) {
		toast({ content: this.state.json['36610CC-000061'], color: 'warning' }); /* 国际化处理： 请选择数据！*/
		return false;
	} else {
		return true;
	}
};
/**
 * 判断列表是否选择一条数据
 */
export const checkSelectedOne = function(selectData) {
	if (selectData.length != 1) {
		toast({ content: this.state.json['36610CC-000046'], color: 'warning' }); /* 国际化处理： 请选择一条数据！*/
		return false;
	} else {
		return true;
	}
};
/**
 * 修改saga冻结字段检查
 *
 * @param {*} name - 接口名称
 * @param {*} data - 请求数据
 * @param {*} success - 成功回调
 */
export const sagaApi = function(params) {
    let { name, data, success, error } = params;
    let path = ACTION_URL["SAGACHECK"];
    ajax({
        url: path,
        data,
        success: res => {
            success && success(res);
        }
    });
}

//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=