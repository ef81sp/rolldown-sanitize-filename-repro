import { createElementBlock as e, defineComponent as t, onMounted as n, openBlock as r } from "vue";
//#region src/components/TestComp.vue?vue&type=script&setup=true&lang.ts
var i = /* @__PURE__ */ t({
	__name: "TestComp",
	setup(t) {
		return n(() => {
			console.log("hello!");
		}), (t, n) => (r(), e("p", null, "Hello"));
	}
});
//#endregion
export { i as default };
