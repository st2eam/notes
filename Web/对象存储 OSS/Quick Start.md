# 快速入门

本文介绍如何在Node.js环境中快速使用OSS服务，包括查看存储空间（Bucket） 列表、上传文件（Object）等。

## 前提条件

已完成初始化。具体操作，请参见[初始化](https://help.aliyun.com/document_detail/111256.htm#concept-d5g-1y1-dhb "本文介绍如何初始化Node.js SDK。")。

## 查看存储空间列表

以下代码用于查看存储空间列表。

```js
const OSS = require('ali-oss');

const client = new OSS({
  // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
  region: 'yourRegion',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret'
});

async function listBuckets() {
  try {
    const result = await client.listBuckets();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

listBuckets();
```

## 查看文件列表

以下代码用户查看文件列表。

```js
let OSS = require('ali-oss');

let client = new OSS({
  // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
  region: 'yourRegion',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret',
  // 填写Bucket名称。
  bucket: 'yourBucketName',
});

async function list () {
    // 不带任何参数，默认最多返回100个文件。
    let result = await client.list();
    console.log(result);
}

list();
```

## 上传文件

以下代码用于上传单个文件。

```js
const OSS = require('ali-oss')
const path = require("path")

const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'yourregion',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret',
  // 填写Bucket名称。关于Bucket名称命名规范的更多信息，请参见Bucket。
  bucket: 'examplebucket',
});

const headers = {
  // 指定该Object被下载时网页的缓存行为。
  // 'Cache-Control': 'no-cache', 
  // 指定该Object被下载时的名称。
  // 'Content-Disposition': 'oss_download.txt', 
  // 指定该Object被下载时的内容编码格式。
  // 'Content-Encoding': 'UTF-8', 
  // 指定过期时间。
  // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT', 
  // 指定Object的存储类型。
  // 'x-oss-storage-class': 'Standard', 
  // 指定Object的访问权限。
  // 'x-oss-object-acl': 'private', 
  // 设置Object的标签，可同时设置多个标签。
  // 'x-oss-tagging': 'Tag1=1&Tag2=2', 
  // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  // 'x-oss-forbid-overwrite': 'true', 
};

async function put () {
  try {
    // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
    const result = await client.put('exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt'));
    // const result = await client.put('exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt'), { headers });   
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

put(); 
```

## 下载文件

以下代码用于下载单个文件。

```js
let OSS = require('ali-oss');

let client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'yourRegion',
  //  阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret',
  // 填写Bucket名称。
  bucket: 'examplebucket'
});

async function get () {
  try {
    // 填写Object完整路径和本地文件的完整路径。Object完整路径中不能包含Bucket名称。
    // 如果指定的本地文件存在会覆盖，不存在则新建。
    // 如果未指定本地路径，则下载后的文件默认保存到示例程序所属项目对应本地路径中。
    let result = await client.get('exampleobject.txt', 'D:\\localpath\\examplefile.txt');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

get();        
```

## 删除单个文件

以下代码用于删除单个文件。

```js
const OSS = require('ali-oss')

const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'yourRegion',
  //  阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret',
  // 填写Bucket名称。
  bucket: 'examplebucket',
});

async function deleteFile () {
  try {
    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    let result = await client.delete('exampleobject.txt');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

deleteFile();
```
