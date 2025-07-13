function t(t,e,s,i){var r,o=arguments.length,n=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,s,n):r(e,s))||n);return o>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:d,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:l,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,_=g.trustedTypes,m=_?_.emptyScript:"",v=g.reactiveElementPolyfillSupport,y=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!d(t,e),b={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);r?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...l(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:f).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=i;const o=r.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,r=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??$)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,v?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,k=`<${P}>`,M=document,T=()=>M.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,O="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,R=/>/g,z=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),Y=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=M.createTreeWalker(M,129);function G(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const K=(t,e)=>{const s=t.length-1,i=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=D;for(let e=0;e<s;e++){const s=t[e];let a,d,c=-1,h=0;for(;h<s.length&&(n.lastIndex=h,d=n.exec(s),null!==d);)h=n.lastIndex,n===D?"!--"===d[1]?n=N:void 0!==d[1]?n=R:void 0!==d[2]?(I.test(d[2])&&(r=RegExp("</"+d[2],"g")),n=z):void 0!==d[3]&&(n=z):n===z?">"===d[0]?(n=r??D,c=-1):void 0===d[1]?c=-2:(c=n.lastIndex-d[2].length,a=d[1],n=void 0===d[3]?z:'"'===d[3]?j:L):n===j||n===L?n=z:n===N||n===R?n=D:(n=z,r=void 0);const l=n===z&&t[e+1].startsWith("/>")?" ":"";o+=n===D?s+k:c>=0?(i.push(a),s.slice(0,c)+S+s.slice(c)+C+l):s+C+(-2===c?e:l)}return[G(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[d,c]=K(t,e);if(this.el=J.createElement(d,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[o++],s=i.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:X}),i.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),V.nextNode(),a.push({type:2,index:++r});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===P)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function F(t,e,s=t,i){if(e===Y)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=U(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=F(t,r._$AS(t,e.values),r,i)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);V.currentNode=i;let r=V.nextNode(),o=0,n=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new Q(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new it(r,this,t)),this._$AV.push(e),a=s[++n]}o!==a?.index&&(r=V.nextNode(),o++)}return V.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),U(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==Y&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(G(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Z(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new J(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Q(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(void 0===r)t=F(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==Y,o&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=F(this,i[s+n],e,n),a===Y&&(a=this._$AH[n]),o||=!U(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends X{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=F(this,t,e,0)??W)===Y)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(J,Q),(w.litHtmlVersions??=[]).push("3.3.1");const ot=globalThis;class nt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new Q(e.insertBefore(T(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}}nt._$litElement$=!0,nt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:nt});const at=ot.litElementPolyfillSupport;at?.({LitElement:nt}),(ot.litElementVersions??=[]).push("4.2.1");const dt={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:$},ct=(t=dt,e,s)=>{const{kind:i,metadata:r}=s;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function lt(t){return ht({...t,state:!0,attribute:!1})}let pt=class extends nt{constructor(){super(...arguments),this._conversationHistory=[],this._currentMessage="",this._isLoading=!1,this._generatedYaml="",this._error=null,this._showCopySuccess=!1,this._entitiesAnalyzed=0,this._agentUsed=""}static{this.styles=n`
    :host {
      display: block;
      padding: 16px;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius);
      box-shadow: var(--ha-card-box-shadow);
      position: relative;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .header h2 {
      margin: 0;
      font-size: 1.2em;
      color: var(--primary-text-color);
    }

    .main-container {
      display: flex;
      gap: 16px;
      min-height: 400px;
    }

    .left-pane {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
    }

    .right-pane {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-direction: column;
    }

    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .chat-header {
      background: var(--secondary-background-color);
      padding: 12px;
      border-bottom: 1px solid var(--divider-color);
      font-weight: 500;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      max-height: 300px;
      min-height: 200px;
    }

    .message {
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 80%;
      word-wrap: break-word;
    }

    .message.user {
      background: var(--primary-color);
      color: var(--text-primary-color);
      margin-left: auto;
    }

    .message.assistant {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .message.system {
      background: var(--warning-color);
      color: var(--text-primary-color);
      font-style: italic;
    }

    .message.loading {
      opacity: 0.7;
    }

    .message .timestamp {
      font-size: 0.8em;
      opacity: 0.7;
      margin-top: 4px;
    }

    .chat-input {
      display: flex;
      padding: 12px;
      border-top: 1px solid var(--divider-color);
      background: var(--card-background-color);
      gap: 8px;
    }

    .chat-input input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }

    .chat-input input:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .chat-input button {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .chat-input button:hover {
      background: var(--primary-color-dark);
    }

    .chat-input button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .preview-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      overflow: hidden;
    }

    .preview-header {
      background: var(--secondary-background-color);
      padding: 12px;
      border-bottom: 1px solid var(--divider-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-title {
      font-weight: 500;
    }

    .preview-actions {
      display: flex;
      gap: 8px;
    }

    .preview-actions button {
      padding: 4px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }

    .preview-actions button:hover {
      background: var(--secondary-background-color);
    }

    .preview-actions button.success {
      background: var(--success-color);
      color: var(--text-primary-color);
      border-color: var(--success-color);
    }

    .preview-content {
      flex: 1;
      padding: 12px;
      overflow: auto;
    }

    .yaml-display {
      background: var(--code-editor-background-color, #f5f5f5);
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: var(--primary-text-color);
      min-height: 200px;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--secondary-text-color);
    }

    .empty-state ha-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .error-message {
      background: var(--error-color);
      color: var(--text-primary-color);
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .stats {
      font-size: 0.9em;
      color: var(--secondary-text-color);
      margin-top: 8px;
    }

    .loading-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--secondary-text-color);
      border-top: 2px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .main-container {
        flex-direction: column;
      }
      
      .left-pane, .right-pane {
        min-width: auto;
      }
    }
  `}setConfig(t){this.config=t,0===this._conversationHistory.length&&(this._conversationHistory=[{id:"welcome",role:"system",content:"Welcome to Gen-Dash! Describe the dashboard you want to create, and I'll generate it for you using your Home Assistant entities.",timestamp:new Date}])}render(){return this.config?B`
      ${!1!==this.config.show_header?B`
        <div class="header">
          <h2>${this.config.title||"Gen-Dash"}</h2>
        </div>
      `:""}
      
      ${this._error?B`
        <div class="error-message">
          <strong>Error:</strong> ${this._error}
        </div>
      `:""}

      <div class="main-container">
        <div class="left-pane">
          <div class="chat-container">
            <div class="chat-header">
              Chat Interface
              ${this._isLoading?B`
                <div class="loading-indicator">
                  <div class="loading-spinner"></div>
                  <span>Generating...</span>
                </div>
              `:""}
            </div>
            
            <div class="chat-messages" id="chatMessages">
              ${this._conversationHistory.map(t=>B`
                <div class="message ${t.role} ${t.isLoading?"loading":""}">
                  <div class="content">${t.content}</div>
                  <div class="timestamp">
                    ${t.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              `)}
            </div>
            
            <div class="chat-input">
              <input
                type="text"
                placeholder="Describe your dashboard..."
                .value=${this._currentMessage}
                @input=${this._handleInputChange}
                @keydown=${this._handleKeyDown}
                ?disabled=${this._isLoading}
              />
              <button
                @click=${this._sendMessage}
                ?disabled=${this._isLoading||!this._currentMessage.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div class="right-pane">
          <div class="preview-container">
            <div class="preview-header">
              <div class="preview-title">Live Preview</div>
              <div class="preview-actions">
                ${this._generatedYaml?B`
                  <button
                    @click=${this._copyToClipboard}
                    class=${this._showCopySuccess?"success":""}
                  >
                    ${this._showCopySuccess?"Copied!":"Copy YAML"}
                  </button>
                  <!-- Future: Commit to Dashboard button -->
                  <!-- <button @click=${this._commitToDashboard}>
                    Commit to Dashboard
                  </button> -->
                `:""}
              </div>
            </div>
            
            <div class="preview-content">
              ${this._generatedYaml?B`
                <div class="yaml-display">${this._generatedYaml}</div>
                ${this._entitiesAnalyzed>0?B`
                  <div class="stats">
                    Analyzed ${this._entitiesAnalyzed} entities using ${this._agentUsed}
                  </div>
                `:""}
              `:B`
                <div class="empty-state">
                  <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
                  <div>Generated dashboard YAML will appear here</div>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `:B`<div class="error-message">Invalid configuration</div>`}_handleInputChange(t){const e=t.target;this._currentMessage=e.value}_handleKeyDown(t){"Enter"!==t.key||t.shiftKey||(t.preventDefault(),this._sendMessage())}async _sendMessage(){if(!this._currentMessage.trim()||this._isLoading)return;const t={id:Date.now().toString(),role:"user",content:this._currentMessage,timestamp:new Date};this._conversationHistory=[...this._conversationHistory,t];const e=this._currentMessage;this._currentMessage="",this._scrollToBottom(),await this._generateDashboard(e)}async _generateDashboard(t){this._isLoading=!0,this._error=null;try{const e=await this._getConfigEntryId();if(!e)throw new Error("No Gen-Dash integration found. Please configure the integration first.");const s=await fetch("/api/gen_dash/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t,config_entry_id:e})});if(!s.ok){const t=await s.json();throw new Error(t.error||`HTTP ${s.status}`)}const i=await s.json();this._generatedYaml=i.yaml,this._entitiesAnalyzed=i.entities_analyzed,this._agentUsed=i.agent_used;const r={id:Date.now().toString(),role:"assistant",content:`✅ Dashboard generated successfully! I analyzed ${i.entities_analyzed} entities and created a configuration using ${i.agent_used}. Check the preview on the right.`,timestamp:new Date};this._conversationHistory=[...this._conversationHistory,r]}catch(t){this._error=t instanceof Error?t.message:"Unknown error occurred";const e={id:Date.now().toString(),role:"assistant",content:`❌ Error generating dashboard: ${this._error}`,timestamp:new Date};this._conversationHistory=[...this._conversationHistory,e]}finally{this._isLoading=!1,this._scrollToBottom()}}async _getConfigEntryId(){if(this.config.config_entry_id)return this.config.config_entry_id;try{const t=(await this.hass.callWS({type:"config/config_entries/list"})).filter(t=>"gen_dash"===t.domain);if(t.length>0)return t[0].entry_id}catch(t){}return null}async _copyToClipboard(){if(this._generatedYaml)try{await navigator.clipboard.writeText(this._generatedYaml),this._showCopySuccess=!0,setTimeout(()=>{this._showCopySuccess=!1},2e3)}catch(t){const e=document.createElement("textarea");e.value=this._generatedYaml,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e),this._showCopySuccess=!0,setTimeout(()=>{this._showCopySuccess=!1},2e3)}}_scrollToBottom(){setTimeout(()=>{const t=this.shadowRoot?.getElementById("chatMessages");t&&(t.scrollTop=t.scrollHeight)},0)}getCardSize(){return 6}updated(t){super.updated(t),t.has("_conversationHistory")&&this._scrollToBottom()}};t([ht({attribute:!1})],pt.prototype,"hass",void 0),t([ht({attribute:!1})],pt.prototype,"config",void 0),t([lt()],pt.prototype,"_conversationHistory",void 0),t([lt()],pt.prototype,"_currentMessage",void 0),t([lt()],pt.prototype,"_isLoading",void 0),t([lt()],pt.prototype,"_generatedYaml",void 0),t([lt()],pt.prototype,"_error",void 0),t([lt()],pt.prototype,"_showCopySuccess",void 0),t([lt()],pt.prototype,"_entitiesAnalyzed",void 0),t([lt()],pt.prototype,"_agentUsed",void 0),pt=t([(t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("gen-dash-card")],pt),customElements.define("gen-dash-card",pt),window.customCards=window.customCards||[],window.customCards.push({type:"gen-dash-card",name:"Gen-Dash Card",description:"AI-powered dashboard generator",preview:!0,documentationURL:"https://github.com/your-repo/gen-dash"});export{pt as GenDashCard};
