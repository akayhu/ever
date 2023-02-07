const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
const wapUrl = canUseDOM ? '//'+location.host : '//pluslocal.104-dev.com.tw:3000';
const staticWapUrl = canUseDOM ? '//'+location.host : '//pluslocal.104-dev.com.tw:3000';
const staticMWapUrl = canUseDOM ? '//'+location.host : '//pluslocal.104-dev.com.tw:3000';

const commonConfig = {
    "apnum" : 10400,
    "GAID" : "UA-49487616-1",
    "tokenCid" : "b5ae2975b5fdfc7f4c3084daaa3b57c1",
    "rootPath" : '',
    "surveyUrl" : "http://www.104survey.com/survey/action/questionFillin/QuestionPresentAction.jsf?surveyId=0000000000005573575500006564645764573333333365640000100100003D579577100116507865786523323333165000999999006633FFFFFF666600FF8CFF73005599FF990000RJSS&pointMsg=false&custno=",
}

export const dev = {
    "GTMID": "GTM-KFMFKQV",
    "GOID": "GTM-NTBDXSG",
    "wapUrl" : wapUrl,
    "domain": '.104-dev.com.tw',
    "apim": '//apis.104dc-dev.com',
    "staticUrl" : "//static.104-dev.com.tw",
    "accountsUrl" : "//accounts.104-dev.com.tw/hello",
    "e104Url" : "//www.104-dev.com.tw",
    "e104Domain" : "www.104-dev.com.tw",
    "my104Url": "//pda.104-dev.com.tw",
    "wspJbUrl": "//wsp-jb.104-dev.com.tw",
    "staticLogoUrl" : '//static.104-dev.com.tw/logo',
    "staticPlatformUrl" : "//static.104-dev.com.tw/bigc/c_platform",
    "staticWapUrl" : staticWapUrl,
    "staticMWapUrl": staticMWapUrl,
    "remoteDataUrl" : '//pluslocal.104-dev.com.tw:3002',
    "surveyUrl" : "http://www.104survey.com/survey/action/questionFillin/QuestionPresentAction.jsf?surveyId=0000000000005573575500006564645764573333333365640000100100003D579577100116507865786523323333165000999999006633FFFFFF666600FF8CFF73005599FF990000RJSS&pointMsg=false&custno=",
    "documentApiUrl" : 'http://api.doc.104dc-dev.com/docapi/v0/',
    "s3amazonaws" : 'https://ori.doc.104-dev.com.tw',
    "samlUrl": "https://sso.104-dev.com.tw",
    "push" : {
        "pushServerOne" : '//ppush.104-dev.com.tw/push_sub/',
        "pushServerTwo" : '//ppush.104-dev.com.tw/msg',
        "forC" : 'b5ae2975b5fdfc7f4c3084daaa3b57c1',
        "forB" : 'cdbf723237f54128b282d6a5933e29'
    },
    "apiUrl" : {
        "esb" : 'http://api.104-dev.com.tw/services',
        "intesb" : 'http://in.api.104-dev.com.tw/services',
        "test_bank": "http://assessment.104-dev.com.tw/testing_bank/apis/private/wbs"	
    },
    "companyLogo": '//www.104-dev.com.tw/upload1/logo/1104_',
    "fbEToken" : 'ad61723c2ecf3799a08de9ad8c76a2f64475601281165d92f17074b18bb1e05e9be23c3b4aa243a030ce64d97e6aeb48766e2dfe5cdd32c0ebba6ad835b50f530b821b047cd50435dae4fae45adab27af75aa37c39952a4d960b7e13591cfb80d14fcee0efa2ba5e426060519678e0b0dd523ef1011adbcb0a21e4786d1df4da7ea93edd13af1d8311ad85495bac5f6dbdef4aa593b2aa97683dc2b6be955cd582b391035b5475eb881823491d41424b75ce8c1c243a8221e7ac89498e696de2a9ea11bbbfa6135ab696ac3490660596167cc135f9565e4c38c05888486d9de557e663d6f7fb13c8fbe1f1314b489a052cbbd6737c4a23e3acc02476338f21b1',
    "fbPrvKeyPem" : '-----BEGIN PRIVATE KEY-----\r\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkCgCdjQTj43lq LqEBwd8y8QHzFgwxvoPuDboedT8LTRhxZq/8ROTHT97+NF7dG6Pub+FEn8wf8Tgi VQPN3jfYG1uuOhZidZdnjpOIUU75SvMRegJz/M1JG54ZWmFAhYsg3TcoJdcvuA76 giQVXF38k0svHTKG2NibPsxSceI4aPerZ1UNSWlvmWCvUxaEnbPTaW6PuJVoIvt7 ilG2dfn2Uam6DCuf8iWb/nwlfyehFJpPeUNRxW7QyL/stcXGGLVk3ua5JNAe2B+h hSV6s1mDou4OeJiI/4BE7roS7jxbSa0z8iXdrm/RMqog4rdCT0u8IlVoW0RrzdPU I6c1kJ5HAgMBAAECggEADqDFoVWmdqfk5fbPxTkWhEIJifpkFdzOwbqHseR7gtIT O1MG/vu8YTyyZUQewbhAL89ld+14PqROoYUqlU4n7ujyXJ7FSNOaPr5aoGf21O8F 4J0fAym4UXRAFAhELMtkPVtzalPjFeCMtW0bu3MNZGJedEs/Ln9ChdLlcHR1uoCC Qxc0ISLBZoQAhBi/jnkSLORsSg5H3cddldafFMSvTpEpHMTQbH+Gbj76t8vHXIH/ HGe/lqAImCLjWea129IZ/RchK/M4VC6dkhPPXJtVNqJ+MI9aQ07uYpjxoSvRQvI+ wWMRPZ4wtsCSc0k16NDBDJdfHLteL5bYTDN2zWWrIQKBgQDyaXigYL73bf+IjkNE WD84v8tt9VUxJviQ2SG8gxHQKB0L8ThQYOZH49MQTeaNvomHnGSZJYz1SFULBhoJ 0i/6NBTIQwWsrhaU5KZNcpqR874JHUd39pawiCZKfDzCQFx8+otBctTOcFOe4I3e lpALDQ5kuCxXZAvtaZbIqg+obQKBgQDw0kjgf02j3Lw/ZmeHr56AjzJE5b2kT9O9 3Vd59Qy24egnC3NTvLxIDhEOYgoo2PYG3I7w6MXMGHAVjZO18+laDWcWuRTkJY4K VIkEVl1biZQ4TahO7uVriLK+YQSh4jP3P94V0me82GO4cY4DqSYsJDaL1z+OGTtz v9EhuEsZAwKBgA8llfr3cJdHUUM4GG3p0bF7EnwBa1xR4hAy8Q+1ZOSLzRzU6r7i /yCY1LRdGb3bnP5TQFntZbxh06aHsBLTBlps7KuCvJUIn7KYAugt9AiQoVwybyfI yauoJjRbRPSiTuUkRpVFVpS7og34XAT/hWqbWz3h4CtpvfEMuvY44heVAoGBAKpd aVcAWFGzB62maVlxISV7qClbifSi0H3CB29sr2j1mgF9NUIpA93JrcFKFDvfePVT tP+y/LMtGqX0uWmAOzYMw0AtAR2Bf+HI+gGKg5MNWkEWlxn4IW8YjrLl+Zv4ZaDl mtw/NEpBnxJNqxTl5e5WVAxL41dIfGmfanh7Yw03AoGBAL0Nz07krlAiarh7VExf Jbxh4Ljdd8Ira701plnsHTZsyHvT9Z29t+t6O6rDzSYPlGp4D7fH+Z/3AyA9VENV GQCYthKSrMZCumXBZeEpfv5T+T2C6kzRelaol8FwDBnRlftMsD2BBURDzH+1JAJr TdqV5ArhrlxzXFiUzMqrwZ7V -----END PRIVATE KEY-----',
    "pusher": {
        "appId": '416787',
        "key": '6ba1a4816573c9655dff',
        "secret": 'ba46155b454723b0d09c',
        "cluster": 'ap1',
    },
    ...commonConfig
}

export const lab = {
    "GTMID": "GTM-KFMFKQV",
    "GOID": "GTM-NTBDXSG",
    "wapUrl" : '//plus.104-dev.com.tw',
    "domain": '.104-dev.com.tw',
    "apim": '//apis.104dc-dev.com',
    "staticUrl" : "//static.104-dev.com.tw",
    "accountsUrl" : "//accounts.104-dev.com.tw/hello",
    "e104Url" : "//www.104-dev.com.tw",
    "e104Domain" : "www.104-dev.com.tw",
    "my104Url": "//pda.104-dev.com.tw",
    "wspJbUrl": "//wsp-jb.104-dev.com.tw",
    "staticLogoUrl" : '//static.104-dev.com.tw/logo',
    "staticPlatformUrl" : '//static.104-dev.com.tw/bigc/c_platform',
    "staticWapUrl" : '//static.104-dev.com.tw/bigc/c_wap',
    "staticMWapUrl": '//static.104-dev.com.tw/bigc/m',
    "documentApiUrl" : "http://api.doc.104dc-dev.com/docapi/v0/",
    "remoteDataUrl" : '//plus.104-dev.com.tw',
    "surveyUrl" : "http://www.104survey.com/survey/action/questionFillin/QuestionPresentAction.jsf?surveyId=0000000000005573575500006564645764573333333365640000100100003D579577100116507865786523323333165000999999006633FFFFFF666600FF8CFF73005599FF990000RJSS&pointMsg=false&custno=",
    "documentApiUrl" : 'http://api.doc.104dc-dev.com/docapi/v0/',
    "s3amazonaws" : 'https://ori.doc.104-dev.com.tw',
    "samlUrl": "https://sso.104-dev.com.tw",
    "push" : {
        "pushServerOne" : '//ppush.104-dev.com.tw/push_sub/',
        "pushServerTwo" : '//ppush.104-dev.com.tw/msg',
        "forC" : 'b5ae2975b5fdfc7f4c3084daaa3b57c1',
        "forB" : 'cdbf723237f54128b282d6a5933e29'
    },
    "apiUrl" : {
        "esb" : 'http://api.104-dev.com.tw/services',
        "intesb" : 'http://in.api.104-dev.com.tw/services',
        "test_bank": "http://assessment.104-dev.com.tw/testing_bank/apis/private/wbs"
    },
    "companyLogo": '//www.104-dev.com.tw/upload1/logo/1104_',
    "fbEToken" : 'ad61723c2ecf3799a08de9ad8c76a2f64475601281165d92f17074b18bb1e05e9be23c3b4aa243a030ce64d97e6aeb48766e2dfe5cdd32c0ebba6ad835b50f530b821b047cd50435dae4fae45adab27af75aa37c39952a4d960b7e13591cfb80d14fcee0efa2ba5e426060519678e0b0dd523ef1011adbcb0a21e4786d1df4da7ea93edd13af1d8311ad85495bac5f6dbdef4aa593b2aa97683dc2b6be955cd582b391035b5475eb881823491d41424b75ce8c1c243a8221e7ac89498e696de2a9ea11bbbfa6135ab696ac3490660596167cc135f9565e4c38c05888486d9de557e663d6f7fb13c8fbe1f1314b489a052cbbd6737c4a23e3acc02476338f21b1',
    "fbPrvKeyPem" : '-----BEGIN PRIVATE KEY-----\r\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkCgCdjQTj43lq LqEBwd8y8QHzFgwxvoPuDboedT8LTRhxZq/8ROTHT97+NF7dG6Pub+FEn8wf8Tgi VQPN3jfYG1uuOhZidZdnjpOIUU75SvMRegJz/M1JG54ZWmFAhYsg3TcoJdcvuA76 giQVXF38k0svHTKG2NibPsxSceI4aPerZ1UNSWlvmWCvUxaEnbPTaW6PuJVoIvt7 ilG2dfn2Uam6DCuf8iWb/nwlfyehFJpPeUNRxW7QyL/stcXGGLVk3ua5JNAe2B+h hSV6s1mDou4OeJiI/4BE7roS7jxbSa0z8iXdrm/RMqog4rdCT0u8IlVoW0RrzdPU I6c1kJ5HAgMBAAECggEADqDFoVWmdqfk5fbPxTkWhEIJifpkFdzOwbqHseR7gtIT O1MG/vu8YTyyZUQewbhAL89ld+14PqROoYUqlU4n7ujyXJ7FSNOaPr5aoGf21O8F 4J0fAym4UXRAFAhELMtkPVtzalPjFeCMtW0bu3MNZGJedEs/Ln9ChdLlcHR1uoCC Qxc0ISLBZoQAhBi/jnkSLORsSg5H3cddldafFMSvTpEpHMTQbH+Gbj76t8vHXIH/ HGe/lqAImCLjWea129IZ/RchK/M4VC6dkhPPXJtVNqJ+MI9aQ07uYpjxoSvRQvI+ wWMRPZ4wtsCSc0k16NDBDJdfHLteL5bYTDN2zWWrIQKBgQDyaXigYL73bf+IjkNE WD84v8tt9VUxJviQ2SG8gxHQKB0L8ThQYOZH49MQTeaNvomHnGSZJYz1SFULBhoJ 0i/6NBTIQwWsrhaU5KZNcpqR874JHUd39pawiCZKfDzCQFx8+otBctTOcFOe4I3e lpALDQ5kuCxXZAvtaZbIqg+obQKBgQDw0kjgf02j3Lw/ZmeHr56AjzJE5b2kT9O9 3Vd59Qy24egnC3NTvLxIDhEOYgoo2PYG3I7w6MXMGHAVjZO18+laDWcWuRTkJY4K VIkEVl1biZQ4TahO7uVriLK+YQSh4jP3P94V0me82GO4cY4DqSYsJDaL1z+OGTtz v9EhuEsZAwKBgA8llfr3cJdHUUM4GG3p0bF7EnwBa1xR4hAy8Q+1ZOSLzRzU6r7i /yCY1LRdGb3bnP5TQFntZbxh06aHsBLTBlps7KuCvJUIn7KYAugt9AiQoVwybyfI yauoJjRbRPSiTuUkRpVFVpS7og34XAT/hWqbWz3h4CtpvfEMuvY44heVAoGBAKpd aVcAWFGzB62maVlxISV7qClbifSi0H3CB29sr2j1mgF9NUIpA93JrcFKFDvfePVT tP+y/LMtGqX0uWmAOzYMw0AtAR2Bf+HI+gGKg5MNWkEWlxn4IW8YjrLl+Zv4ZaDl mtw/NEpBnxJNqxTl5e5WVAxL41dIfGmfanh7Yw03AoGBAL0Nz07krlAiarh7VExf Jbxh4Ljdd8Ira701plnsHTZsyHvT9Z29t+t6O6rDzSYPlGp4D7fH+Z/3AyA9VENV GQCYthKSrMZCumXBZeEpfv5T+T2C6kzRelaol8FwDBnRlftMsD2BBURDzH+1JAJr TdqV5ArhrlxzXFiUzMqrwZ7V -----END PRIVATE KEY-----',
    "pusher": {
        "appId": '416787',
        "key": '6ba1a4816573c9655dff',
        "cluster": 'ap1',
    },
    ...commonConfig
}

export const staging = {
    "GTMID": "GTM-KFMFKQV",
    "GOID": "GTM-NTBDXSG",
    "wapUrl" : '//plus.104-staging.com.tw',
    "domain": '.104-staging.com.tw',
    "apim": '//apis.104dc-staging.com',
    "staticUrl" : "//static.104-staging.com.tw",
    "accountsUrl" : "//accounts.104-staging.com.tw/hello",
    "e104Url" : "//www.104-staging.com.tw",
    "e104Domain" : "www.104-staging.com.tw",
    "my104Url": "//pda.104-staging.com.tw",
    "wspJbUrl": "//wsp-jb.104-staging.com.tw",
    "staticLogoUrl" : '//static.104-staging.com.tw/logo',
    "staticPlatformUrl" : '//static.104-staging.com.tw/bigc/c_platform',
    "staticWapUrl" : '//static.104-staging.com.tw/bigc/c_wap',
    "staticMWapUrl": '//static.104-staging.com.tw/bigc/m',
    "documentApiUrl" : "http://api.doc.104dc-staging.com/docapi/v0/",
    "remoteDataUrl" : '//plus.104-staging.com.tw',
    "surveyUrl" : "http://www.104survey.com/survey/action/questionFillin/QuestionPresentAction.jsf?surveyId=0000000000005573575500006564645764573333333365640000100100003D579577100116507865786523323333165000999999006633FFFFFF666600FF8CFF73005599FF990000RJSS&pointMsg=false&custno=",
    "documentApiUrl" : 'http://api.doc.104dc-staging.com/docapi/v0/',
    "s3amazonaws" : 'https://ori.doc.104-staging.com.tw',
    "samlUrl": "https://sso.104-staging.com.tw",
    "push" : {
        "pushServerOne" : '//ppush.104-staging.com.tw/push_sub/',
        "pushServerTwo" : '//ppush.104-staging.com.tw/msg',
        "forC" : 'b5ae2975b5fdfc7f4c3084daaa3b57c1',
        "forB" : 'cdbf723237f54128b282d6a5933e29'
    },
    "apiUrl" : {
        "esb" : 'http://api.104-staging.com.tw/services',
        "intesb" : 'http://in.api.104-staging.com.tw/services',
        "test_bank": "http://assessment.104-staging.com.tw/apis/private/wbs"
    },
    "companyLogo": '//www.104-staging.com.tw/upload1/logo/1104_',
    "fbEToken" : 'ad61723c2ecf3799a08de9ad8c76a2f64475601281165d92f17074b18bb1e05e9be23c3b4aa243a030ce64d97e6aeb48766e2dfe5cdd32c0ebba6ad835b50f530b821b047cd50435dae4fae45adab27af75aa37c39952a4d960b7e13591cfb80d14fcee0efa2ba5e426060519678e0b0dd523ef1011adbcb0a21e4786d1df4da7ea93edd13af1d8311ad85495bac5f6dbdef4aa593b2aa97683dc2b6be955cd582b391035b5475eb881823491d41424b75ce8c1c243a8221e7ac89498e696de2a9ea11bbbfa6135ab696ac3490660596167cc135f9565e4c38c05888486d9de557e663d6f7fb13c8fbe1f1314b489a052cbbd6737c4a23e3acc02476338f21b1',
    "fbPrvKeyPem" : '-----BEGIN PRIVATE KEY-----\r\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkCgCdjQTj43lq LqEBwd8y8QHzFgwxvoPuDboedT8LTRhxZq/8ROTHT97+NF7dG6Pub+FEn8wf8Tgi VQPN3jfYG1uuOhZidZdnjpOIUU75SvMRegJz/M1JG54ZWmFAhYsg3TcoJdcvuA76 giQVXF38k0svHTKG2NibPsxSceI4aPerZ1UNSWlvmWCvUxaEnbPTaW6PuJVoIvt7 ilG2dfn2Uam6DCuf8iWb/nwlfyehFJpPeUNRxW7QyL/stcXGGLVk3ua5JNAe2B+h hSV6s1mDou4OeJiI/4BE7roS7jxbSa0z8iXdrm/RMqog4rdCT0u8IlVoW0RrzdPU I6c1kJ5HAgMBAAECggEADqDFoVWmdqfk5fbPxTkWhEIJifpkFdzOwbqHseR7gtIT O1MG/vu8YTyyZUQewbhAL89ld+14PqROoYUqlU4n7ujyXJ7FSNOaPr5aoGf21O8F 4J0fAym4UXRAFAhELMtkPVtzalPjFeCMtW0bu3MNZGJedEs/Ln9ChdLlcHR1uoCC Qxc0ISLBZoQAhBi/jnkSLORsSg5H3cddldafFMSvTpEpHMTQbH+Gbj76t8vHXIH/ HGe/lqAImCLjWea129IZ/RchK/M4VC6dkhPPXJtVNqJ+MI9aQ07uYpjxoSvRQvI+ wWMRPZ4wtsCSc0k16NDBDJdfHLteL5bYTDN2zWWrIQKBgQDyaXigYL73bf+IjkNE WD84v8tt9VUxJviQ2SG8gxHQKB0L8ThQYOZH49MQTeaNvomHnGSZJYz1SFULBhoJ 0i/6NBTIQwWsrhaU5KZNcpqR874JHUd39pawiCZKfDzCQFx8+otBctTOcFOe4I3e lpALDQ5kuCxXZAvtaZbIqg+obQKBgQDw0kjgf02j3Lw/ZmeHr56AjzJE5b2kT9O9 3Vd59Qy24egnC3NTvLxIDhEOYgoo2PYG3I7w6MXMGHAVjZO18+laDWcWuRTkJY4K VIkEVl1biZQ4TahO7uVriLK+YQSh4jP3P94V0me82GO4cY4DqSYsJDaL1z+OGTtz v9EhuEsZAwKBgA8llfr3cJdHUUM4GG3p0bF7EnwBa1xR4hAy8Q+1ZOSLzRzU6r7i /yCY1LRdGb3bnP5TQFntZbxh06aHsBLTBlps7KuCvJUIn7KYAugt9AiQoVwybyfI yauoJjRbRPSiTuUkRpVFVpS7og34XAT/hWqbWz3h4CtpvfEMuvY44heVAoGBAKpd aVcAWFGzB62maVlxISV7qClbifSi0H3CB29sr2j1mgF9NUIpA93JrcFKFDvfePVT tP+y/LMtGqX0uWmAOzYMw0AtAR2Bf+HI+gGKg5MNWkEWlxn4IW8YjrLl+Zv4ZaDl mtw/NEpBnxJNqxTl5e5WVAxL41dIfGmfanh7Yw03AoGBAL0Nz07krlAiarh7VExf Jbxh4Ljdd8Ira701plnsHTZsyHvT9Z29t+t6O6rDzSYPlGp4D7fH+Z/3AyA9VENV GQCYthKSrMZCumXBZeEpfv5T+T2C6kzRelaol8FwDBnRlftMsD2BBURDzH+1JAJr TdqV5ArhrlxzXFiUzMqrwZ7V -----END PRIVATE KEY-----',
    "pusher": {
        "appId": '416788',
        "key": '71342ce6b2634f006810',
        "cluster": 'ap1',
    },
    ...commonConfig
}

export const production = {
    "GTMID": "GTM-K2R5VJ",
    "GOID": "GTM-PJ96ZKH",
    "wapUrl" : '//plus.104.com.tw',
    "domain": '.104.com.tw',
    "apim": '//apis.104dc.com',
    "staticUrl" : "//static.104.com.tw",
    "accountsUrl" : "//accounts.104.com.tw/hello",
    "e104Url" : "//www.104.com.tw",
    "e104Domain" : "www.104.com.tw",
    "my104Url": "//pda.104.com.tw",
    "wspJbUrl": "//wsp-jb.104.com.tw",
    "staticLogoUrl" : '//static.104.com.tw/logo',
    "staticPlatformUrl" : '//static.104.com.tw/bigc/c_platform',
    "staticWapUrl" : '//static.104.com.tw/bigc/c_wap',
    "staticMWapUrl": '//static.104.com.tw/bigc/m',
    "remoteDataUrl" : '//plus.104.com.tw',
    "documentApiUrl" : 'http://api.doc.104dc.com/docapi/v0/',
    "s3amazonaws" : 'https://ori.doc.104.com.tw',
    "samlUrl": "https://sso.104.com.tw",
    "push" : {
        "pushServerOne" : '//ppush.104.com.tw/push_sub/',
        "pushServerTwo" : '//ppush.104.com.tw/msg',
        "forC" : 'b5ae2975b5fdfc7f4c3084daaa3b57c1',
        "forB" : 'cdbf723237f54128b282d6a5933e29'
    },
    "apiUrl" : {
        "esb" : 'http://api.104.com.tw/services',
        "intesb" : 'http://in.api.104.com.tw/services',
        "test_bank": "http://assessment.104.com.tw/apis/private/wbs"
    },
    "companyLogo": '//www.104.com.tw/upload1/logo/1104_',
    "fbEToken" : 'ad61723c2ecf3799a08de9ad8c76a2f64475601281165d92f17074b18bb1e05e9be23c3b4aa243a030ce64d97e6aeb48766e2dfe5cdd32c0ebba6ad835b50f530b821b047cd50435dae4fae45adab27af75aa37c39952a4d960b7e13591cfb80d14fcee0efa2ba5e426060519678e0b0dd523ef1011adbcb0a21e4786d1df4da7ea93edd13af1d8311ad85495bac5f6dbdef4aa593b2aa97683dc2b6be955cd582b391035b5475eb881823491d41424b75ce8c1c243a8221e7ac89498e696de2a9ea11bbbfa6135ab696ac3490660596167cc135f9565e4c38c05888486d9de557e663d6f7fb13c8fbe1f1314b489a052cbbd6737c4a23e3acc02476338f21b1',
    "fbPrvKeyPem" : '-----BEGIN PRIVATE KEY-----\r\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkCgCdjQTj43lq LqEBwd8y8QHzFgwxvoPuDboedT8LTRhxZq/8ROTHT97+NF7dG6Pub+FEn8wf8Tgi VQPN3jfYG1uuOhZidZdnjpOIUU75SvMRegJz/M1JG54ZWmFAhYsg3TcoJdcvuA76 giQVXF38k0svHTKG2NibPsxSceI4aPerZ1UNSWlvmWCvUxaEnbPTaW6PuJVoIvt7 ilG2dfn2Uam6DCuf8iWb/nwlfyehFJpPeUNRxW7QyL/stcXGGLVk3ua5JNAe2B+h hSV6s1mDou4OeJiI/4BE7roS7jxbSa0z8iXdrm/RMqog4rdCT0u8IlVoW0RrzdPU I6c1kJ5HAgMBAAECggEADqDFoVWmdqfk5fbPxTkWhEIJifpkFdzOwbqHseR7gtIT O1MG/vu8YTyyZUQewbhAL89ld+14PqROoYUqlU4n7ujyXJ7FSNOaPr5aoGf21O8F 4J0fAym4UXRAFAhELMtkPVtzalPjFeCMtW0bu3MNZGJedEs/Ln9ChdLlcHR1uoCC Qxc0ISLBZoQAhBi/jnkSLORsSg5H3cddldafFMSvTpEpHMTQbH+Gbj76t8vHXIH/ HGe/lqAImCLjWea129IZ/RchK/M4VC6dkhPPXJtVNqJ+MI9aQ07uYpjxoSvRQvI+ wWMRPZ4wtsCSc0k16NDBDJdfHLteL5bYTDN2zWWrIQKBgQDyaXigYL73bf+IjkNE WD84v8tt9VUxJviQ2SG8gxHQKB0L8ThQYOZH49MQTeaNvomHnGSZJYz1SFULBhoJ 0i/6NBTIQwWsrhaU5KZNcpqR874JHUd39pawiCZKfDzCQFx8+otBctTOcFOe4I3e lpALDQ5kuCxXZAvtaZbIqg+obQKBgQDw0kjgf02j3Lw/ZmeHr56AjzJE5b2kT9O9 3Vd59Qy24egnC3NTvLxIDhEOYgoo2PYG3I7w6MXMGHAVjZO18+laDWcWuRTkJY4K VIkEVl1biZQ4TahO7uVriLK+YQSh4jP3P94V0me82GO4cY4DqSYsJDaL1z+OGTtz v9EhuEsZAwKBgA8llfr3cJdHUUM4GG3p0bF7EnwBa1xR4hAy8Q+1ZOSLzRzU6r7i /yCY1LRdGb3bnP5TQFntZbxh06aHsBLTBlps7KuCvJUIn7KYAugt9AiQoVwybyfI yauoJjRbRPSiTuUkRpVFVpS7og34XAT/hWqbWz3h4CtpvfEMuvY44heVAoGBAKpd aVcAWFGzB62maVlxISV7qClbifSi0H3CB29sr2j1mgF9NUIpA93JrcFKFDvfePVT tP+y/LMtGqX0uWmAOzYMw0AtAR2Bf+HI+gGKg5MNWkEWlxn4IW8YjrLl+Zv4ZaDl mtw/NEpBnxJNqxTl5e5WVAxL41dIfGmfanh7Yw03AoGBAL0Nz07krlAiarh7VExf Jbxh4Ljdd8Ira701plnsHTZsyHvT9Z29t+t6O6rDzSYPlGp4D7fH+Z/3AyA9VENV GQCYthKSrMZCumXBZeEpfv5T+T2C6kzRelaol8FwDBnRlftMsD2BBURDzH+1JAJr TdqV5ArhrlxzXFiUzMqrwZ7V -----END PRIVATE KEY-----',
    "pusher": {
        "appId": '416789',
        "key": 'df7517e09f436d4b080b',
        "cluster": 'ap1',
    },
    ...commonConfig
}