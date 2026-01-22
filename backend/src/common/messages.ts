/**
 * ✅ Centralized Error Messages
 * All error messages in Vietnamese for consistent UX
 */
export const ErrorMessages = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  AUTH_ACCOUNT_LOCKED: 'Tài khoản đã bị khóa. Vui lòng thử lại sau',
  AUTH_TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
  AUTH_TOKEN_INVALID: 'Token không hợp lệ',
  AUTH_UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện thao tác này',
  AUTH_FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',

  // User
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  USER_EMAIL_EXISTS: 'Email đã được sử dụng',
  USER_PHONE_INVALID: 'Số điện thoại không hợp lệ',
  USER_EMAIL_INVALID: 'Email không hợp lệ',

  // Product
  PRODUCT_NOT_FOUND: 'Sản phẩm không tồn tại',
  PRODUCT_INACTIVE: 'Sản phẩm không còn được bán',
  PRODUCT_OUT_OF_STOCK: 'Sản phẩm đã hết hàng',
  PRODUCT_INSUFFICIENT_STOCK: 'Không đủ hàng trong kho',

  // Cart
  CART_EMPTY: 'Giỏ hàng trống',
  CART_ITEM_NOT_FOUND: 'Không tìm thấy sản phẩm trong giỏ hàng',
  CART_STOCK_EXCEEDED: 'Số lượng vượt quá tồn kho',

  // Order
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
  ORDER_INVALID_STATUS: 'Trạng thái đơn hàng không hợp lệ',
  ORDER_CANNOT_CANCEL: 'Không thể hủy đơn hàng này',
  ORDER_ITEMS_REQUIRED: 'Vui lòng chọn ít nhất một sản phẩm',

  // Service
  SERVICE_NOT_FOUND: 'Dịch vụ không tồn tại',
  SERVICE_INACTIVE: 'Dịch vụ hiện không khả dụng',

  // Booking
  BOOKING_NOT_FOUND: 'Không tìm thấy lịch hẹn',
  BOOKING_DATE_PAST: 'Ngày đặt lịch phải từ hôm nay trở đi',
  BOOKING_TIME_INVALID: 'Thời gian đặt lịch không hợp lệ',

  // Review
  REVIEW_NOT_FOUND: 'Không tìm thấy đánh giá',
  REVIEW_DUPLICATE: 'Bạn đã đánh giá sản phẩm này rồi',
  REVIEW_RATING_INVALID: 'Đánh giá phải từ 1 đến 5 sao',

  // Promotion
  PROMOTION_NOT_FOUND: 'Mã khuyến mãi không tồn tại',
  PROMOTION_EXPIRED: 'Mã khuyến mãi đã hết hạn',
  PROMOTION_NOT_STARTED: 'Mã khuyến mãi chưa có hiệu lực',
  PROMOTION_MIN_ORDER: 'Đơn hàng chưa đạt giá trị tối thiểu',

  // Payment
  PAYMENT_NOT_FOUND: 'Không tìm thấy thanh toán',
  PAYMENT_FAILED: 'Thanh toán thất bại',
  PAYMENT_AMOUNT_MISMATCH: 'Số tiền thanh toán không khớp',

  // Inventory
  INVENTORY_NOT_FOUND: 'Không tìm thấy thông tin tồn kho',

  // General
  VALIDATION_FAILED: 'Dữ liệu không hợp lệ',
  INTERNAL_ERROR: 'Đã xảy ra lỗi. Vui lòng thử lại sau',
  BAD_REQUEST: 'Yêu cầu không hợp lệ',
};

/**
 * Success Messages
 */
export const SuccessMessages = {
  ORDER_CREATED: 'Đặt hàng thành công',
  ORDER_CANCELLED: 'Hủy đơn hàng thành công',
  BOOKING_CREATED: 'Đặt lịch thành công',
  REVIEW_CREATED: 'Đánh giá đã được gửi',
  CART_UPDATED: 'Cập nhật giỏ hàng thành công',
  PAYMENT_SUCCESS: 'Thanh toán thành công',
  PASSWORD_RESET: 'Đặt lại mật khẩu thành công',
  PASSWORD_CHANGED: 'Đổi mật khẩu thành công',
};
