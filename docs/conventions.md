# 团队约定（开工前确认版）

> 这份文件是全组共同遵守的技术约定。任何人要修改，必须先在群里说明，由组长确认后更新此文件。

## 0. 成员对应表（会上填写）

| 角色 | 真实姓名 | GitHub 用户名 | 分支 |
| --- | --- | --- | --- |
| 组长（工程、路由、布局、集成） | 贾世爱 | a13163195666 | `feature/leader` |
| 首页与需求（列表、搜索、筛选、排序、草图） | 张艺苧 | ZTenVIC | `feature/home` |
| 页面与组件（ProductCard、详情页、手机适配） | 祁点 | ivan737373 | `feature/pages` |
| 数据与交互（store、Mock、发布、个人中心） | 张语桐 | xiaoyingtaoddd | `feature/profile` |
| 订单与测试文档（订单、测试、README、演示） | 吴汶睿 | Matryoshka64064 | `feature/data` |

## 1. 命名统一

| 项目 | 统一用 | 不允许出现 |
| --- | --- | --- |
| 商品对象 | `product` | goods、item、commodity、商品拼音 |
| 商品数组 | `products` | goodsList、productList（在 store 内部用 `products`） |
| 商品 ID | `productId` | goodsId、pid |
| 商品卡片组件 | `ProductCard.vue` | GoodsCard.vue |
| 商品状态值 | `available` / `offline` / `sold` | 上架、已售（中文值）、on_sale |

## 2. 分支规范

- 分支统一用 `feature/` 前缀，**不要有人用 `feat/`**
- 已有分支：`feature/leader`、`feature/home`、`feature/pages`、`feature/data`、`feature/profile`
- 所有人都从最新的 `main` 起步

```powershell
git switch main
git pull
git switch feature/你的分支
git merge main        # 把最新的公共代码同步进自己的分支
```

## 3. 商品字段契约

```js
{
  id: 1,                              // Number，唯一
  title: '二手高等数学教材',           // String，非空
  price: 25,                          // Number，大于 0
  category: '教材',                    // String
  condition: '九成新',                 // String
  description: '九成新，无破损',        // String
  image: '/images/book.jpg',          // String
  sellerId: 101,                      // Number
  status: 'available',                // available | offline | sold
  createdAt: '2026-11-13T10:00:00'    // ISO 字符串
}
```

**字段只能增加，不能改名。** 需要新增字段时，先在群里说明，由数据负责人统一加到 store 初始数据里。

## 4. 模拟用户

本项目不做真实登录，使用固定模拟身份：

| 用户 | sellerId | 用途 |
| --- | --- | --- |
| 当前用户 | `101` | 个人中心只显示 `sellerId === 101` 的商品 |
| 另一个用户 | `102` | 用于演示"买别人的商品"，或作为示例数据的卖家 |

## 5. 共享状态方法契约（数据负责人实现，其他人调用）

```js
const store = useProductStore()

store.products            // 商品数组
store.getProducts()       // 返回当前全部商品
store.getProductById(id)  // 按 id 返回单个商品，找不到返回 undefined
store.addProduct(product) // 新增商品，返回新商品
store.updateProduct(id, changes) // 局部更新，如改 status
store.removeProduct(id)   // 删除商品
```

**规则**

- 页面里不要自己 `filter` 原始数组来模拟"已下架"这类业务，统一走 store 的方法或 getters
- 不要各自另建一套共享状态（比如自己在页面里 `ref([])` 存商品）
- 方法名一旦定下不能改，改要全员通知

## 6. 文件归属（谁写哪个文件）

| 负责人 | 文件 |
| --- | --- |
| 组长 | `router/index.js`、`App.vue`、`components/NavBar.vue`、`main.js` |
| 首页负责人 | `views/HomeView.vue`、`components/SearchBar.vue` |
| 页面与组件负责人 | `views/ProductDetailView.vue`、`components/ProductCard.vue`、`components/EmptyState.vue` |
| 数据与交互负责人 | `stores/productStore.js`、`data/products.js`、`views/PublishView.vue`、`views/ProfileView.vue`、`components/ProductForm.vue` |
| 订单与测试负责人 | `stores/orderStore.js`、`views/OrderView.vue`、`README.md`、`docs/` 下的测试记录 |

**一个文件只有一个负责人。** 需要用别人的文件，读它、调它，不要复制一份改。

## 7. 提交规范

```
feat: 完成首页商品列表
fix: 修复价格排序结果错误
docs: 补充 README 运行说明
chore: 统一命名
```

不写 `update`、`修改`、`111`。

## 8. 数据没接好时怎么办

- 可以先用**字段完全一致**的本地演示数据写页面
- 但**不能**自己新建一套 store 或自己 `localStorage`
- 等 store 就绪后，把演示数据换成 `store.getProducts()` 即可，其他代码不用动

## 9. 第一次集成检查

目标只跑一条流程：

```
发布商品 → 首页能看到 → 点击进入详情 → 刷新后仍然存在
```

检查时间：**2026年11月17日 20:00（暂定，会上确认后可改）**

检查方式：每人说明自己负责的部分如何验证，现场演示，不允许只看截图。

## 10. 每日同步

群里回复格式：

```
当前分支：feature/xxx
今天完成：xxx
遇到问题：xxx / 无
明天计划：xxx
```

有阻塞当天说，不要留到检查时。
