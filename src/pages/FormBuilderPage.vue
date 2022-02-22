<template>
  <q-layout view="hHh LpR fFf">
    <q-header reveal bordered class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <!-- <q-avatar> -->
          <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" /> -->
          <!-- </q-avatar> -->
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <div class="components-list">
        <template v-if="basicFields.length">
          <div class="widget-cate">BASIC INPUT</div>
          <draggable
            tag="ul"
            :list="basicComponents"
            v-bind="{
              group: { name: 'people', pull: 'clone', put: false },
              sort: false,
              ghostClass: 'ghost',
            }"
            @end="handleMoveEnd"
            @start="handleMoveStart"
            :move="handleMove"
          >
            <template v-for="(item, index) in basicComponents">
              <li :key="index">
                <a>
                  <i class="icon iconfont"></i>
                  <span>{{ item.name }}</span>
                </a>
              </li>
            </template>
          </draggable>
        </template>
        <template v-if="layoutFields.length">
          <div class="widget-cate">Layout</div>
          <draggable
            tag="ul"
            :list="layoutComponents"
            v-bind="{
              group: { name: 'people', pull: 'clone', put: false },
              sort: false,
              ghostClass: 'ghost',
            }"
            @end="handleMoveEnd"
            @start="handleMoveStart"
            :move="handleMove"
          >
            <template v-for="(item, index) in layoutComponents">
              <li
                v-if="layoutFields.indexOf(item.type) >= 0"
                class="form-edit-widget-label no-put"
                :key="index"
              >
                <a>
                  <i class="icon iconfont" :class="item.icon"></i>
                  <span>{{ item.name }}</span>
                </a>
              </li>
            </template>
          </draggable>
        </template>
      </div>
    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <q-tabs
        v-model="configTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="field-attribute" label="Field Config" />
        <q-tab name="form-attribute" label="Form Config" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="configTab" animated>
        <q-tab-panel name="field-attribute">
          <field-config-form></field-config-form>
        </q-tab-panel>
        <q-tab-panel name="form-attribute">
          <form-config-form></form-config-form>
        </q-tab-panel>
      </q-tab-panels>
    </q-drawer>
    <q-page-container class="widget-form-container">
      <!-- widget FOrm data: {{ widgetForm }} -->
      <!-- {{ list2 }} -->
      <!-- <draggable class="" :list="list2" group="people" @change="log">
        <div class="" v-for="(element, index) in list2" :key="element.name">
          {{ element.name }} {{ index }}
        </div>
      </draggable> -->
      <builder-board
        :data="widgetForm"
        :select.sync="widgetFormSelect"
      ></builder-board>
    </q-page-container>
  </q-layout>
</template>

<script>
import Draggable from "vuedraggable";
import BuilderBoard from "../components/organisms/BuilderBoard.vue";
import {
  basicComponents,
  layoutComponents,
  advanceComponents,
} from "../boot/componentsConfig.js";
import FieldConfigForm from "../components/molecules/FieldConfigForm.vue";
import FormConfigForm from "../components/molecules/FormConfigForm.vue";
export default {
  props: {
    basicFields: {
      type: Array,
      default: () => [
        "input",
        "textarea",
        "number",
        "radio",
        "checkbox",
        "time",
        "date",
        "rate",
        "color",
        "select",
        "switch",
        "slider",
        "text",
      ],
    },
    advanceFields: {
      type: Array,
      default: () => ["blank", "imgupload", "editor", "cascader"],
    },
    layoutFields: {
      type: Array,
      default: () => ["grid"],
    },
  },
  components: {
    Draggable,
    BuilderBoard,
    FormConfigForm,
    FieldConfigForm,
  },
  data() {
    return {
      configTab: "field-attribute",
      basicComponents,
      layoutComponents,
      advanceComponents,
      left: false,
      right: false,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
        },
      },
      widgetFormSelect: null,
      list2: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.basicComponents = this.basicComponents.map((item) => {
        return {
          ...item,
          name: item.type,
        };
      });
      this.layoutComponents = this.layoutComponents.map((item) => {
        return {
          ...item,
          name: item.type,
        };
      });
    },
    handleMoveEnd(evt) {
      console.log("end", evt);
    },
    handleMoveStart({ oldIndex }) {
      console.log("start", oldIndex, this.basicComponents);
    },
    handleMove() {
      return true;
    },
  },
};
</script>

<style></style>
// .widget-form-container .widget-form-list .widget-view.active
