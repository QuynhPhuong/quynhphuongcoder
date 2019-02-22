$(function(){
    $('#listImgZoom_2').carouFredSel({
        items: 4,
        easing:'linear',
        height: 435,
        width: '100%',
        duration: 200,
        direction: "up",
        scroll: {
            items: 1,
            visible: true,
            duration: 200,
            onAfter: function( data ) {
                data.items.visible.first().find('img').addClass('cloudzoom-gallery-active');
            }
        },
        auto: false,
        prev : {
            button : "#prevSlideZ",
            key : "left"
        },
        next : {
            button : "#nextSlideZ",
            key : "right"
        }
    });

    if ($('#zoomer').length) {
        CloudZoom.quickStart();
    }

    $('#QttDown').click(function () {
        var qtt = $('#Quantity'), m = parseInt(qtt.attr('data-max')), v = parseInt(qtt.attr('data-value'));
        if (v > 1) {
            qtt.attr('data-value', v - 1);
            qtt.html(v - 1);
            $('.btnAddCart').attr('data-quantity',v - 1);
        }
    });
    $('#QttUp').click(function () {
        var qtt = $('#Quantity'), m = parseInt(qtt.attr('data-max')), v = parseInt(qtt.attr('data-value'));
        if (v < m) {
            qtt.attr('data-value', v + 1);
            qtt.html(v + 1);
            $('.btnAddCart').attr('data-quantity',v + 1);
        }
    });

    $('.attrColor a').click(function(){
        $('.attrColor a').removeClass('active');
        $(this).addClass('active');
        $('.btnAddCart').attr('data-color',$(this).attr('data-attr'));
    });

    $('.attrSize a').click(function(){
        $('.attrSize a').removeClass('active');
        $(this).addClass('active');
        $('.btnAddCart').attr('data-size',$(this).attr('data-attr'));
    });

    $('.btnAddCart').click(function(){

        var products = [], ps = {};
        ps['id'] = $(this).attr('data-id');
        ps['quantity'] = $(this).attr('data-quantity');
        ps['data-color'] = $(this).attr('data-color');
        ps['data-size'] = $(this).attr('data-size');

        products.push(ps);

        addToCart(products, 1, function(rs){
            $('.totalCart').find('span').text(rs.data['totalProducts']);
//            if(rs.status == 1){
            $('#myModal').modal('show');
            $.post('/cart/index', {template: 'order/cart/product', terminal: true},function(r){
                $('#myModal .modal-body').empty().append(r);
                $.getScript(updateCart());
            });
            $.post('/cart/index', {template: 'order/cart/cart-mini', terminal: true},function(r){
                $('.head .cart').empty().append(r);
            });
//            }
        });

        function addToCart(products, mode, callback) {
            $.ajax({
                type: 'POST',
                url: '/cart/add',
                data: {'products': products, 'mode': mode},
                timeout: 500,
                success: function (rs) {
                    callback(rs);
                }
            });
        }
    });

    $('.detailPayorder>div').click(function(){
        var t = $(this);
        if(!t.hasClass('active')){
            $('.detailPayorder>div').removeClass('active');
            $('.detailPayorder>div>div').slideUp();
            $('.detailPayorder>div').find('i').removeClass('fa-caret-down').addClass('fa-caret-right');

        }
        t.find('div').slideDown();
        t.addClass('active');
        $(this).find('i').removeClass('fa-caret-right').addClass('fa-caret-down');
    });

//    function loadImages(){
//        function owl(){

    $("#product").owlCarousel({
        items: 1,
        singleItem: true,
        nav: true,
        dots: true,
        transitionStyle:"fade",
        navText: [
            "<i class='fa fa-angle-left'></i>",
            "<i class='fa fa-angle-right'></i>"
        ],
        scroll: {
            items: 1,
            visible: true,
            duration: 400,
        }

    });
//        }
//
//        var viewLink = $('#viewLink').val();
//        if(viewLink.length){
//            $.post('/'+viewLink,{images: 'images', terminal: true},function(r){
//                $('.detailProduct').prepend(r);
//                $.getScript(owl());
//            });
//        }
//    }
//    setInterval(loadImages(), 5000);

    function updateCart(){

        $('.changeQuantity').change(function(){
            $.post('/cart/change',{
                dataId: $(this).attr('data-id'),
                dataColor: $(this).attr('data-color') ? $(this).attr('data-color'):null,
                dataSize: $(this).attr('data-size') ? $(this).attr('data-size'):null,
                dataQuantity: $(this).find(':selected').text()
            },function(r){
                if(r.code == 0){
                    alert('Chúng tôi không tìm th?y s?n ph?m này');
                }else{
                    $.post('/cart/index', {template: 'order/cart/product', terminal: true},function(r){
                        $('#myModal .modal-body').empty().append(r);
                        $.getScript(updateCart());
                    });
                }
            });
        });

        var hide = true;
        var t = $('.deleteCart');
        var clicks = true;

        t.click(function() {
            var t = $(this);
            var td = t.closest('tr');

            if (clicks) {
                $(this).text('OK');
                $(this).removeClass('fa fa-trash-o');
                clicks = false;
            } else {
                $.post('/cart/remove',{
                    dataId: $(this).attr('data-id'),
                    dataColor: $(this).attr('data-color') ? $(this).attr('data-color'):null,
                    dataSize: $(this).attr('data-size') ? $(this).attr('data-size'):null
                },function(r){
                    if(r.code == 0){
                        alert('We are can not find product on system');
                    }else if(r.code == 1){
                        $.post('/cart/index', {template: 'order/cart/product', terminal: true},function(r){
                            $('#myModal .modal-body').empty().append(r);
                            $.getScript(updateCart());
                        });
                    }
                });
                clicks = true;
            }
        });

        $('html').click(function(e){
            if ($(e.target).hasClass('deleteCart')) {
                return false;
            }
            if(hide){
                t.addClass('fa fa-trash-o').text('');
            }
            clicks = true;
            hide = true;
        });
    }
});