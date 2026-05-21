Page({
  data: {
    menuData: {},
    categories: [],
    activeCategory: 'stir-fried',
    cart: [],
    totalPrice: 0,
    showCart: false
  },

  onLoad: function () {
    const menuData = {
      "stir-fried": [
        { "name": "鱼香肉丝", "price": 28.00, "image": "yuxiangrousi.jpg", "options": [{ "type": "辣度", "values": ["不辣", "微辣", "中辣", "特辣"] }, { "type": "加料", "values": ["加饭", "加肉"] }] },
        { "name": "可乐鸡翅", "price": 28.00, "image": "kelejichi.jpg" },
        { "name": "西红柿鸡蛋", "price": 10.00, "image": "xihongshijidan.jpg" }
      ],
      "boiled": [
        { "name": "酸菜骨头", "price": 12.00, "image": "suancaigutou.jpg", "options": [{ "type": "辣度", "values": ["不辣", "微辣"] }] },
        { "name": "茄子炖土豆", "price": 18.00, "image": "qiezidutudou.jpg" }
      ],
      "fried": [
        { "name": "煎饺", "price": 5.00, "image": "jianjiao.jpg" },
        { "name": "煎蛋", "price": 1.00, "image": "jiandan.jpg" }
      ],
      "soup": [
        { "name": "豆腐汤", "price": 8.00, "image": "doufutang.jpg" }
      ],
      "carbohydrates": [
        { "name": "米饭", "price": 5.00, "image": "mifan.jpg" }
      ],
      "drinks": [
        { "name": "可乐", "price": 5.00, "image": "kele.jpg" }
      ],
      "desserts": [
        { "name": "蛋糕", "price": 18.00, "image": "dangao.jpg" }
      ],
      "cold dish": [
        { "name": "蘸酱菜", "price": 5.00, "image": "zhanjiangcai.jpg" }
      ]
    };

    const categories = [
      { key: 'stir-fried', name: '炒' },
      { key: 'boiled', name: '煮,烧' },
      { key: 'fried', name: '煎' },
      { key: 'soup', name: '汤' },
      { key: 'carbohydrates', name: '主食' },
      { key: 'drinks', name: '饮料' },
      { key: 'desserts', name: '甜点' },
      { key: 'cold dish', name: '凉菜' }
    ];

    this.setData({
      menuData: menuData,
      categories: categories
    });
  },

  selectCategory: function(e) {
    this.setData({
      activeCategory: e.currentTarget.dataset.key
    });
  },

  addToCart: function(e) {
    const item = e.currentTarget.dataset.item;
    let cart = this.data.cart;
    const existingItem = cart.find(cartItem => cartItem.name === item.name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    this.setData({ cart: cart });
    this.calculateTotal();
  },

  navigateToDetail: function(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
    });
  },

  addToCartFromDetail: function(item) {
    let cart = this.data.cart;
    const existingItem = cart.find(cartItem => 
      cartItem.name === item.name && 
      JSON.stringify(cartItem.selectedOptions) === JSON.stringify(item.selectedOptions)
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    this.setData({ cart: cart });
    this.calculateTotal();
  },

  calculateTotal: function() {
    let total = this.data.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.setData({ totalPrice: total });
  },

  toggleCart: function() {
    this.setData({ showCart: !this.data.showCart });
  },

  checkout: function() {
    if (this.data.cart.length === 0) {
      wx.showToast({
        title: '购物车是空的！',
        icon: 'none'
      });
      return;
    }
    wx.showModal({
      title: '结算',
      content: `总计: ￥${this.data.totalPrice.toFixed(2)}`,
      success: (res) => {
        if (res.confirm) {
          this.setData({ cart: [], totalPrice: 0 });
          wx.showToast({ title: '结算成功！' });
        }
      }
    });
  }
});
