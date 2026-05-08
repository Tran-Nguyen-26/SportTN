package com.ttn.sporttn.modules.order.producer;

import com.ttn.sporttn.config.RabbitMQConfig;
import com.ttn.sporttn.modules.order.dto.request.OrderMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendOrder(OrderMessage message) {
        log.info("Gửi đơn hàng vào queue: userId={}", message.getUserId());
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ORDER_EXCHANGE,
                RabbitMQConfig.ORDER_KEY,
                message
        );
    }
}

