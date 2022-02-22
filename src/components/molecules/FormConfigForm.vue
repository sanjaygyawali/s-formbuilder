<template>
  <div class="flex column">
    <q-input></q-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        design: "outlined",
        mode: "edit",
        dense: true,
        labelPosition: "left",
        labelClasses: "",
        formClass: "",
        formId: "",
        formName: "",
        border: "",
      },
      datas: {
        languages: [{ label: "", value: "" }],
        labelPosition: ["top", "left"],
        modes: ["edit", "readonly", "disabled"],
        designs: ["filled", "outlined", "standout", "design"],
        border: ["square", "rounded"],
      },
    };
  },
};
</script>

<style></style>
