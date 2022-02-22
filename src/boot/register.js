export default ({ app, router, store, ...others }) => {
  const newRoutes = [
    {
      path: "/forms",
      name: "Form",
      component: () => import("../pages/FormBuilderPage.vue"),
      props: true,
    },
    {
      path: "/formtest",
      name: "formtest",
      component: () => import("../pages/Builder.vue"),
      props: true,
    },
    {
      path: "/img",
      name: "Omg",
      component: () => import("../components/organisms/ProductZoom"),
      props: true,
    },
  ];

  router.addRoutes(newRoutes);
  const api = {};
  // Vue.prototype.formBuilder = api;
};
