## 前提条件

- 已开通阿里云对象存储OSS服务。

- 已创建RAM用户的AccessKey ID和AccessKey Secret。
  
  由于云账号AccessKey拥有所有API的访问权限，建议使用RAM用户的AccessKey。如果部署在服务端，请使用RAM或STS的方式进行API访问或日常运维管控操作；如果部署在客户端，请使用STS方式进行API访问。

## 安装

```bash
npm install ali-oss --save
```

## 使用方式

Node.js SDK支持同步和异步的使用方式。无论同步方式还是异步方式，均使用`new OSS()`创建client。

- 同步方式：基于`async`和`await`方式，异步编程同步化。
- 异步方式：类似Callback的方式，API接口返回[Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)，使用`.then()`处理返回结果，使用`.catch()`处理错误。

先使用同步方式上传文件，再使用异步方式下载文件的示例代码如下：

- 同步方式
  
  ```javascript
  let client = new OSS(...);
  async function put () {
    try {
      // 'object'填写上传至OSS的object名称,即不包括Bucket名称在内的Object的完整路径。
      // 'localfile'填写上传至OSS的本地文件完整路径。
      let r1 = await client.put('object','localfile'); 
      console.log('put success: %j', r1);
      let r2 = await client.get('object');
      console.log('get success: %j', r2);
    } catch(e) {
      console.error('error: %j', e);
    }
  }
  await put();
  ```

- 异步方式
  
  ```js
  let client = new OSS(...);
  
  // 'object'填写从OSS下载的object名称，即不包括Bucket名称在内的Object的完整路径。
  // 'localfile'填写下载到本地文件的完整路径。
  client.put('object', 'localfile').then(function (r1) {
    console.log('put success: %j', r1);
    return client.get('object');
  }).then(function (r2) {
    console.log('get success: %j', r2);
  }).catch(function (err) {
    console.error('error: %j', e);
  });
  ```

## 初始化

创建一个`app.js`文件并写入如下内容：

```js
let OSS = require('ali-oss');

let client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'yourRegion',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret',
  // 填写Bucket名称。
  bucket: 'examplebucket',
  stsToken:'token.SecurityToken'
});
```

`stsToken`:使用临时授权方式。更多信息，请参见[使用STS进行临时授权](https://help.aliyun.com/document_detail/32077.htm#section-zkq-3rq-dhb)。

## 图片处理持久化

以下代码用于图片处理持久化：

```javascript
const OSS = require('ali-oss');

const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'yourregion',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: 'yourAccessKeyId',
  accessKeySecret: 'yourAccessKeySecret',
  // yourbucketname填写存储空间名称。
  bucket: 'yourbucketname'
});

const sourceImage = 'sourceObject.png';
const targetImage = 'targetObject.jpg';
async function processImage(processStr, targetBucket) {
  const result = await client.processObjectSave(
    sourceImage,
    targetImage,
    processStr,
    targetBucket
  );
  console.log(result.res.status);
}

// 图片处理持久化：缩放。
processImage("image/resize,m_fixed,w_100,h_100")

// 图片处理持久化：裁剪。
processImage("image/crop,w_100,h_100,x_100,y_100,r_1")

// 图片处理持久化：旋转。
processImage("image/rotate,90")

// 图片处理持久化：锐化。
processImage("image/sharpen,100")

// 图片处理持久化：水印。
processImage("image/watermark,text_SGVsbG8g5Zu-54mH5pyN5YqhIQ")

// 图片处理持久化：格式转换。
processImage("image/format,jpg")

// 图片处理持久化：格式转换，并设置保存图片处理持久化结果的目标bucket。
processImage("image/format,jpg", "target bucket")
```
