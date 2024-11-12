import{_ as i,c as a,a2 as n,o as h}from"./chunks/framework.BW-ZVgUE.js";const y=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Web/ESlint/Eslint.md","filePath":"Web/ESlint/Eslint.md"}'),t={name:"Web/ESlint/Eslint.md"};function l(k,s,p,e,F,r){return h(),a("div",null,s[0]||(s[0]=[n(`<h3 id="配置-eslint" tabindex="-1">配置 <code>ESlint</code> <a class="header-anchor" href="#配置-eslint" aria-label="Permalink to &quot;配置 \`ESlint\`&quot;">​</a></h3><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npx</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> eslint</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --init</span></span></code></pre></div><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> How would you like to use ESLint</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ...</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  To</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> check</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> syntax</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> only</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> To check syntax and find problems</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">√</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> How</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> would</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> you</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> like</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> to</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ESLint?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ·</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> problems</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">√</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> What</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> type</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> of</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> modules</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> does</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> your</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> project</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ·</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> esm</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">√</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Which</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> framework</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> does</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> your</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> project</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ·</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> react</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">√</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Does</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> your</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> project</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TypeScript?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ·</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> No</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Yes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">√</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Where</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> does</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> your</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> code</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ·</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> browser</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">√</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> What</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> format</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> do</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> you</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> want</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> your</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> config</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> file</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> to</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> be</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> in?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ·</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> JSON</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Local</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ESLint</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> installation</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> not</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> found.</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">The</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> config</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> that</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> you&#39;ve selected requires the following dependencies:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">√ Would you like to install them now? · No / Yes</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">√ Which package manager do you want to use? · npm</span></span></code></pre></div>`,3)]))}const g=i(t,[["render",l]]);export{y as __pageData,g as default};
