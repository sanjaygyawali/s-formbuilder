<template>
  <div style="height: 100vh; background: gray">
    <q-form class="q-gutter-md">
      <draggable
        class=""
        v-model="data.list"
        v-bind="{
          group: 'people',
          ghostClass: 'ghost',
          animation: 200,
          handle: '.drag-widget',
        }"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >
        <!-- {{ data.list }} -->
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <template v-if="element.type == 'grid'">
              <div
                class="row widget-view column"
                v-if="element && element.key"
                :key="element.key"
                type="flex"
                :class="{ active: selectWidget.key == element.key }"
                :gutter="element.options.gutter ? element.options.gutter : 0"
                :justify="element.options.justify"
                :align="element.options.align"
                @click.self="handleSelectWidget(index)"
              >
                <div class="flex justify-between">
                  <div
                    class="widget-view-drags"
                    v-if="selectWidget.key == element.key"
                  >
                    <q-icon class="drag-widget" name="las la-grip-horizontal" />
                  </div>
                  <div class="flex">
                    <div class="" v-if="selectWidget.key == element.key">
                      <q-icon
                        @click.stop="handleWidgetDelete(index)"
                        name="las la-trash"
                      />
                    </div>
                    <div class="" v-if="selectWidget.key == element.key">
                      <q-icon
                        @click.stop="handleWidgetClone(index)"
                        name="las la-copy"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div
                    class="col-md-6"
                    v-for="(col, colIndex) in element.columns"
                    :key="colIndex"
                  >
                    <draggable
                      v-model="col.list"
                      :no-transition-on-drag="true"
                      v-bind="{
                        group: 'people',
                        ghostClass: 'ghost',
                        animation: 200,
                        handle: '.drag-widget',
                      }"
                      @end="handleMoveEnd"
                      @add="handleWidgetColAdd($event, element, colIndex)"
                    >
                      <transition-group
                        name="fade"
                        tag="div"
                        class="widget-col-list"
                      >
                        <template v-for="(el, i) in col.list">
                          <form-item
                            :key="el.key"
                            v-if="el.key"
                            :element="el"
                            :select.sync="selectWidget"
                            :index="i"
                            :data="col"
                          >
                          </form-item>
                        </template>
                      </transition-group>
                    </draggable>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <form-item
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
              ></form-item>
            </template>
          </template>
        </transition-group>
      </draggable>
    </q-form>
  </div>
</template>
<script>
import Draggable from "vuedraggable";
import FormItem from "../molecules/WFormItem.vue";
export default {
  components: {
    Draggable,
    FormItem,
  },
  props: ["data", "select"],
  data() {
    return {
      selectWidget: this.select,
    };
  },
  mounted() {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },

  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      console.log("mode end: index", newIndex, oldIndex);
    },
    handleSelectWidget(index) {
      console.log(index, "#####");
      this.selectWidget = this.data.list[index];
    },
    // layoutComponents
    handleWidgetAdd(evt) {
      console.log("handle widght addition : add", evt);
      console.log("end", evt);
      const newIndex = evt.newIndex;
      const to = evt.to;
      console.log(to);

      const key =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: "func_" + key,
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].type + "_" + key,
        rules: [],
      });

      if (
        this.data.list[newIndex].type === "radio" ||
        this.data.list[newIndex].type === "checkbox" ||
        this.data.list[newIndex].type === "select"
      ) {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map((item) => ({
              ...item,
            })),
          },
        });
      }

      if (this.data.list[newIndex].type === "grid") {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns: this.data.list[newIndex].columns.map((item) => ({
            ...item,
          })),
        });
      }

      this.selectWidget = this.data.list[newIndex];
    },
    handleWidgetColAdd($event, row, colIndex) {
      console.log("coladd", $event, row, colIndex);
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf("data-grid") >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === "DIV" &&
          this.data.list.splice(
            oldIndex,
            0,
            row.columns[colIndex].list[newIndex]
          );

        row.columns[colIndex].list.splice(newIndex, 1);

        return false;
      }

      console.log("from", item);

      const key =
        Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);

      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
          remoteFunc: "func_" + key,
        },
        key,
        // 绑定键值
        model: row.columns[colIndex].list[newIndex].type + "_" + key,
        rules: [],
      });

      if (
        row.columns[colIndex].list[newIndex].type === "radio" ||
        row.columns[colIndex].list[newIndex].type === "checkbox" ||
        row.columns[colIndex].list[newIndex].type === "select"
      ) {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            options: row.columns[colIndex].list[newIndex].options.options.map(
              (item) => ({
                ...item,
              })
            ),
          },
        });
      }

      this.selectWidget = row.columns[colIndex].list[newIndex];
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
    handleWidgetClone(index) {},
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

<style lang="scss">
$primary-color: #409eff;
$primary-background-color: #ecf5ff;

*,
:after,
:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.fa-icon {
  width: auto;
  height: 1em; /* 或任意其它字体大小相对值 */

  /* 要在 Safari 中正常工作，需要再引入如下两行代码 */
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}

.fm2-container {
  background: #fff;
  height: 100%;
  border: 1px solid #e0e0e0;

  .el-container {
    height: 100% !important;
  }

  & > .el-container {
    background: #fff;
  }
  .fm2-main {
    position: relative;

    & > .el-container {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  main {
    padding: 0;
  }

  footer {
    height: 30px;
    line-height: 30px;
    border-top: 1px solid #e0e0e0;
    font-size: 12px;
    text-align: right;
    color: $primary-color;
    background: #fafafa;

    a {
      color: $primary-color;
    }
  }
}

.center-container {
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;

  .btn-bar {
    height: 45px;
    line-height: 45px;
    font-size: 18px;
    border-bottom: solid 2px #e4e7ed;
    text-align: right;
  }

  .el-main {
    padding: 0;
    position: relative;
    background: #fafafa;
  }
}

.components-list {
  padding: 8px 0;
  width: 100%;
  height: 100%;

  .widget-cate {
    padding: 8px 12px;
    font-size: 13px;
  }

  ul {
    position: relative;
    overflow: hidden;
    padding: 0 10px 10px;
    margin: 0;
  }

  .form-edit-widget-label {
    font-size: 12px;
    display: block;
    width: 48%;
    line-height: 26px;
    position: relative;
    float: left;
    left: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 1%;
    color: #333;
    border: 1px solid #f4f6fc;

    &:hover {
      color: $primary-color;
      border: 1px dashed $primary-color;
    }

    & > a {
      display: block;
      cursor: move;
      background: #f4f6fc;
      border: 1px solid #f4f6fc;

      .icon {
        margin-right: 6px;
        margin-left: 8px;
        font-size: 14px;
        display: inline-block;
        vertical-align: middle;
      }

      span {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}

.widget-form-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .widget-form-list {
    background: #fff;
    // border: 1px dashed #999;
    border: 1px dashed #999;
    min-height: 600px;
    margin: 10px;

    .widget-col-list {
      min-height: 50px;
      border: 1px dashed #ccc;
      background: #fff;
    }

    .widget-view {
      padding-bottom: 18px;
      position: relative;
      border: 1px dashed rgba(170, 170, 170, 0.7);
      background-color: rgba(236, 245, 255, 0.3);
      margin: 2px;

      .el-form-item__content {
        position: unset;
      }

      &.is_req {
        .el-form-item__label::before {
          content: "*";
          color: #f56c6c;
          margin-right: 4px;
        }
      }

      .widget-view-description {
        height: 15px;
        line-height: 15px;
        font-size: 13px;
        margin-top: 6px;
        color: #909399;
      }

      .widget-view-action {
        position: absolute;
        right: 0;
        bottom: 0;
        height: 28px;
        line-height: 28px;
        background: $primary-color;
        z-index: 9;

        i {
          font-size: 14px;
          color: #fff;
          margin: 0 5px;
          cursor: pointer;
        }
      }

      .widget-view-drag {
        position: absolute;
        left: -2px;
        top: -2px;
        bottom: -18px;
        height: 28px;
        line-height: 28px;
        background: $primary-color;
        z-index: 9;
        // display: none;

        i {
          font-size: 14px;
          color: #fff;
          margin: 0 5px;
          cursor: move;
        }
      }

      &:after {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: block;
      }

      &:hover {
        background: $primary-background-color;
        outline: 1px solid $primary-color;
        outline-offset: 0px;

        &.active {
          outline: 2px solid $primary-color;
          border: 1px solid $primary-color;
          outline-offset: 0;
        }

        .widget-view-drag {
          display: block;
        }
      }

      &.active {
        outline: 2px solid $primary-color;
        border: 1px solid $primary-color;
      }

      &.ghost {
        background: #f56c6c;
        border: 2px solid #f56c6c;
        outline-width: 0;
        height: 3px;
        box-sizing: border-box;
        font-size: 0;
        content: "";
        overflow: hidden;
        padding: 0;
      }
    }

    .widget-table {
      padding-bottom: 0;
      padding: 5px;
      background-color: rgba(253, 246, 236, 0.3);

      .widget-table-wrapper {
        min-height: 50px;
        background: #fff;
        display: flex;
        justify-content: flex-start;

        .widget-table-row {
          td {
            border-bottom: 0;
          }
        }

        .widget-table-left {
          width: 51px;
          border-left: 1px solid #ebeef5;
          border-right: 1px solid #ebeef5;
          border-top: 1px solid #ebeef5;
          flex: none;
        }

        .widget-table-view {
          border: 1px solid #ebeef5;
          width: 200px;
          float: left;
          height: 100%;
          position: relative;
          display: block;

          .el-table {
            height: 100%;
          }

          &.is_req {
            .el-form-item__label::before {
              content: "*";
              color: #f56c6c;
              margin-right: 4px;
            }
          }

          .widget-view-description {
            height: 15px;
            line-height: 15px;
            font-size: 13px;
            margin-top: 6px;
            color: #909399;
          }

          .widget-view-action {
            position: absolute;
            right: 0;
            bottom: 0;
            height: 28px;
            line-height: 28px;
            background: $primary-color;
            z-index: 9;

            i {
              font-size: 14px;
              color: #fff;
              margin: 0 5px;
              cursor: pointer;
            }
          }

          .widget-view-drag {
            position: absolute;
            left: -2px;
            top: -2px;
            bottom: -18px;
            height: 28px;
            line-height: 28px;
            background: $primary-color;
            z-index: 9;
            // display: none;

            i {
              font-size: 14px;
              color: #fff;
              margin: 0 5px;
              cursor: move;
            }
          }

          &::after {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: block;
            content: "";
          }

          &::before {
            display: none;
          }

          &:hover {
            background: $primary-background-color;
            outline: 1px solid $primary-color;
            outline-offset: -1px;

            &.active {
              // outline: 1px solid $primary-color;
              border: 1px solid $primary-color;
              outline: 1px solid $primary-color;
              outline-offset: -1px;
            }

            .widget-view-drag {
              display: block;
            }
          }

          &.active {
            outline: 1px solid $primary-color;
            border: 1px solid $primary-color;
            outline-offset: -1px;
          }

          &.ghost {
            background: #f56c6c;
            outline-width: 0;
            width: 5px !important;
            box-sizing: border-box;
            font-size: 0;
            content: "";
            overflow: hidden;
            padding: 0;
            position: relative;
            outline: none !important;
            border: 0 !important;

            &::after {
              background: #f56c6c;
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              z-index: 9999;
              content: "";
              outline: none;
            }
          }
        }

        .widget-table-content {
          width: 100%;
          // border: 1px dashed #ccc;
          outline: 1px dashed #ccc;
          background: #fff;
          flex: 1;
          margin: 0 1px;
          overflow: auto;

          & > div {
            height: 100%;
          }

          .widget-table-col {
            height: 100%;

            .ghost {
              background: #f56c6c;
              // border: 2px solid #F56C6C;
              position: relative;
              content: "";
              float: left;
              height: 100%;
              width: 5px !important;
              list-style: none;
              font-size: 0;
              overflow: hidden;
              outline: none;

              &::after {
                background: #f56c6c;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                z-index: 9999;
                content: "";
                outline: none;
              }
            }
          }
        }
      }

      &.active {
        outline: 2px solid #e6a23c;
        border: 1px solid #e6a23c;
      }

      &:hover {
        background: #fdf6ec;
        outline: 1px solid #e6a23c;
        outline-offset: 0px;

        &.active {
          outline: 2px solid #e6a23c;
          border: 1px solid #e6a23c;
          outline-offset: 0;
        }
      }

      .widget-view-action.widget-col-action {
        background: #e6a23c;
      }

      .widget-view-drag.widget-col-drag {
        background: #e6a23c;
      }

      &::after {
        display: none;
      }

      &.ghost {
        background: #f56c6c;
        outline-width: 0;
        height: 5px;
        box-sizing: border-box;
        font-size: 0;
        content: "";
        overflow: hidden;
        padding: 0;
        position: relative;
        outline: none;
        border: 0;

        &::after {
          background: #f56c6c;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          content: "";
          display: block;
          z-index: 999;
        }
      }
    }

    .widget-col {
      padding-bottom: 0;
      padding: 5px;
      // margin-left: 2px !important;
      // margin-right: 2px !important;
      background-color: rgba(253, 246, 236, 0.3);

      &.active {
        outline: 2px solid #e6a23c;
        border: 1px solid #e6a23c;
      }

      &:hover {
        background: #fdf6ec;
        outline: 1px solid #e6a23c;
        outline-offset: 0px;

        &.active {
          outline: 2px solid #e6a23c;
          border: 1px solid #e6a23c;
          outline-offset: 0;
        }
      }

      .el-col {
        min-height: 50px;
      }

      &.ghost {
        background: #f56c6c;
        border: 2px solid #f56c6c;
        outline-width: 0;
        height: 3px;
        box-sizing: border-box;
        font-size: 0;
        content: "";
        overflow: hidden;
        padding: 0;
      }

      .widget-view-action.widget-col-action {
        background: #e6a23c;
      }

      .widget-view-drag.widget-col-drag {
        background: #e6a23c;
      }

      &::after {
        display: none;
      }
    }

    .ghost {
      background: #f56c6c;
      border: 2px solid #f56c6c;
      outline-width: 0;
      height: 3px;
      box-sizing: border-box;
      font-size: 0;
      content: "";
      overflow: hidden;
      padding: 0;
    }
  }

  .ghost {
    background: #f56c6c;
    border: 2px solid #f56c6c;
    position: relative;

    &::after {
      background: #f56c6c;
    }
  }

  li.ghost {
    height: 5px;
    list-style: none;
    font-size: 0;
    overflow: hidden;
  }

  .widget-grid {
    background: #f4f6fc;
    position: relative;
    border-left: 5px solid transparent;
    padding: 5px;
    margin: 0 !important;

    &.active {
      border-left: 5px solid $primary-color;
      background: #b3d8ff;
    }
  }

  .widget-grid-container {
    &.ghost {
      background: #f56c6c;
      border: 2px solid #f56c6c;
      outline-width: 0;
      height: 3px;
      box-sizing: border-box;
      font-size: 0;
      content: "";
      overflow: hidden;
      padding: 0;
    }
  }

  .ghost {
    background: #f56c6c;
    border: 2px solid #f56c6c;
    position: relative;

    &::after {
      background: #f56c6c;
    }
  }

  li.ghost {
    height: 5px;
    list-style: none;
    font-size: 0;
    overflow: hidden;
  }
}

.widget-config-container {
  position: relative;

  .el-header {
    border-bottom: solid 2px #e4e7ed;
    padding: 0 5px;
  }

  .config-tab {
    height: 45px;
    line-height: 45px;
    display: inline-block;
    width: 145px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    cursor: pointer;

    &.active {
      border-bottom: solid 2px $primary-color;
    }
  }

  .config-content {
    padding: 10px;

    .el-form-item__label {
      padding: 0;
      font-weight: 500;
    }

    .el-form-item {
      border-bottom: solid 1px #e1e1e1;
      padding-bottom: 10px;
    }

    .config-pattern-input {
      .el-input-group__prepend,
      .el-input-group__append {
        padding: 0 8px;
      }
    }
  }

  .ghost {
    background: #fff;
    border: 1px dashed $primary-color;

    &::after {
      background: #fff;
      display: block;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li.ghost {
    list-style: none;
    font-size: 0;
    display: block;
    position: relative;
  }
}

.viewer-container {
  z-index: 99999 !important;
}

.form-empty {
  position: absolute;
  text-align: center;
  width: 300px;
  font-size: 20px;
  top: 200px;
  left: 50%;
  margin-left: -150px;
  color: #ccc;
}

.widget-empty {
  background-position: 50%;
}
</style>
