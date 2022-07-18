## Introduction

Joi允许您使用简单、直观和可读的语言描述数据。

### Example

[joi.dev - Schema Tester v17.6.0](https://joi.dev/tester)

```ts
//Insert your joi schema here 
const Joi = require('joi');

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2022),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'birth_year')
    .xor('password', 'access_token')
    .with('password', 'repeat_password')


schema.validate({ username: 'abc', birth_year: 1994 });
// -> { value: { username: 'abc', birth_year: 1994 } }

schema.validate({});
// -> { value: {}, error: '"username" is required' }

// Also -

try {
    const value = await schema.validateAsync({ username: 'abc', birth_year: 1994 });
}
catch (err) { }
```

### [General Usage](https://joi.dev/api/?v=17.6.0#general-usage)

用法分为两步

首先，使用提供的类型和约束构造模式:

```ts
const schema = Joi.object({
    a: Joi.string()
});
```

> 注意：joi模式对象是不可变的，这意味着每增加一条规则(例如`.min(5)`)都会返回一个新的模式对象。

其次，根据定义的模式验证该值:

```ts
const { error, value } = schema.validate({ a: 'a string' });
```

如果输入有效，则`error`将是`undefined`的。如果输入无效，则为`error`分配一个`ValidationError`对象，提供更多信息。

模式可以是一个普通的JavaScript对象，其中每个键都被分配一个joi类型，或者它可以是一个直接的joi类型:

```ts
const schema = Joi.string().min(10);
```

如果模式是joi类型，可以直接对该类型调用`schema.validate(value)`。当传递一个非类型模式对象时，模块会在内部将其转换为一个`object()`类型，等价于:

```ts
const schema = Joi.object().keys({
    a: Joi.string()
});
```

**验证模式时**:

默认情况下，`Values`(对于对象，则为`keys`)是可选的。

要禁止此行为，你可以将模式设置为`required()`，或者在传递选项时将`presence`设置为"`required`":

```ts
Joi.string().required().validate(undefined);
// or
Joi.string().validate(undefined, /* options */ { presence: "required" });
```

字符串默认为utf-8编码。

规则以添加的方式定义，并按顺序求值，首先是包含规则，然后是排他规则。
