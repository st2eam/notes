import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.B-C7vMfR.js";const c=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Design Patterns/原型模式.md","filePath":"Design Patterns/原型模式.md"}'),h={name:"Design Patterns/原型模式.md"},p=n(`<h2 id="原型模式-prototype-pattern" tabindex="-1">原型模式（Prototype Pattern） <a class="header-anchor" href="#原型模式-prototype-pattern" aria-label="Permalink to &quot;原型模式（Prototype Pattern）&quot;">​</a></h2><p>原型模式（Prototype Pattern）是用于创建重复的对象，同时又能保证性能。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。</p><p>这种模式是实现了一个原型接口，该接口用于创建当前对象的克隆。当直接创建对象的代价比较大时，则采用这种模式。例如，一个对象需要在一个高代价的数据库操作之后被创建。我们可以缓存该对象，在下一个请求时返回它的克隆，在需要的时候更新数据库，以此来减少数据库调用。</p><h3 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-label="Permalink to &quot;介绍&quot;">​</a></h3><p>意图：用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。</p><p>主要解决：在运行期建立和删除原型。</p><p><strong>何时使用</strong>： 1、当一个系统应该独立于它的产品创建，构成和表示时。 2、当要实例化的类是在运行时刻指定时，例如，通过动态装载。 3、为了避免创建一个与产品类层次平行的工厂类层次时。 4、当一个类的实例只能有几个不同状态组合中的一种时。建立相应数目的原型并克隆它们可能比每次用合适的状态手工实例化该类更方便一些。</p><p><strong>如何解决</strong>：利用已有的一个原型对象，快速地生成和原型对象一样的实例。</p><p><strong>应用实例</strong>： 1、细胞分裂。 2、JAVA 中的 Object clone() 方法。</p><p><strong>注意事项</strong>：与通过对一个类进行实例化来构造新对象不同的是，原型模式是通过拷贝一个现有对象生成新对象的。浅拷贝实现 Cloneable，重写，深拷贝是通过实现 Serializable 读取二进制流。</p><h3 id="原型模式适合应用场景" tabindex="-1">原型模式适合应用场景 <a class="header-anchor" href="#原型模式适合应用场景" aria-label="Permalink to &quot;原型模式适合应用场景&quot;">​</a></h3><p>如果你需要复制一些对象，同时又希望代码独立于这些对象所属的具体类， 可以使用原型模式。</p><p>这一点考量通常出现在代码需要处理第三方代码通过接口传递过来的对象时。 即使不考虑代码耦合的情况， 你的代码也不能依赖这些对象所属的具体类， 因为你不知道它们的具体信息。</p><p>原型模式为客户端代码提供一个通用接口， 客户端代码可通过这一接口与所有实现了克隆的对象进行交互， 它也使得客户端代码与其所克隆的对象具体类独立开来。</p><p>如果子类的区别仅在于其对象的初始化方式， 那么你可以使用该模式来减少子类的数量。 别人创建这些子类的目的可能是为了创建特定类型的对象。</p><p>在原型模式中， 你可以使用一系列预生成的、 各种类型的对象作为原型。</p><p>客户端不必根据需求对子类进行实例化， 只需找到合适的原型并对其进行克隆即可。</p><h3 id="实现方式" tabindex="-1">实现方式 <a class="header-anchor" href="#实现方式" aria-label="Permalink to &quot;实现方式&quot;">​</a></h3><ol><li><p>创建原型接口， 并在其中声明 克隆方法。 如果你已有类层次结构， 则只需在其所有类中添加该方法即可。</p></li><li><p>原型类必须另行定义一个以该类对象为参数的构造函数。 构造函数必须复制参数对象中的所有成员变量值到新建实体中。 如果你需要修改子类， 则必须调用父类构造函数， 让父类复制其私有成员变量值。</p></li><li><p>如果编程语言不支持方法重载， 那么你可能需要定义一个特殊方法来复制对象数据。 在构造函数中进行此类处理比较方便， 因为它在调用 new运算符后会马上返回结果对象。</p></li><li><p>克隆方法通常只有一行代码： 使用 new运算符调用原型版本的构造函数。 注意， 每个类都必须显式重写克隆方法并使用自身类名调用 new运算符。 否则， 克隆方法可能会生成父类的对象。</p></li><li><p>你还可以创建一个中心化原型注册表， 用于存储常用原型。</p></li><li><p>你可以新建一个工厂类来实现注册表， 或者在原型基类中添加一个获取原型的静态方法。 该方法必须能够根据客户端代码设定的条件进行搜索。 搜索条件可以是简单的字符串， 或者是一组复杂的搜索参数。 找到合适的原型后， 注册表应对原型进行克隆， 并将复制生成的对象返回给客户端。</p></li><li><p>最后还要将对子类构造函数的直接调用替换为对原型注册表工厂方法的调用。</p></li></ol><h3 id="原型模式优缺点" tabindex="-1">原型模式优缺点 <a class="header-anchor" href="#原型模式优缺点" aria-label="Permalink to &quot;原型模式优缺点&quot;">​</a></h3><p>✅ 你可以克隆对象， 而无需与它们所属的具体类相耦合。 ✅ 你可以克隆预生成原型， 避免反复运行初始化代码。 ✅ 你可以更方便地生成复杂对象。 ✅ 你可以用继承以外的方式来处理复杂对象的不同配置。 ❎ 克隆包含循环引用的复杂对象可能会非常麻烦。</p><h3 id="与其他模式的关系" tabindex="-1">与其他模式的关系 <a class="header-anchor" href="#与其他模式的关系" aria-label="Permalink to &quot;与其他模式的关系&quot;">​</a></h3><ul><li><p>在许多设计工作的初期都会使用工厂方法模式 （较为简单， 而且可以更方便地通过子类进行定制）， 随后演化为使用抽象工厂模式、 原型模式或生成器模式 （更灵活但更加复杂）。</p></li><li><p>抽象工厂模式通常基于一组工厂方法， 但你也可以使用原型模式来生成这些类的方法。</p></li><li><p>原型可用于保存命令模式的历史记录。</p></li><li><p>大量使用组合模式和装饰模式的设计通常可从对于原型的使用中获益。 你可以通过该模式来复制复杂结构， 而非从零开始重新构造。</p></li><li><p>原型并不基于继承， 因此没有继承的缺点。 另一方面， 原型需要对被复制对象进行复杂的初始化。 工厂方法基于继承， 但是它不需要初始化步骤。</p></li><li><p>有时候原型可以作为备忘录模式的一个简化版本， 其条件是你需要在历史记录中存储的对象的状态比较简单， 不需要链接其他外部资源， 或者链接可以方便地重建。</p></li><li><p>抽象工厂、 生成器和原型都可以用单例模式来实现。</p></li></ul><h3 id="实现" tabindex="-1">实现 <a class="header-anchor" href="#实现" aria-label="Permalink to &quot;实现&quot;">​</a></h3><p>我们将创建一个抽象类 Shape 和扩展了 Shape 类的实体类。下一步是定义类 ShapeCache，该类把 shape 对象存储在一个 Hashtable 中，并在请求的时候返回它们的克隆。</p><p>PrototypePatternDemo 类使用 ShapeCache 类来获取 Shape 对象。</p><p><img src="https://www.runoob.com/wp-content/uploads/2014/08/20201202-prototype-pattern.png" alt="image"></p><h4 id="步骤-1" tabindex="-1">步骤 1 <a class="header-anchor" href="#步骤-1" aria-label="Permalink to &quot;步骤 1&quot;">​</a></h4><p>创建一个实现了 Cloneable 接口的抽象类。</p><p>Shape.java</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> abstract</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Shape</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> implements</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Cloneable</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   private</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> String id;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   protected</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> String type;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   abstract</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> draw</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> String </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> type;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> String </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> id;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(String </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.id </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> id;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Object </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">clone</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Object clone </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      try</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         clone </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> super</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">clone</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">catch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (CloneNotSupportedException </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         e.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">printStackTrace</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clone;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="步骤-2" tabindex="-1">步骤 2 <a class="header-anchor" href="#步骤-2" aria-label="Permalink to &quot;步骤 2&quot;">​</a></h4><p>创建扩展了上面抽象类的实体类。</p><p>Rectangle.java</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Rectangle</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Shape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Rectangle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     type </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Rectangle&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> draw</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      System.out.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Inside Rectangle::draw() method.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Square.java</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Square</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Shape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Square</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     type </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Square&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> draw</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      System.out.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Inside Square::draw() method.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Circle.java</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Circle</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Shape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Circle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(){</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     type </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Circle&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   @</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Override</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> draw</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      System.out.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Inside Circle::draw() method.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="步骤-3" tabindex="-1">步骤 3 <a class="header-anchor" href="#步骤-3" aria-label="Permalink to &quot;步骤 3&quot;">​</a></h4><p>创建一个类，从数据库获取实体类，并把它们存储在一个 Hashtable 中。</p><p>ShapeCache.java</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> java.util.Hashtable;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ShapeCache</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   private</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Hashtable&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Shape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; shapeMap </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Hashtable&lt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Shape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Shape </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getShape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(String </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">shapeId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Shape cachedShape </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> shapeMap.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(shapeId);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (Shape) cachedShape.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">clone</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 对每种形状都运行数据库查询，并创建该形状</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // shapeMap.put(shapeKey, shape);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 例如，我们要添加三种形状</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> loadCache</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Circle circle </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Circle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      circle.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      shapeMap.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">put</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(circle.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),circle);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Square square </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Square</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      square.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      shapeMap.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">put</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(square.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),square);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Rectangle rectangle </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Rectangle</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      rectangle.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      shapeMap.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">put</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(rectangle.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(),rectangle);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="步骤-4" tabindex="-1">步骤 4 <a class="header-anchor" href="#步骤-4" aria-label="Permalink to &quot;步骤 4&quot;">​</a></h4><p>PrototypePatternDemo 使用 ShapeCache 类来获取存储在 Hashtable 中的形状的克隆。</p><p>PrototypePatternDemo.java</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> PrototypePatternDemo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">   public</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> static</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> void</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">args</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      ShapeCache.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">loadCache</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Shape clonedShape </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (Shape) ShapeCache.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getShape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      System.out.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Shape : &quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clonedShape.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());        </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Shape clonedShape2 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (Shape) ShapeCache.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getShape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      System.out.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Shape : &quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clonedShape2.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());        </span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      Shape clonedShape3 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (Shape) ShapeCache.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getShape</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      System.out.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">println</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Shape : &quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> +</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> clonedShape3.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getType</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());        </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="步骤-5" tabindex="-1">步骤 5 <a class="header-anchor" href="#步骤-5" aria-label="Permalink to &quot;步骤 5&quot;">​</a></h4><p>执行程序，输出结果：</p><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Shape </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Circle</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Shape </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Square</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Shape </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Rectangle</span></span></code></pre></div>`,50),l=[p];function t(k,e,E,r,d,g){return a(),i("div",null,l)}const F=s(h,[["render",t]]);export{c as __pageData,F as default};
