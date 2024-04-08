# vue-property-decorator使用指南

## 1.安装

```bash
npm install --save vue-class-component
npm install --save vue-property-decorator
```

## 2.用法
- `@Component (from vue-class-component)`
- `@Prop`
- `@Model`
- `@Watch`
- `@Emit`
- `@Inject`
- `@Provide`
- `Mixins (the helper function named mixins defined at vue-class-component)`

## 3.示例

### `@Component`

即使没有组件也不能省略@Component，否则会报错。

```vue
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue { 
}
</script>
```

**组件引用**

```vue
import { Component, Vue } from "vue-property-decorator";
import DemoComponent"./DemoComponent.vue";
@Component({
  components: {
    DemoComponent
  }
})
export default class YourComponent extends Vue { 
}
```

### `@Prop `

父子组件之间值的传递

```vue
import { Vue, Component, Prop } from 'vue-property-decorator'
 
@Component
export default class Component extends Vue {
  // number类型
  @Prop(Number) readonly propA: number | undefined
  // 默认值为'default value'
  @Prop({ default: 'default value' }) readonly propB!: string
  @Prop([String, Boolean]) readonly propC: string | boolean | undefined
  @Prop({
        default: () => {
            return [];
        }
  })
  readonly propD: {}[]
}
```

相当于

```vue
export default {
  props: {
    propA: {
      type: Number,
    },
    propB: {
      default: 'default value',
    },
    propC: {
      type: [String, Boolean],
    },
    propD: {
      default () {
           return []
      }
    }
  },
}
```
### `@PropSync`

相当于在父组件中添加.sync装饰器, 使子组件也可以更新prop的值。具体查看.sync 修饰符

```vue
<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator'
@Component
export default class extends Vue {
  @PropSync('name', { type: String }) syncedName!: string; // 用来实现组件的双向绑定
 
  changeName(): void {
    this.syncedName = '子组件修改过后的syncedName!'; // 更改syncedName会更改父组件的name 
  }
}
</script>
```

### `@Model`

```vue
//(1) 在父组件中,如: Home.vue文件
<template>
    <div id="Home">
        <p>{{message}}</p>
        <News v-model="messgae"></News> // 使用组件News,同时通过v-model属性传递数据变量message的值
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import News from "@/components/Home/News/Index.vue"; // 引入组件
    
    export default class Home extends Vue{
        message="VueAndTypeScript"; // 变量初始化
    }
</script>

//(2) 在子组件中, 如: News文件夹下的index.vue文件
<template>
    <div id="News">
        <label>
            改变父组件中的message数据:
            <input @input="handleInput" :value="msg" @input="handleInput"/> //通过v-bind属性将父组件传递的数据绑定给input标签,同时监听input标签的input事件
        </label>
    </div>
</template>
<script lang="ts">
    import { Vue,Component, Emit, Model } from "vue-property-decorator"; // 引入模块
    @Component({ // 组件管理
        name:"News"
    })
    // 继承类
    export default class News extends Vue{
        @Model('receiveChange',{ type: String }) // 使用Model构造器接收从父组件中通过v-model传递数据,同时声明自定义事件receiveChange
        msg!: string;
    
        @Emit("receiveChange") // 通过Emit构造器发送自定义事件receiveChange,通过input事件方法handleInput将改变后的值传递给父组件
        handleInput(e: any ){
            return e.target.value
        }
    }
</script>
```

### `@Watch 监听属性`

```vue
<template>
    <div id="Home">
        </p>{{msg}}</p>
        <button @click="handleClcik">变化</button> // 通过点击事件使msg值变化
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'; // 引入相关构造器
    @Component({
        name:"Home" // 声明当前组件名称
    })
    export default class Home extends Vue{
        msg="TypeScriptAndVue"; // 声明变量msg;
        
        // 声明事件(在Vue+TypeScript开发模式中,事件方法的声明方式直接在类中正常声明即可)
        handleClick(){ // 监听一个点击事件
            this.msg="VueAndTypeScript";
        }
        
        // 使用Watch构造器监听属性的变化
        @Watch('msg')
        handleMsgChange(newVal:string,oldVal:string){
            console.log('新的msg变量值为:'+newVal);
            console.log('旧的msg变量值为:'+oldVal);
        }
    }
</script>
```

### `@Emit`

(1) 在子组件中,如: News文件夹下的index.vue文件中

```vue
<template>
    <div id="News">
        <ul>
            <li v-for="item in user" :key="item.id" @click="handleClick">{{item.name}}</li>
        </ul>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Prop, Emit } from 'vue-property-decorator'; // 引入相关构造器
    
    // 定义接口User,接口首字母必须大写
    interface User{
        id:number;
        name:string;
    }
    
    // 组件管理
    @Component({
        name:"News" // 当前组件名称
    })
    
    export default class News extends Vue{
         // 使用Prop构造器接收父组件传递进来的数据
        @Prop({type:Array,default:[]})
        user!: Array<User>; // 使用非空断言 '!'(若是不使用会报错)
        
        // 使用Emit构造器向父组件发送消息
        @Emit("receiveInfo") // 通过点击事件handleClick发送自定义事件receiveInfo,同时传递信息 item
        handleClick(item:User){
            return item;
        }
    }
</script>
```

(2) 在父组件中,如: Home.vue文件
```vue
<template>
    <div id="Home">
        <News :user="users" @receiveInfo="handleChild"></News> // 使用组件,传递users数据,同时监听自定义事件receiveInfo以获取子组件传递的消息
    </div>
</template>


<script lang="ts">
import { Vue,Component } from 'vue-property-decorator';
import News from '@/components/Home/News/index.vue'; // 引入组件
    
    // 定义User接口
    interface User{
        id:number;
        name:string;
    }
    
    // 组件管理
    @Component({
        name:"Home",
        components:{
            News
        }
    })
    export default class Home extends Vue{
        // 初始化从数据
        users:Array<User>=[
            {
                id:1,
                name:"动漫"
            },
            {
                id:2,
                name:"游戏"
            }
        ]
    }
    
    // 事件处理
    handleChild(item: User){ // 接收子组件传递过来的参数
        ...代码逻辑
        console.log('我接收到了:'+item.name)
    }
</script>
```

### mixins 混入公共方法

```js
import { Component, Vue } from "vue-property-decorator";
import mixinsMethod from '@/plugins/mixins.js';

@Component({
  components: {},
  mixins:[mixinsMethod]
})
export default class YourComponent extends Vue { 
}
```

### computed 计算属性

```js
import { Component, Vue } from "vue-property-decorator";
@Component 
export default class YourComponent extends Vue {
  type:  number = 0
  // 计算属性
  get getName() {
    let type: any = {
      1: 'Taobao',
      2: 'Pdd',
     };
     return type[this.type];
  } 
}

```
