package com.ttn.sporttn.modules.order.consumer;

import com.rabbitmq.client.Channel;
import com.ttn.sporttn.config.RabbitMQConfig;
import com.ttn.sporttn.modules.order.dto.request.OrderMessage;
import com.ttn.sporttn.modules.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderConsumer {

    private final OrderService orderService;

    @RabbitListener(queues = RabbitMQConfig.ORDER_QUEUE)
    public void handleOrder(OrderMessage message) {
        log.info("Nhận đơn hàng từ queue: userId={}", message.getUserId());
        try {
            orderService.processOrder(message);
            log.info("Xử lý đơn hàng thành công: userId={}", message.getUserId());
        } catch (Exception e) {
            log.error("Lỗi xử lý đơn hàng: {}", e.getMessage());
            // message sẽ vào Dead Letter Queue nếu đã cấu hình
            throw e;
        }
    }

    @RabbitListener(queues = RabbitMQConfig.ORDER_DLQ)
    public void handleFailedOrder(OrderMessage message) {
        log.error("[MQ] Đơn hàng thất bại vào DLQ: userId={}, message={}",
                message.getUserId(), message);
        // TODO: gửi email thông báo / alert
    }
}

