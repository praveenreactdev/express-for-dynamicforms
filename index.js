const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path');
const metadata = require('./metadata/metadata')
let metaDataRequest = require('./metadataRequest')
const app = express();
const  Axios = require('axios');
const tree_payload = require('./tree')
const sysConfig = require('./dbConnectionPool');
let tree_request = tree_payload

const allowCrossDomain = (req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(allowCrossDomain);

let authConfig = {
    headers:{
        "Content-Type":"application/json",
        "MODE":"LIVE",
        "Environment":"15"
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
let treeHeader = {
    headers:{
        'Content-Type':'application/json',
        'Token':'',
        'EventName':'GetUINavigationTreeV1',
        'MODE':'LIVE',
        'Environment':'15'
    }
}

let authURL = 'https://ucicommonservice.solartis.net/CommonServiceV3_1/AuthenticationServiceV3/requestService'
let treeURL = 'https://ucicomruntimev6-2.solartis.net/KnowledgeEngineV6_2/KnowledgeBase/FireEventV2'

app.get('/getPages/getInsuredPage',(req,res)=>{
    fs.readFile(path.join(__dirname,'Insured_Response.json'),'utf-8',(err,content)=>{
        res.json(JSON.parse(content));
     })
})
app.get('/getPages/getAddnInformation', (req, res) => {
    fs.readFile(path.join(__dirname,'AdditionalInformation.json'),'utf-8',(err,content)=>{
        res.json(JSON.parse(content));
     })
});

app.get('/getPages/getAddnInsured', (req, res) => {
    fs.readFile(path.join(__dirname,'AdditionalInsured.json'),'utf-8',(err,content)=>{
        res.json(JSON.parse(content));
     })
});

app.get('/getPages/getAddnQuestions', (req, res) => {
    fs.readFile(path.join(__dirname,'ApplicationQuestions.json'),'utf-8',(err,content)=>{
        res.json(JSON.parse(content));
     })
});

app.get('/getPages',(req,res)=>{
    fs.readFile(path.join(__dirname,'getPages.json'),'utf-8',(err,content)=>{
        res.json(JSON.parse(content));
     })
})

app.get('/getTree',async (request,response)=>{
   await invokeTree().then(
       res=>{
        response.json(res.data)
       }
   )
})

app.post('/getMetaData',async (req,response)=>{
    await invokeMetaData(req.body).then(res=>{
        response.json(res.data)
    })
})

const invokeTree = ()=>{
    return new Promise(async (resolve,reject)=>{
        await Axios.post(authURL,authPayload,authConfig)
        .then(
           (authResponse)=>{
            const token = authResponse.data.Token;
            console.log('token is %o',token)
            tree_request.ServiceRequestDetail.Token = token;
            treeHeader.headers.Token = token
            
                Axios.post(treeURL,tree_request,treeHeader).
                then((treeResponse)=>{
                        resolve({
                            data:treeResponse.data
                        })
                }).catch(err=>{
                    console.log(err)
                    reject({err})
                })
           }
        )
        .catch(err=>{
            console.log(err)
            reject({err})
        })
    })
}

let metaDataURL = 'https://ucipmtapplicationservice.solartis.net/ApplicationServiceV5/ApplicationService5/getMetaDataV3'
let metaDataHeader = {
    headers:{
        "Content-Type":"application/json",
        "Environment":"15",
        "MODE":"LIVE",
        "Token":"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"
    }
}
const invokeMetaData = (navigationParams)=>{
    let mDataRequest = metaDataRequest
   // console.log(mDataRequest)
    let {applicationObjectName,applicationType,subApplicationType,subApplicationName} = navigationParams

    mDataRequest.ObjectName = applicationObjectName;
    mDataRequest.ApplicationType = applicationType;
    mDataRequest.SubApplicationType = subApplicationType;
    mDataRequest.SubApplicationNameList = []
    mDataRequest.SubApplicationNameList.push({"SubApplicationName":subApplicationName})
    return new Promise(async (resolve,reject)=>{
        await Axios.post(metaDataURL,metaDataRequest,metaDataHeader).then((response)=>{
            console.log(response.data)
            resolve({
                data:response.data
            })
        }).catch(err=>{
            console.log(err)
            reject({err})})
    })
}

app.post('/api/getOwnerId', (req, res) => {
    let body = req.body;
    let domainName = body.domainName;
    sysConfig.sysConfigPool.query(sysConfig.sqls.getSysConfigValue,[domainName,'Y'], function (error, results, fields) {
      if (error) throw error;
      if(results.length>0) {
        let OwnerId = results[0].ATTRIBUTE_VALUE;
        let Mode = results[0].MODE;
        let Environment = results[0].ENVIRONMENT;
        res.send({ OwnerId, Mode, Environment});
      } else {
        res.send({ error: 'No records found'});
      }
    });
  });
  
  app.post('/api/login', (req, res) => {
    let body = req.body;
    console.log("Request to actual service : %o", body)
    let url = 'https://ucicommonservice.solartis.net/CommonServiceV3_1/AuthenticationServiceV3/requestService'
    let headers = {
      headers:{
        "Content-Type":"application/json",
        "MODE":"LIVE",
        "Environment":"15"
      }
    }
    const axios = require('axios');
    axios.post(url,body,headers).then(response=>{
      console.log(response.data)
      res.send(response.data)
    })
  
  });
  
  app.get('/api/encrypt/:password', (req, res) => {
    var request = require('request');
    var password = req.params.password;
    var headers = {
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryjx3P0QlaBkH15oNY',
        'accept': 'application/json, text/plain, */*'
    };
  
    var dataString = '$------WebKitFormBoundaryjx3P0QlaBkH15oNY\r\nContent-Disposition: form-data; name="file"\r\n\r\nundefined\r\n------WebKitFormBoundaryjx3P0QlaBkH15oNY\r\nContent-Disposition: form-data; name="data"\r\n\r\n{"textToEncrypt":"'+ password +'","secretKey":"3FCCB01F507E8EB0","mode":"ECB","keySize":"128","dataFormat":"Base64"}\r\n------WebKitFormBoundaryjx3P0QlaBkH15oNY--\r\n';
    
    let url = 'https://www.devglan.com/online-tools/aes-encryption'
    const axios = require('axios');
    axios.post(url,dataString,headers).then(response=>{
      console.log(response.data)
      if (response.statusCode == 200) {
        let resp=JSON.parse(body);
        let tempResponse = { 
          inputText: resp.textToEncrypt,
          encryptedText: resp.output
        };
        console.log("["+new Date().getTime()+":"+req.connection.remoteAddress+"] Message:: "+JSON.stringify(tempResponse));
        res.send(tempResponse);
      } else {
        res.send({
          error: 500
        })
      }
    })  
  });




app.listen(5500, () => {
    console.log("Server is listening on port 5500");
});