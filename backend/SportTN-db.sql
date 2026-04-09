CREATE DATABASE SportTN;
GO
USE SportTN;
GO

-- 1. MODULE: USER
CREATE TABLE users (
                       id BIGINT IDENTITY(1,1) PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       phone VARCHAR(20) NULL,
                       role VARCHAR(20) DEFAULT 'CUSTOMER',
                       status VARCHAR(20) DEFAULT 'ACTIVE',
                       total_points INT DEFAULT 0,
                       created_at DATETIME2 DEFAULT GETDATE(),
                       updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE profiles (
                          user_id BIGINT PRIMARY KEY,
                          full_name NVARCHAR(100),
                          gender NVARCHAR(10),
                          birthday DATE,
                          avatar_url VARCHAR(255),
                          CONSTRAINT FK_Profiles_Users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE addresses (
                           id BIGINT IDENTITY(1,1) PRIMARY KEY,
                           user_id BIGINT NOT NULL,
                           receiver_name NVARCHAR(100) NOT NULL,
                           receiver_phone VARCHAR(20) NOT NULL,
                           province NVARCHAR(100) NOT NULL,
                           district NVARCHAR(100) NOT NULL,
                           ward NVARCHAR(100) NOT NULL,
                           address_detail NVARCHAR(255) NOT NULL,
                           is_default BIT DEFAULT 0,
                           created_at DATETIME2 DEFAULT GETDATE(),
                           CONSTRAINT FK_Addresses_Users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. MODULE: PRODUCT & CATALOG
CREATE TABLE categories (
                            id BIGINT IDENTITY(1,1) PRIMARY KEY,
                            parent_id BIGINT NULL,
                            name NVARCHAR(100) NOT NULL,
                            slug VARCHAR(150) NOT NULL UNIQUE,
                            is_active BIT DEFAULT 1,
                            CONSTRAINT FK_Categories_Parent FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE brands (
                        id BIGINT IDENTITY(1,1) PRIMARY KEY,
                        name NVARCHAR(100) NOT NULL,
                        logo_url VARCHAR(255),
                        description NVARCHAR(MAX),
                        is_active BIT DEFAULT 1
);

CREATE TABLE products (
                          id BIGINT IDENTITY(1,1) PRIMARY KEY,
                          category_id BIGINT NOT NULL,
                          brand_id BIGINT NOT NULL,
                          name NVARCHAR(200) NOT NULL,
                          slug VARCHAR(255) NOT NULL UNIQUE,
                          description NVARCHAR(MAX),
                          sport_type NVARCHAR(50),
                          avg_rating DECIMAL(3,2) DEFAULT 0,
                          created_at DATETIME2 DEFAULT GETDATE(),
                          updated_at DATETIME2 DEFAULT GETDATE(),
                          is_active BIT DEFAULT 1,
                          CONSTRAINT FK_Products_Categories FOREIGN KEY (category_id) REFERENCES categories(id),
                          CONSTRAINT FK_Products_Brands FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE TABLE product_variants (
                                  id BIGINT IDENTITY(1,1) PRIMARY KEY,
                                  product_id BIGINT NOT NULL,
                                  sku VARCHAR(50) NOT NULL UNIQUE,
                                  color NVARCHAR(50),
                                  size NVARCHAR(20),
                                  original_price DECIMAL(18,2) NOT NULL,
                                  sale_price DECIMAL(18,2) NOT NULL,
                                  stock_quantity INT NOT NULL DEFAULT 0,
                                  weight_gram INT,
                                  CONSTRAINT FK_Variants_Products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_images (
                                id BIGINT IDENTITY(1,1) PRIMARY KEY,
                                product_id BIGINT NOT NULL,
                                image_url VARCHAR(255) NOT NULL,
                                is_main BIT DEFAULT 0,
                                CONSTRAINT FK_Images_Products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 3. MODULE: VOUCHER & MARKETING
CREATE TABLE vouchers (
                          id BIGINT IDENTITY(1,1) PRIMARY KEY,
                          code VARCHAR(50) NOT NULL UNIQUE,
                          title NVARCHAR(200),
                          discount_type VARCHAR(20),
                          discount_value DECIMAL(18,2) NOT NULL,
                          min_order_value DECIMAL(18,2) DEFAULT 0,
                          max_discount DECIMAL(18,2),
                          start_date DATETIME2,
                          end_date DATETIME2,
                          usage_limit INT DEFAULT 1,
                          used_count INT DEFAULT 0,
                          is_active BIT DEFAULT 1
);

-- 4. MODULE: CART
CREATE TABLE carts (
                       id BIGINT IDENTITY(1,1) PRIMARY KEY,
                       user_id BIGINT NOT NULL UNIQUE,
                       created_at DATETIME2 DEFAULT GETDATE(),
                       updated_at DATETIME2 DEFAULT GETDATE(),
                       CONSTRAINT FK_Carts_Users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
                            id BIGINT IDENTITY(1,1) PRIMARY KEY,
                            cart_id BIGINT NOT NULL,
                            variant_id BIGINT NOT NULL,
                            quantity INT NOT NULL CHECK (quantity > 0),
                            CONSTRAINT FK_CartItems_Carts FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
                            CONSTRAINT FK_CartItems_Variants FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- 5. MODULE: ORDER & SHIPPING
CREATE TABLE orders (
                        id BIGINT IDENTITY(1,1) PRIMARY KEY,
                        user_id BIGINT NOT NULL,
                        voucher_id BIGINT NULL,
                        order_code VARCHAR(20) NOT NULL UNIQUE,
                        total_amount DECIMAL(18,2) NOT NULL,
                        shipping_fee DECIMAL(18,2) DEFAULT 0,
                        voucher_discount DECIMAL(18,2) DEFAULT 0,
                        points_discount_amount DECIMAL(18,2) DEFAULT 0,
                        final_amount DECIMAL(18,2) NOT NULL,
                        points_earned INT DEFAULT 0,
                        points_used INT DEFAULT 0,
                        status VARCHAR(30) DEFAULT 'PENDING',
                        payment_method VARCHAR(30),
                        payment_status VARCHAR(30) DEFAULT 'UNPAID',
                        customer_note NVARCHAR(500),
                        cancel_reason NVARCHAR(500),
                        created_at DATETIME2 DEFAULT GETDATE(),
                        CONSTRAINT FK_Orders_Users FOREIGN KEY (user_id) REFERENCES users(id),
                        CONSTRAINT FK_Orders_Vouchers FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

CREATE TABLE order_items (
                             id BIGINT IDENTITY(1,1) PRIMARY KEY,
                             order_id BIGINT NOT NULL,
                             variant_id BIGINT NOT NULL,
                             quantity INT NOT NULL,
                             price_at_purchase DECIMAL(18,2) NOT NULL,
                             CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                             CONSTRAINT FK_OrderItems_Variants FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

CREATE TABLE shipping_info (
                               id BIGINT IDENTITY(1,1) PRIMARY KEY,
                               order_id BIGINT NOT NULL UNIQUE,
                               carrier NVARCHAR(100),
                               tracking_number VARCHAR(100),
                               estimated_delivery DATETIME2,
                               actual_delivery DATETIME2,
                               address_full NVARCHAR(500),
                               CONSTRAINT FK_Shipping_Orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 6. MODULE: PAYMENT
CREATE TABLE payments (
                          id BIGINT IDENTITY(1,1) PRIMARY KEY,
                          order_id BIGINT NOT NULL,
                          payment_method VARCHAR(30) NOT NULL,
                          transaction_id VARCHAR(100) NULL,
                          amount DECIMAL(18,2) NOT NULL,
                          payment_status VARCHAR(30) DEFAULT 'PENDING',
                          paid_at DATETIME2,
                          created_at DATETIME2 DEFAULT GETDATE(),
                          CONSTRAINT FK_Payments_Orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 7. MODULE: LOYALTY & REVIEWS
CREATE TABLE point_history (
                               id BIGINT IDENTITY(1,1) PRIMARY KEY,
                               user_id BIGINT NOT NULL,
                               order_id BIGINT NULL,
                               amount INT NOT NULL,
                               type VARCHAR(20),
                               description NVARCHAR(255),
                               created_at DATETIME2 DEFAULT GETDATE(),
                               CONSTRAINT FK_Points_Users FOREIGN KEY (user_id) REFERENCES users(id),
                               CONSTRAINT FK_Points_Orders FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE reviews (
                         id BIGINT IDENTITY(1,1) PRIMARY KEY,
                         user_id BIGINT NOT NULL,
                         product_id BIGINT NOT NULL,
                         rating INT CHECK (rating BETWEEN 1 AND 5),
                         comment NVARCHAR(MAX),
                         created_at DATETIME2 DEFAULT GETDATE(),
                         CONSTRAINT FK_Reviews_Users FOREIGN KEY (user_id) REFERENCES users(id),
                         CONSTRAINT FK_Reviews_Products FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 8. MODULE: INVENTORY
CREATE TABLE inventory_logs (
                                id BIGINT IDENTITY(1,1) PRIMARY KEY,
                                variant_id BIGINT NOT NULL,
                                user_id BIGINT NULL,
                                change_quantity INT NOT NULL,
                                action_type VARCHAR(50),
                                reason NVARCHAR(500),
                                created_at DATETIME2 DEFAULT GETDATE(),
                                CONSTRAINT FK_InvLogs_Variants FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);


