package com.ttn.sporttn.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class RabbitMQConfig {
    public static final String ORDER_QUEUE        = "order.queue";
    public static final String ORDER_EXCHANGE     = "order.exchange";
    public static final String ORDER_KEY          = "order.routing.key";

    public static final String ORDER_DLQ          = "order.queue.dlq";
    public static final String ORDER_DL_EXCHANGE  = "order.exchange.dlx";
    public static final String ORDER_DL_KEY       = "order.routing.key.dlq";

    @Bean
    public Queue orderQueue() {
        return QueueBuilder.durable(ORDER_QUEUE)
                .withArgument("x-dead-letter-exchange", ORDER_DL_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", ORDER_DL_KEY)
                .build();
    }

    @Bean
    public Queue orderDLQ() {
        return new Queue(ORDER_DLQ, true);
    }

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange(ORDER_EXCHANGE);
    }

    @Bean
    public DirectExchange orderDLExchange() {
        return new DirectExchange(ORDER_DL_EXCHANGE);
    }

    @Bean
    public Binding orderBinding(Queue orderQueue, DirectExchange orderExchange) {
        return BindingBuilder.bind(orderQueue).to(orderExchange).with(ORDER_KEY);
    }

    @Bean
    public Binding orderDLQBinding(Queue orderDLQ, DirectExchange orderDLExchange) {
        return BindingBuilder.bind(orderDLQ).to(orderDLExchange).with(ORDER_DL_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        template.setConfirmCallback((correlation, ack, reason) -> {
            if (!ack) log.error("[MQ] Message không đến exchange: {}", reason);
        });
        return template;
    }
}
