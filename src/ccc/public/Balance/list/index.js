//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, getMultiLang } from 'nc-lightapp-front';
import axios from 'axios';
import { initTemplate } from './events';

const { NCModal } = base;
class NCCCCCBalance extends Component {
	constructor(props) {
		super(props);
		this.tableId = 'table_area'
		this.state = {
			showCCCBalance: null
		};
	}

	componentWillMount() {
		let callback = (json, status, inlt) => {
			if (status) {
				this.setState({json, inlt}, () => {
					initTemplate.call(this, json, this.props);
				})
			} else {
				console.log('未加载到多语资源')
			}
		}
		this.props.MultiInit.getMultiLang({moduleId: '36610CCBalance', domainName: 'ccc', callback})
	}

	componentDidMount() {
		// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
		// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
		// 需要每次都重新加载
		this.props.table.setAllTableData(this.tableId, { rows: [] });
		this.setState(
			{
				showCCCBalance: this.props.showCCCBalance
			}, () => {
				this.initData();
			}
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.showmodal && nextProps.showmodal !== this.props.showmodal) { // 
			let need = true;
			// 需要每次都重新加载
			if (need) {
				this.props.form.EmptyAllFormValue(this.formId);
				this.setState(
					{
						showCCCBalance: nextProps.showCCCBalance
					}, () => {
						this.initData();
					}
				);
			}
		}
	}

	initData() {
		// 在didMount里初始化数据
		let data = this.state.showCCCBalance;
		if (data) {
			this.getData(data);
		} else {
			return;
		}
	}

	getData = (searchData) => {
		let data = {
			pk: searchData.pk_protocol,
			pk_currtype: searchData.pk_currtype,
			credittype: searchData.credittype,
			pk_bankdoc: searchData.pk_bankdoc,
			pk_org: searchData.pk_org,
		};
		ajax({
			url: '/nccloud/ccc/bankprotocol/balance.do',
			data: data,
			success: (res) => {
				let { success, data } = res;
				if (success && data != undefined && data) {
					if (data) {
						let tablearea = {};
						// 后台传过来的精度
						let scale = '2';
						let values = {};
						let value = {};
						let rows = [];
						let protocolcode = data.protocolcode;
						let pk_currtype = data.displaycurr;
						let credittype = data.displaytype;
						let pk_bankdoc = data.displaybankdoc;
						let availcdtlnamt = data.availcdtlnamt;
						let olcavailcdtlnamt = data.olcavailcdtlnamt;
						value.protocolcode = { value: protocolcode, display: protocolcode };
						value.pk_currtype = { value: pk_currtype, display: pk_currtype };
						value.credittype = { value: credittype, display: credittype };
						value.pk_bankdoc = { value: pk_bankdoc, display: pk_bankdoc };
						value.availcdtlnamt = { value: availcdtlnamt, display: availcdtlnamt, scale: data.scale };
						value.olcavailcdtlnamt = { value: olcavailcdtlnamt, display: olcavailcdtlnamt, scale: data.olcscale };
						values.values = value;
						values.status = '0';
						values.rowid = null;
						rows.push(values);
						tablearea['rows'] = rows;
						tablearea['areacode'] = this.tableId;
						this.props.table.setAllTableData(this.tableId, tablearea);
					}
				} else {
					this.props.table.setAllTableData(this.tableId, { rows: [] });
				}
			}
		});
	};
	close = () => {
		this.setState({
			showCCCBalance: null
		}, () => {
			this.props.onCloseClick();
		})
	}
	render() {
		let { table, modal } = this.props;
		let { createSimpleTable } = table;
		return (
			<div>
				<NCModal
					show={this.props.showmodal}
					style={{ width: '1020px', height: '300px' }}
					size='lg'
					onHide={
						this.close
					}
				>
					<NCModal.Header closeButton={'true'}>
						<NCModal.Title>
							{this.state.json && this.state.json['36610CCA-000000']}
						</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body size="sm">
						<div>
							{createSimpleTable(this.tableId, {
								showIndex: true,
							})}
						</div>
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}

export default createPage({
	// initTemplate: initTemplate
})(NCCCCCBalance);


//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=