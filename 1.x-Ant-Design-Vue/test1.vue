<template>
  <a-transfer
    :data-source="dataSource"
    :target-keys="targetKeys"
    :render="(item) => item.title"
    :show-select-all="false"
    @change="onChange"
  >
    <template slot="children" slot-scope="{ props: { direction, selectedKeys }, on: { itemSelect } }">
      <template v-if="direction === 'left'">
        <a-tree
          v-if="leftTreeData.length"
          blockNode
          checkable
          defaultExpandAll
          :tree-data="leftTreeData"
          :checked-keys="leftCheckedKey"
          @check="
            (_, props) => {
              handleLeftChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect)
            }
          "
        />
        <a-empty v-else>
          <template slot="description">暂无数据</template>
        </a-empty>
      </template>
      <template v-else-if="direction === 'right'">
        <a-tree
          v-if="rightTreeData.length"
          blockNode
          checkable
          defaultExpandAll
          :tree-data="rightTreeData"
          :defaultCheckedKeys="rightCheckedKey"
          :defaultExpandedKeys="rightExpandedKey"
          @check="
            (_, props) => {
              handleRightChecked(_, props, [...selectedKeys, ...targetKeys], itemSelect)
            }
          "
        />
        <a-empty v-else>
          <template slot="description">暂无数据</template>
        </a-empty>
      </template>
    </template>
  </a-transfer>
</template>

<script>
import {
  cloneDeep,
  flatten,
  getDeepList,
  getTreeKeys,
  handleLeftTreeData,
  handleRightTreeData,
  isChecked,
  uniqueTree,
} from './utils'
export default {
  name: 'OptionsTransfer',
  props: {
    /** 树数据 */
    treeData: {
      type: Array,
      default: () => [],
    },
    /** 编辑 key */
    editKey: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      targetKeys: [], // 显示在右侧框数据的 key 集合
      dataSource: [], // 数据源，其中的数据将会被渲染到左边一栏

      leftCheckedKey: [], // 左侧树选中 key 集合
      leftHalfCheckedKeys: [], // 左侧半选集合
      leftCheckedAllKey: [], // 左侧树选中的 key 集合，包括半选与全选
      leftTreeData: [], // 左侧树

      rightCheckedKey: [], // 右侧树选中集合
      rightCheckedAllKey: [], // 右侧树选中集合，包括半选与全选
      rightExpandedKey: [], // 右侧展开数集合
      rightTreeData: [], // 右侧树

      emitKeys: [], // 往父级组件传递的数据

      deepList: [], // 深层列表

      // 暂存左侧树
      copyLeftTree: [],
      // 暂存右侧树
      copyRightTree: [],
    }
  },
  watch: {
    treeData: {
      deep: true,
      handler(val) {
        console.log(2)
        this.processTreeData()
      },
    },
    editKey: {
      deep: true,
      handler(val) {
        console.log(3)
        this.processTreeData()
      },
    },
  },
  created() {
    console.log(1)
    this.processTreeData()
  },
  methods: {
    // onSearch(direction, value) {
    //   if (direction === 'left') {
    //     console.log(this.leftTreeData)
    //     this.copyLeftTree = this.leftTreeData
    //     this.leftTreeData = [
    //       {
    //         id: 1,
    //         parentId: 0,
    //         key: '1',
    //         title: '工作台',
    //       },
    //       {
    //         id: 2,
    //         parentId: 0,
    //         key: '2',
    //         title: '仪表盘',
    //         children: [
    //           {
    //             id: 3,
    //             parentId: 2,
    //             key: '3',
    //             title: '欢迎页',
    //             children: [
    //               {
    //                 id: 21,
    //                 parentId: 3,
    //                 key: '21',
    //                 title: '欢迎页',
    //               },
    //               {
    //                 id: 22,
    //                 parentId: 3,
    //                 key: '22',
    //                 title: '分析页',
    //               },
    //               {
    //                 id: 23,
    //                 parentId: 3,
    //                 key: '23',
    //                 title: '监控页',
    //               },
    //             ],
    //           },
    //           {
    //             id: 4,
    //             parentId: 2,
    //             key: '4',
    //             title: '分析页',
    //           },
    //           {
    //             id: 5,
    //             parentId: 2,
    //             key: '5',
    //             title: '监控页',
    //           },
    //         ],
    //       },
    //     ]
    //   } else {
    //     this.copyRightTree = this.rightTreeData
    //   }
    //   // console.log(direction, value, 'xxxx')
    //   // console.log(this.copyLeftTree, this.copyRightTree)
    // },

    // 处理树数据
    processTreeData() {
      flatten(cloneDeep(this.treeData), this.dataSource)
      if (this.editKey.length) {
        this.processEditData()
      } else {
        this.leftTreeData = handleLeftTreeData(cloneDeep(this.treeData), this.leftCheckedKey)
      }
    },
    // 处理编辑数据
    processEditData() {
      this.leftCheckedAllKey = this.editKey
      this.rightExpandedKey = this.editKey
      this.targetKeys = this.editKey
      this.rightTreeData = handleRightTreeData(cloneDeep(this.treeData), this.editKey)
      getDeepList(this.deepList, this.treeData)

      this.leftCheckedKey = uniqueTree(this.editKey, this.deepList)
      this.leftHalfCheckedKeys = this.leftCheckedAllKey.filter((item) => this.leftCheckedKey.indexOf(item) === -1)
      this.leftTreeData = handleLeftTreeData(cloneDeep(this.treeData), this.leftCheckedKey)

      this.emitKeys = this.rightExpandedKey
    },
    // 穿梭更改
    onChange(targetKeys, direction) {
      if (direction === 'right') {
        this.targetKeys = this.leftCheckedAllKey
        this.rightCheckedKey = []
        this.rightTreeData = handleRightTreeData(cloneDeep(this.treeData), this.leftCheckedAllKey, 'right')
        this.leftTreeData = handleLeftTreeData(cloneDeep(this.treeData), this.leftCheckedKey, 'right')
      } else if (direction === 'left') {
        this.rightTreeData = handleRightTreeData(this.rightTreeData, this.rightCheckedKey, 'left')
        this.leftTreeData = handleLeftTreeData(this.leftTreeData, this.rightCheckedKey, 'left')
        this.leftCheckedKey = this.leftCheckedKey.filter((item) => this.rightCheckedKey.indexOf(item) === -1)
        this.targetKeys = this.targetKeys.filter((item) => this.rightCheckedKey.indexOf(item) === -1)
        this.leftHalfCheckedKeys = this.leftHalfCheckedKeys.filter((item) => this.rightCheckedKey.indexOf(item) === -1)
        this.rightCheckedKey = []
      }
      this.rightExpandedKey = getTreeKeys(this.rightTreeData)
      this.emitKeys = this.rightExpandedKey
    },
    // 左侧选择
    handleLeftChecked(_, { node, halfCheckedKeys }, checkedKeys, itemSelect) {
      this.leftCheckedKey = _
      this.leftHalfCheckedKeys = [...new Set([...this.leftHalfCheckedKeys, ...halfCheckedKeys])]
      this.leftCheckedAllKey = [...new Set([...this.leftHalfCheckedKeys, ...halfCheckedKeys, ..._])]
      const { eventKey } = node
      itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
    },
    // 右侧选择
    handleRightChecked(_, { node, halfCheckedKeys }, checkedKeys, itemSelect) {
      this.rightCheckedKey = _
      this.rightCheckedAllKey = [...halfCheckedKeys, ..._]
      const { eventKey } = node
      itemSelect(eventKey, isChecked(_, eventKey))
    },
  },
}
</script>

<style scoped lang="less">
.ant-transfer {
  ::v-deep(.ant-transfer-list) {
    width: 300px;
  }
}
</style>
