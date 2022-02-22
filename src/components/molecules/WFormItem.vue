<template>
  <div
    style="padding: 5px; background: white; postion: relative"
    :class="{
      active: selectWidget.key == element.key,
      is_req: element.options.required,
    }"
    @click="handleSelectWidget(index)"
  >
    <div class="flex justify-between">
      <div class="" v-if="selectWidget.key == element.key">
        <q-icon class="drag-widget" name="las la-grip-horizontal" />
      </div>
      <div class="flex">
        <div class="" v-if="selectWidget.key == element.key">
          <q-icon @click.stop="handleWidgetDelete(index)" name="las la-trash" />
        </div>
        <div class="" v-if="selectWidget.key == element.key">
          <q-icon @click.stop="handleWidgetClone(index)" name="las la-copy" />
        </div>
      </div>
    </div>
    <template v-if="element.type == 'input'">
      <div>
        <q-input
          filled
          v-model="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :disabled="element.options.disabled"
          :label="element.options.label"
          lazy-rules
        />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ["element", "select", "index", "data"],
  data() {
    return {
      selectWidget: this.select,
    };
  },

  created() {
    console.log("Created form item ");
  },

  mounted() {},

  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index];
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.list[index - 1];
        }
      } else {
        this.selectWidget = this.data.list[index + 1];
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      const key =
        Date.parse(new Date().toString()) +
        "_" +
        Math.ceil(Math.random() * 99999);
      let cloneData = {
        ...this.data.list[index],
        options: {
          ...this.data.list[index].options,
          remoteFunc: "func_" + key,
        },
        key,
        model: this.data.list[index].type + "_" + key,
        rules: this.data.list[index].rules || [],
      };

      if (
        this.data.list[index].type === "radio" ||
        this.data.list[index].type === "checkbox" ||
        this.data.list[index].type === "select"
      ) {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map((item) => ({ ...item })),
          },
        };
      }

      this.data.list.splice(index, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1];
      });
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true,
    },
  },
};
</script>

<style>
.bg-greens {
  border: 5px solid green;
}
</style>
