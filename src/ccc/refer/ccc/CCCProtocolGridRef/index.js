//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=
import { high } from 'nc-lightapp-front';

const { Refer } = high;


export default function (prop = {}) {
    var conf = {
        multiLang: {
            domainName: 'ccc',
            currentLocales: 'zh-CN',
            moduleId: 'cccRefer'
        },
        refType: 'grid',
        refName: 'refer-0001',
        refcode: 'ccc.refer.ccc.CCCProtocolGridRef',
        queryGridUrl: '/nccloud/ccc/bankprotocol/CCCProtocolGridRef.do',
        isMultiSelectedEnabled: false,
        columnConfig: [{
            name: ['refer-0002', 'refer-0003', 'refer-0004', 'refer-0005', 'refer-0006', 'refer-0010', 'refer-0007', 'refer-0008', 'refer-0009'],
            code: ['refcode', 'controlmethod', 'protocoltype', 'bankdocname', 'cdtlnamt', 'availcdtlnamt', 'currname', 'begindate', 'enddate']
        }]
    };

    return <Refer {...Object.assign(conf, prop)} />
}
//bLkXFuKw3KUaZeb8Dj31ZaBen3AhHupyk38WaLTweA8=