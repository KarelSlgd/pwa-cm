import{n as o,u as a}from"./index.152af120.js";const n="/pwa-cm/assets/Logo401.fab6f35e.png";const i={name:"ErrorPage",methods:{goBack(){if(!a.getToken()){this.$router.push("/");return}a.getRole().toString().toLowerCase()==="admin"?this.$router.push("/admin"):this.$router.push("/")}}};var c=function(){var t=this,e=t._self._c;return e("div",{staticClass:"surface-0 text-center"},[e("div",{staticClass:"flex flex-column align-items-center justify-content-center",staticStyle:{height:"calc(100vh - 150px)"}},[e("img",{staticClass:"w-6rem mb-4",attrs:{src:n,alt:"Saltamontes"}}),e("i",{staticClass:"pi pi-lock lock-icon mb-4"}),e("h2",{staticClass:"text-2xl title-danger font-semibold mb-2"},[t._v("Acceso Denegado")]),t._m(0),e("button",{staticClass:"p-button custom-button text-white px-4 py-2 font-bold text-base",on:{click:t.goBack}},[t._v(" Volver al inicio ")])]),e("div",{staticClass:"wave-container"},[e("svg",{attrs:{viewBox:"0 0 1440 320",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{fill:"#F1948A","fill-opacity":"1",d:"M0,96L60,112C120,128,240,160,360,165.3C480,171,600,149,720,149.3C840,149,960,171,1080,176C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"}})])])])},r=[function(){var s=this,t=s._self._c;return t("div",{staticClass:"text-container"},[t("p",{staticClass:"subtitle-danger mb-4"},[s._v(" Lo sentimos, parece que no tienes los hilos necesarios para tejer esta p\xE1gina. Tu acceso ha sido bloqueado como un nudo apretado. ")])])}],l=o(i,c,r,!1,null,"a44b123f",null,null);const u=l.exports;export{u as default};