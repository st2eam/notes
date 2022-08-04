# 什么是访问控制

访问控制RAM（Resource Access Management）是阿里云提供的管理用户身份与资源访问权限的服务。

## 功能特性

RAM允许在一个阿里云账号下创建并管理多个身份，并允许给单个身份或一组身份分配不同的权限，从而实现不同用户拥有不同资源访问权限的目的。RAM的功能特性如下：

- 集中控制RAM用户及其密钥：管理每个RAM用户及其访问密钥，为用户绑定多因素认证MFA（Multi Factor Authentication）设备。
- 集中控制RAM用户的访问权限：控制每个RAM用户访问资源的权限。
- 集中控制RAM用户的资源访问方式：确保RAM用户在指定的时间和网络环境下，通过安全信道访问特定的阿里云资源。
- 集中控制云资源：对RAM用户创建的实例或数据进行集中控制。当用户离开组织时，实例或数据不会丢失。
- 单点登录SSO（Single Sign On）管理：支持与企业身份提供商IdP（Identity Provider）进行用户SSO或角色SSO。

# 什么是STS

阿里云STS（Security Token Service）是阿里云提供的一种临时访问权限管理服务。RAM提供RAM用户和RAM角色两种身份。其中，RAM角色不具备永久身份凭证，而只能通过STS获取可以自定义时效和访问权限的临时身份凭证，即安全令牌（STS Token）。

## 功能特性

- **使用RAM用户扮演角色时获取STS Token**
  
  有权限的RAM用户可以使用自己的访问密钥调用[AssumeRole](https://help.aliyun.com/document_detail/28763.htm#reference-clc-3sv-xdb)接口，以获取某个RAM角色的STS Token，从而使用STS Token访问阿里云资源。
  
  通常用于跨账号访问场景和临时授权场景。更多信息，请参见[使用RAM角色](https://help.aliyun.com/document_detail/116820.htm#task-221553 "本文为您介绍RAM用户如何通过控制台和API扮演可信实体为阿里云账号的RAM角色。")、[跨阿里云账号的资源授权](https://help.aliyun.com/document_detail/93745.htm#task-es5-cgk-xdb "当一个企业希望将部分业务授权给另一个企业时，可以使用RAM角色进行跨阿里云账号授权来管理资源的授权及访问。")和[移动应用使用临时安全令牌访问阿里云](https://help.aliyun.com/document_detail/93744.htm#concept-tdn-n2k-xdb)。

- **角色SSO时获取STS Token**
  
  进行角色SSO时，通过调用[AssumeRoleWithSAML](https://help.aliyun.com/document_detail/109979.htm#reference-qrl-qcb-1hb)接口，以获取某个RAM角色的STS Token，从而使用STS Token进行单点登录（SSO登录）。更多信息，请参见[SAML角色SSO概览](https://help.aliyun.com/document_detail/109791.htm#task-zrv-2ny-zgb "阿里云与企业进行角色SSO时，阿里云是服务提供商（SP），而企业自有的身份管理系统则是身份提供商（IdP）。通过角色SSO，企业可以在本地IdP中管理员工信息，无需进行阿里云和企业IdP间的用户同步，企业员工将使用指定的RAM角色登录阿里云。")。

## 产品优势

- 使用STS Token，减少长期访问密钥（Accesskey）泄露的风险。
- STS Token具有时效性，可以自定义有效期，到期后将自动失效，无需定期轮换。
- 可以为STS Token绑定自定义权限策略，提供更加灵活和精细的云资源授权。

# 授权访问

## 使用STS进行临时授权

OSS可以通过阿里云STS（Security Token Service）进行临时授权访问。阿里云STS是为云计算用户提供临时访问令牌的Web服务。通过STS，您可以为第三方应用或子用户（即用户身份由您自己管理的用户）颁发一个自定义时效和权限的访问凭证。关于STS的更多信息，请参见[STS介绍](https://help.aliyun.com/document_detail/28756.htm#reference-ong-5nv-xdb)。

STS的优势如下：

- 您无需透露您的长期密钥（AccessKey）给第三方应用，只需生成一个访问令牌并将令牌交给第三方应用。您可以自定义这个令牌的访问权限及有效期限。
- 您无需关心权限撤销问题，访问令牌过期后自动失效。

通过STS服务生成临时访问凭证。示例代码如下：

> **注意** 使用express模块前，请确保已安装express模块。如果未安装，请执行npm install express --save命令进行安装。

```javascript
// 通过STS服务生成临时访问凭证。临时访问凭证包括临时访问密钥（AccessKeyId和AccessKeySecret）和安全令牌（SecurityToken）。
const { STS } = require('ali-oss');
const express = require("express");
const app = express();

app.get('/sts', (req, res) => {
 let sts = new STS({
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret'
});
  // roleArn填写角色ARN。
  // policy填写自定义权限策略。
  // expiration用于设置临时访问凭证有效时间单位为秒，最小值为900，最大值以当前角色设定的最大会话时间为准。
  // sessionName用于自定义角色会话名称，用来区分不同的令牌，例如填写为SessionTest。
  sts.assumeRole('roleArn', 'policy', 'expiration', 'sessionName').then((result) => {
    console.log(result);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-METHOD', 'GET');
    res.json({
      AccessKeyId: result.credentials.AccessKeyId,
      AccessKeySecret: result.credentials.AccessKeySecret,
      SecurityToken: result.credentials.SecurityToken,
      Expiration: result.credentials.Expiration
    });
  }).catch((err) => {
    console.log(err);
    res.status(400).json(err.message);
  });
});
app.listen(8000,()=>{
   console.log("server listen on:8000")
})
```

在客户端使用临时访问凭证初始化OSSClient，用于临时授权访问OSS资源。示例代码如下：

```ts
const axios = require("axios");
const OSS = require("ali-oss");

// 在客户端使用临时访问凭证初始化OSS客户端，用于临时授权访问OSS资源。
const getToken = async () => {
  // 设置客户端请求访问凭证的地址。
  await axios.get("https:/xxx/sts").then((token) => {
    const client = new OSS({
       // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      region: 'yourRegion',
      accessKeyId: token.AccessKeyId,
      accessKeySecret: token.AccessKeySecret,
      stsToken: token.SecurityToken,
      // 填写Bucket名称，例如examplebucket。
      bucket: "examplebucket",
      // 刷新临时访问凭证。
      refreshSTSToken: async () => {      
        const refreshToken = await axios.get("https://127.0.0.1/sts");
        return {
          accessKeyId: refreshToken.AccessKeyId,
          accessKeySecret: refreshToken.AccessKeySecret,
          stsToken: refreshToken.SecurityToken,
        };
      },
    });
  });
};
```

## 使用签名URL进行临时授权

以下介绍使用签名URL进行临时授权的常见示例。

- 生成签名URL
  
  您可以将生成的签名URL提供给访客进行临时访问。生成签名URL时，您可以自定义URL的过期时间来限制访客的访问时长。
  
  > **注意** 通过以下示例生成的签名URL中如果包含特殊符号`+`，可能出现无法正常访问该签名URL的现象。如需正常访问该签名URL，请将签名URL中的`+`替换为`%2B`。

- 使用签名URL上传和下载文件
  
  > **说明** name {String}表示存放在OSS的Object名称，[expires] {Number}表示URL过期时间，默认值为1800秒。其他参数相关说明，请参见 [Github](https://github.com/ali-sdk/ali-oss#signatureurlname-options)。
  
  以下代码用于生成对应签名URL来上传和下载文件。
  
  ```javascript
  const OSS = require('ali-oss');
  
  const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region: 'yourRegion',
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: 'yourAccessKeyId',
    accessKeySecret: 'yourAccessKeySecret',
    // 填写Bucket名称。
    bucket: 'examplebucket'
  });
  
  // 获取下载exampleobject.txt文件的签名URL，使用浏览器访问时默认直接预览要下载的文件。
  // 填写不包含Bucket名称在内的Object完整路径。
  const url = client.signatureUrl('exampleobject.txt');
  console.log(url);
  
  // 获取下载exampleobject.txt文件的签名URL，配置文件HTTP头中的Content-Disposition为attachment，实现浏览器访问时自动下载文件，并自定义下载后的文件名称。
  // 如果您希望直接在浏览器中预览文件，配置文件HTTP头中的Content-Disposition为inline并使用Bucket绑定的自定义域名进行访问。
  const filename = 'ossdemo.txt' // 自定义下载后的文件名称。
  const response = {
    'content-disposition': `attachment; filename=${encodeURIComponent(filename)}`
  }
  // 填写不包含Bucket名称在内的Object完整路径。
  const url = client.signatureUrl('exampleobject.txt', { response });
  console.log(url);
  
  // 获取上传exampleobject.txt文件的签名URL，并设置过期时间。
  // 填写不包含Bucket名称在内的Object完整路径。
  const url = client.signatureUrl('exampleobject.txt', {
    // 设置过期时间，默认值为1800秒。
    expires: 3600, 
    // 设置请求方式为PUT。默认请求方式为GET。
    method: 'PUT'  
  });
  console.log(url);
  
  // 获取上传exampleobject.txt文件的签名URL，并设置Content-Type。
  // 填写不包含Bucket名称在内的Object完整路径。
  const url = client.signatureUrl('exampleobject.txt', {
    expires: 3600, 
    method: 'PUT',
    'Content-Type': 'text/plain; charset=UTF-8',
  });
  console.log(url);
  ```

- 生成带图片处理参数的签名URL
  
  以下代码用于生成带图片处理参数的签名URL。
  
  ```javascript
  let OSS = require('ali-oss');
  let store = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region: 'yourRegion',
    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
    accessKeyId: 'yourAccessKeyId',
    accessKeySecret: 'yourAccessKeySecret',
    // 填写Bucket名称。
    bucket: 'examplebucket'
  })
  
  // 获取处理exampleobject.png图片的签名URL。
  // 填写不包含Bucket名称在内的Object完整路径。
  const url = store.signatureUrl('exampleobject.png', {
    process: 'image/resize,w_200' // 设置图片处理参数。
  });
  console.log(url);
  
  // 获取处理exampleobject.png图片的签名URL，并设置过期时间。
  // 填写不包含Bucket名称在内的Object完整路径。
  const url = store.signatureUrl('exampleobject.png', { 
    // 设置过期时间，默认值为1800秒。
    expires: 3600, 
    // 设置图片处理参数。
    process: 'image/resize,w_200' 
  });
  console.log(url);
  ```
