//JBRlPWKDkjmykCz71WmoN6MyNtDVwcipvw0CGaXazEwMYe8PHnTx8Qe1JmLJ7m+q

export default function balance(json) {
  return {
    "template": {
      "gridrelation": {
        "table_area": {
          "destBrowseAreaCode": null,
          "destEditAreaCode": null,
          "srcAreaCode": "table_area",
          "tabRelation": [
            "table_area"
          ]
        }
      },
      "table_area": {
        "clazz": "nc.vo.ccc.bankprotocol.ProtocolVO",
        "code": "table_area",
        "items": [
          {
            "itemtype": "input",
            "visible": true,
            "label": json['36610CCA-000001'], // 授信协议
            "attrcode": "protocolcode",
            "maxlength": "20",
            "metapath": "protocolcode"
          },
          {
            "itemtype": "input",
            "visible": true,
            "label": json['36610CCA-000002'], // 币种
            "attrcode": "pk_currtype",
            "maxlength": "20",
            "metapath": "pk_currtype"
          },
          {
            "itemtype": "input",
            "visible": true,
            "label": json['36610CCA-000003'], // 授信类别
            "attrcode": "credittype",
            "maxlength": "20",
            "metapath": "credittype"
          },
          {
            "itemtype": "input",
            "visible": true,
            "label": json['36610CCA-000004'], // 授信银行
            "attrcode": "pk_bankdoc",
            "maxlength": "20",
            "metapath": "pk_bankdoc"
          },
          {
            "itemtype": "number",
            "scale": "8",
            "visible": true,
            "label": json['36610CCA-000005'], // 可用授信额度
            "attrcode": "availcdtlnamt",
            "maxlength": "28",
            "metapath": "availcdtlnamt"
          },
          {
            "itemtype": "number",
            "scale": "8",
            "visible": true,
            "label": json['36610CCA-000006'], // 可用授信可用额度
            "attrcode": "olcavailcdtlnamt",
            "maxlength": "28",
            "metapath": "olcavailcdtlnamt"
          },
        ],
        "moduletype": "table",
        "name": "table_area_name",
        "vometa": ""
      },
      "code": "table_area",
      "moduletype": "table",
      "name": "table_area_name"
    },
    "code": "36610CCB",
    "formrelation": null,
    "name": json['36610CCA-000007'], // 授信可用余额联查
    "metapath": "ccc_bankprotocol",
    "clazz": "nc.vo.ccc.bankprotocol.ProtocolVO"
  }
} 

//JBRlPWKDkjmykCz71WmoN6MyNtDVwcipvw0CGaXazEwMYe8PHnTx8Qe1JmLJ7m+q