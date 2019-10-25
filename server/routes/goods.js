var express = require("express")
var router = express.Router()

var mongoose = require("mongoose")
var Goods = require("../models/goods")

//监听http请求
mongoose.connect('mongodb://localhost:/lp-mall', function(err) {
    if (err) {
        console.log('数据库连接失败')
    } else {
        console.log('数据库连接成功')
    }
})

//查询商品列表
router.get("/list", (req, res, next) => {
    //分页
    let page = parseInt(req.query.page)
    let pageSize = parseInt(req.query.pageSize)
    let skip = (page - 1) * pageSize
    let priceLevel = req.query.priceLevel

    let params = {}
        //价格最大区间
    var priceGt = ""
        //价格最小区间
    var priceLte = ""
    if (priceLevel != "all") {
        switch (priceLevel) {
            case "0":
                priceGt = 0
                priceLte = 100
                break
            case "1":
                priceGt = 100
                priceLte = 500
                break
            case "2":
                priceGt = 500
                priceLte = 1000
                break
            case "3":
                priceGt = 1000
                priceLte = 5000
                break
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }
    //排序
    let sort = req.query.sort
    Goods.find(params).sort({ "salePrice": sort }).skip(skip).limit(pageSize)
        .exec(function(err, doc) {
            if (err) {
                res.json({
                    status: "1",
                    msg: err.message
                })
            } else {
                res.json({
                    status: "0",
                    msg: "",
                    result: {
                        count: doc.length,
                        list: doc
                    }
                })
            }
        })
})

//加入到购物车
router.post("/addCart", function(req, res, next) {
    var userId = '20151225',
        productId = req.body.productId
    var User = require('../models/user')
    User.findOne({ userId: userId }, function(err, userDoc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {

            if (userDoc) {
                var goodsItem = ''
                userDoc.cartList.forEach(function(item) {
                    if (item.productId == productId) {
                        goodsItem = item
                        item.productNum++
                            console.log(item)
                    }
                })
                if (goodsItem) {
                    userDoc.save(function(err2, doc2) {
                        if (err2) {
                            res.json({
                                status: "1",
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                msg: '',
                                result: 'suc'
                            })
                        }
                    })
                } else {
                    Goods.findOne({ productId: productId }, function(err1, doc) {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: err1.message
                            })
                        } else {
                            if (doc) {
                                doc.productNum = 1
                                doc.checked = 1
                                userDoc.cartList.push(doc)
                                userDoc.save(function(err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: "1",
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'suc'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
})

module.exports = router