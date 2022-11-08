	// Định nghĩa một mảng các phần tử sẽ bỏ vào giỏ hàng
  var shoppingCartItems = [];
  $(document).ready(function () {
      // Kiểm tra nếu đã có sessionStorage["shopping-cart-items"] hay chưa?
      if (localStorage["shopping-cart-items"] != null) {
          shoppingCartItems = JSON.parse(localStorage["shopping-cart-items"].toString());
      }
      // Hiển thị thông tin từ giỏ hàng
      displayShoppingCartItems();
  
});

// Thông báo thành công khi add sản phẩm
$(".add-to-cart").click(function(){
  toastr.success("Đã thêm sản phẩm vào giỏ hàng.");
});

  // Sự kiện click các button có class=".add-to-cart"
  $(".add-to-cart").click(function () {
      var button = $(this); // Lấy đối tượng button mà người dùng click
      var id = button.attr("id"); // id của sản phẩm là id của button
      var name = button.attr("data-name"); // name của sản phẩm là thuộc tính data-name của button
      var price = button.attr("data-price"); // price của sản phẩm là thuộc tính data-price của button
      var discount = button.attr("data-discount"); // price của sản phẩm là thuộc tính data-discount của button
      var quantity = 1; // Số lượng
      var item = {
          id: id,
          name: name,
          price: price,
          discount: discount,
          quantity: quantity
      };
      var exists = false;
      if (shoppingCartItems.length > 0) {
          $.each(shoppingCartItems, function (index, value) {
              // Nếu mặt hàng đã tồn tại trong giỏ hàng thì chỉ cần tăng số lượng mặt hàng đó trong giỏ hàng.
              if (value.id == item.id) {
                  value.quantity++;
                  exists = true;
                  return false;
              }
          });
      }
      // Nếu mặt hàng chưa tồn tại trong giỏ hàng thì bổ sung vào mảng
      if (!exists) {
          shoppingCartItems.push(item);
      }
      // Lưu thông tin vào sessionStorage
      localStorage["shopping-cart-items"] = JSON.stringify(shoppingCartItems); // Chuyển thông tin mảng shoppingCartItems sang JSON trước khi lưu vào sessionStorage
      // Gọi hàm hiển thị giỏ hàng
      displayShoppingCartItems();
  });

  // Xóa hết giỏ hàng shoppingCartItems
  $("#button-clear").click(function () {
      shoppingCartItems = [];
      localStorage["shopping-cart-items"] = JSON.stringify(shoppingCartItems);
      $("#table-products > tbody").html("");
      // hiển thị tổng đơn hàng
      $('#total').html('0');
  });

  function numberItem(id){
    var quantityNew = document.getElementById(id).value; // Số lượng mới
    $.each(shoppingCartItems, function (index, item) {
          
          if (item.id == id) {
              item.quantity = quantityNew;
                              
              localStorage["shopping-cart-items"] = JSON.stringify(shoppingCartItems);
              // Gọi hàm hiển thị giỏ hàng
              displayShoppingCartItems();
          }
      });
  }

  function remove(id) {
      
      $.each(shoppingCartItems, function (index, item) {
          
          if (item.id == id) {
              // Xóa phần tử tại index tìm thấy
              shoppingCartItems.splice(index, 1);
                              
              localStorage["shopping-cart-items"] = JSON.stringify(shoppingCartItems);
              // Gọi hàm hiển thị giỏ hàng
              displayShoppingCartItems();
      return false;
          }
      });
  }

  // Hiển thị giỏ hàng ra table
  function displayShoppingCartItems() {
      if (localStorage["shopping-cart-items"] != null) {
          shoppingCartItems = JSON.parse(localStorage["shopping-cart-items"].toString()); // Chuyển thông tin từ JSON trong sessionStorage sang mảng shoppingCartItems.
          $("#table-products > tbody").html("");
          // Duyệt qua mảng shoppingCartItems để append từng item dòng vào table
          var total = 0;
          $.each(shoppingCartItems, function (index, item) {
              // thành tiền = số lượng x đơn giá x tỷ lệ giảm giá
              var sum = item.price * item.quantity * (100 - item.discount) / 100;
              
              // tính tổng đơn hàng
              total += sum;
              var htmlString = "";
              htmlString += "<tr>";
              htmlString += "<td><img src='http://placehold.it/50'></td>";
              htmlString += "<td>" + item.id + "</td>";
              htmlString += "<td>" + item.name + "</td>";
              htmlString += "<td style='text-align: right'>" + parseInt(item.price).toLocaleString('vi-VN') + "</td>";
              htmlString += "<td style='text-align: right'>" + parseInt(item.discount).toLocaleString('vi-VN') + "% </td>";

              htmlString += "<td style='text-align: right'><input type='number' id='"+ item.id +"' onchange='numberItem(\"" + item.id + "\")' min='1' max='20' value='" + parseInt(item.quantity).toLocaleString('vi-VN') + "'/></td>";

              htmlString += "<td style='text-align: right'>" + sum.toLocaleString('vi-VN') + "</td>";
              htmlString += "<td style='width:1%'>" + "<button class='btn btn-xs btn-danger' onclick='remove(\"" + item.id + "\")'>Remove</button>" + "</td>";
              htmlString += "</tr>";
              $("#table-products > tbody:last").append(htmlString);
          });
          // hiển thị tổng đơn hàng
          $('#total').html(total.toLocaleString('vi-VN'));
      }
  }