import{n}from"./index.0d7d95a2.js";const r={data(){return{isMenuOpen:!1}},methods:{toggleMenu(){this.isMenuOpen=!this.isMenuOpen}}};var i=function(){var t=this,s=t._self._c;return s("nav",{staticClass:"navbar"},[s("div",{staticClass:"navbar-brand"},[s("router-link",{staticStyle:{"text-decoration":"none",color:"white"},attrs:{to:"/"}},[t._v("CrochetMart")])],1),s("button",{staticClass:"navbar-toggler",on:{click:t.toggleMenu}},[s("i",{staticClass:"pi pi-bars"})]),s("div",{class:["navbar-links",{"navbar-links-active":t.isMenuOpen}]},[s("router-link",{staticClass:"navbar-link",attrs:{to:"/productos"}},[t._v(" Productos ")]),s("router-link",{staticClass:"navbar-link",attrs:{to:"/descarga"}},[t._v(" Iniciar Sesi\xF3n ")])],1)])},e=[],o=n(r,i,e,!1,null,"dc05a449",null,null);const c=o.exports,l="/assets/grillo.a408c639.png";const _={data(){return{logo:l}}};var v=function(){var t=this,s=t._self._c;return s("footer",[s("div",{staticClass:"footer-container"},[s("div",{staticClass:"top-section"},[s("div",{staticClass:"logo"},[s("img",{staticClass:"logo-img",attrs:{src:t.logo,alt:"Logo"}})]),s("nav",{staticClass:"nav-links"},[s("router-link",{staticClass:"footer-link",attrs:{to:"/"}},[t._v("Inicio")]),s("router-link",{staticClass:"footer-link",attrs:{to:"/productos"}},[t._v("Productos")]),s("router-link",{staticClass:"footer-link",attrs:{to:"/descarga"}},[t._v("M\xE1s")])],1)]),t._m(0),t._m(1)])])},u=[function(){var a=this,t=a._self._c;return t("div",{staticClass:"social-icons"},[t("a",{staticClass:"icon-circle",attrs:{href:"#"}},[t("i",{staticClass:"pi pi-facebook"})]),t("a",{staticClass:"icon-circle",attrs:{href:"#"}},[t("i",{staticClass:"pi pi-twitter"})]),t("a",{staticClass:"icon-circle",attrs:{href:"#"}},[t("i",{staticClass:"pi pi-instagram"})]),t("a",{staticClass:"icon-circle",attrs:{href:"#"}},[t("i",{staticClass:"pi pi-linkedin"})])])},function(){var a=this,t=a._self._c;return t("div",{staticClass:"bottom-section"},[t("p",[a._v("\xA9 2024 Crochet Creaciones. Todos los derechos reservados.")])])}],d=n(_,v,u,!1,null,"af82c6e9",null,null);const f=d.exports,p={components:{Navbar:c,Footer:f},data(){return{}}};var C=function(){var t=this,s=t._self._c;return s("div",[s("Navbar"),s("div",{staticStyle:{margin:"0 auto","max-width":"95%"}},[s("router-view")],1),s("Footer")],1)},m=[],g=n(p,C,m,!1,null,null,null,null);const k=g.exports;export{k as default};