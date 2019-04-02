const axios = require('axios')
const tree_api_request = require('./tree')
const metadataRequest = require('./metadataRequest')
require('dotenv').config()

var payload = JSON.parse(JSON.stringify(tree_api_request))
var metaDataPayload = JSON.parse(JSON.stringify(metadataRequest))
let config = {
    headers:{
        'Content-Type':'application/json',
        'Token':'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',
        'EventName':'GetUINavigationTreeV1',
        'MODE':'LIVE',
        'Environment':'15'
    }
}

let authConfig = {
    headers:{
        "Content-Type":"application/json"
    }
}

let authPayload = {
    "ServiceRequestDetail": {
      "ServiceRequestVersion": "2.0",
      "OwnerId": "41",
      "BrowserIp": "192.168.74.31",
      "ResponseType": "json"
    },
    "UserCredential": {
      "UserName": "britecoagent",
      "Password": "sKVSbX7wj8UYYAaar4amxQ=="
    }
}


const invokeMetaData = (token,payload,tree)=>{
    let metaDataHeader = {
        headers:{
            "Content-Type":"application/json",
            "Environment":"15",
            "MODE":"LIVE",
            "Token":token
        }
    }
    payload.ServiceRequestDetail.Token = token;
    tree.data.map(async page=>{
        let metaDataRequest = payload;
        let applicationType = page.navigationParams.applicationType;
        let applicationObjectName = page.navigationParams.applicationObjectName;
        let subApplicationType = page.navigationParams.subApplicationType;
        let subApplicationName = page.navigationParams.subApplicationName;

        console.log(applicationType,applicationObjectName,subApplicationType,subApplicationName)

        metaDataRequest.ObjectName = applicationObjectName;
        metaDataRequest.ApplicationType = applicationType;
        metaDataRequest.SubApplicationType = subApplicationType;
        metaDataRequest.SubApplicationNameList = []
        metaDataRequest.SubApplicationNameList.push({"SubApplicationName":subApplicationName})
        await axios.post('https://uciapplicationservice.solartis.net/ApplicationServiceV5/ApplicationService5/getMetaDataV2',metaDataRequest,metaDataHeader)
        .then(res=>console.log('MetaData ',res.data.ApplicationDetail.SubApplicationDetailList))
        .catch(err=>console.log(err))
    })
}
const invokeTree =  (token,payload)=>{
    let treeHeader = {
            headers:{
                'Content-Type':'application/json',
                'Token':token,
                'EventName':'GetUINavigationTreeV1',
                'MODE':'LIVE',
                'Environment':'15'
            }
    }
    payload.ServiceRequestDetail.Token = token;
     axios.post('https://ucicomruntimev6-2.solartis.net/KnowledgeEngineV6_2/KnowledgeBase/FireEventV2',payload,treeHeader).then(res=>{
        invokeMetaData(token,metaDataPayload,res.data)
     }).catch(err=>console.log(err))
}



const authInvoke = async ()=>{
    await axios.post('https://ucicommonservice.solartis.net/CommonServiceV2_1/AuthenticationServiceV2/requestService',authPayload,authConfig).then(response=>{
        const token = response.data.Token;
        payload.ServiceRequestDetail.Token = token;
        console.log(payload)
        invokeTree(token,payload)
    }).catch(err=>console.log(err))
}

authInvoke()
 