<template>
    <div>
      <nav-head></nav-head>
      <div class="nav-breadcrumb-wrap">
        <div class="container">
          <nav class="nav-breadcrumb">
            <a href="/">Home</a>
            <span>Goods</span>
          </nav>
        </div>
      </div>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" :class="{'sort-up':!sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show ':fitlerBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceCheck=='all'}" @click="priceCheck='all'">All</a></dd>
                <dd v-for="(item,index) in priceFilter" >
                  <a href="javascript:void(0)" :class="{'cur':priceCheck===index}" @click="setFilterPrice(index)">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList" :key="item.productId">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">¥{{item.salePrice}}元</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" class="loadMore">
                        <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">           
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <modal :mdShow="mdShow" @close="closeModal">
        <p slot="message">
          请先登陆,否则无法加入购物车!
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="mdShow=false" href="javascript:;">关闭</a>
        </div>
      </modal>

       <modal :mdShow="mdShowCart" @close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功!</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="mdShowCart=false" href="javascript:;">继续购物</a>
          <router-link to="/cart" class="btn btn--m" href="javascript:;">查看购物车</router-link>
        </div>
      </modal>
      <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHead from "./../components/NavHead" 
    import NavBread from "./../components/NavBread"
    import NavFooter from "./../components/NavFooter"
    import Modal from "./../components/Modal"
    import axios from "axios"
    export default{
        data(){
            return {
              goodsList:[],
              sortFlag:true,
              page:1,
              pageSize:8,
              busy:true,
              loading:false,
              mdShow:false,
              mdShowCart:false,
              priceFilter:[
                {
                  startPrice:"0.00",
                  endPrice:"100.00"
                },
                 {
                  startPrice:"100.00",
                  endPrice:"500.00"
                },
                 {
                  startPrice:"500.00",
                  endPrice:"1000.00"
                },
                {
                  startPrice:"1000.00",
                  endPrice:"5000.00"
                }
              ],
              priceCheck:"all", //加个选中状态
              fitlerBy:false, //弹窗效果(响应式,小窗口时)
              overLayFlag:false //遮罩效果
            }
        },
        components:{
          NavHead,
          NavBread,
          NavFooter,
          Modal
        },
        mounted(){
          this.getGoodsList()
        },
        methods:{
          //获取商品列表
          getGoodsList(flag){
            var param = {
              page:this.page,
              pageSize:this.pageSize,
              sort:this.sortFlag ? 1 :-1,//排序:升序或者降序
              priceLevel:this.priceCheck
            }
            this.loading = true
            axios.get("/goods/list",{
              params:param
            }).then((result)=>{
              var res = result.data.result
              this.loading = false  
             // console.log(result.data)
              if(result.data.status == "0"){
                if(flag){
                  this.goodsList = this.goodsList.concat(res.list)
                  if(res.count == 0){
                    this.busy = true
                  }else{
                    this.busy = false
                  }
                }else{
                  this.goodsList = res.list
                  this.busy = false
                }
                
              }else{
                this.goodsList = []
              } 
            })
          },
          //打开弹框
          showFilterPop(){
            this.fitlerBy = true
            this.overLayFlag = true
          },
          //关闭弹框
          closePop(){
            this.fitlerBy = false
            this.overLayFlag = false
          },
          //价格过滤
          setFilterPrice(index){
            this.priceCheck = index
            this.page = 1
            this.getGoodsList()
            this.closePop()
          },
          //商品排序
          sortGoods(){
            this.sortFlag = !this.sortFlag
            this.page = 1
            this.getGoodsList()
          },
          // 下拉加载更多
          loadMore(){
            this.busy = true
            setTimeout(() => {
              this.page++
              this.getGoodsList(true)
            }, 500);
          },
          //加入购物车
          addCart(productId){
            axios.post("/goods/addCart",{
              productId:productId
            }).then((res)=>{
             // console.log(res);
              if(res.data.status == "0"){
                 this.mdShowCart = true
                 this.$store.commit("updateCartCount",1)
              }else{
               this.mdShow = true
              }
            })
          },
          closeModal(){
            this.mdShow = false
            this.mdShowCart = false
          }
        }
    }
</script>
<style scoped>
.loadMore{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.sort-up{
  transform: rotate(180deg);
  transition: all .3s ease-out;
}
.icon-arrow-short{
  transition: all .3s ease-out;
}
</style>
