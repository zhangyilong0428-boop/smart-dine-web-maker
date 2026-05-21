Page({
  data: {
    item: null,
    selectedOptions: {}
  },

  onLoad: function (options) {
    const item = JSON.parse(decodeURIComponent(options.item));
    this.setData({ item: item });
  },

  selectOption: function(e) {
    const { type, value } = e.currentTarget.dataset;
    this.setData({
      [`selectedOptions.${type}`]: value
    });
  },

  addToCart: function() {
    const cartItem = {
      ...this.data.item,
      selectedOptions: this.data.selectedOptions
    };
    
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.addToCartFromDetail(cartItem);

    wx.navigateBack();
  }
});
