USE `integrations`;

CREATE TABLE IF NOT EXISTS `integration_ext_instances` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `external_instance_id` varchar(255) NOT NULL COMMENT 'id of org/workspace in the external integration service',
    `instance_url` varchar(256) DEFAULT NULL,
    `company_id` int(11) NOT NULL,
    `refresh_token` varchar(1024) DEFAULT NULL,
    `access_token` varchar(2048) DEFAULT NULL,
    `token_expiration` bigint(20) DEFAULT NULL,
    `created` datetime NOT NULL,
    `updated` datetime NOT NULL,
    PRIMARY KEY (`id`),
    KEY `company_id` (`company_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5069 DEFAULT CHARSET = utf8;

INSERT INTO `integration_ext_instances` (`id`, `external_instance_id`, `instance_url`, `company_id`, `refresh_token`, `access_token`, `token_expiration`, `created`, `updated`) VALUES
(1, '00D1t000000rRggEAE', 'https://d1t000000rrggeae-dev-ed.my.salesforce.com', 100552, '5Aep8610F.RUa2F48CdaaVZN6fuaLeH8.bCfW0LBeQkIjXFuei8S9KvW6ngFOK8Pr_2qBKDmatJpH9kI.98L2Gw', '00D1t000000rRgg!ARcAQOPCuiSsLX58pWrrQVhP0NmWPHaRCqrFoEOTWJq1vUlRiNqPW_M5iz7sUDa7KsmjCiTPoTT2yCVoj37eciy0KaDYxBHY', NULL, '2021-11-14 21:40:01', '2022-02-12 01:09:30');

CREATE TABLE IF NOT EXISTS `integrations` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `integration_ext_instance_id` int(11) DEFAULT NULL,
    `external_instance_id` varchar(255) DEFAULT NULL COMMENT 'identifikator prostredia danej organizacie v externej sluzbe',
    `company_id` int(11) NOT NULL,
    `status` int(11) NOT NULL COMMENT '-1 - setup incomplete, 0 - inactive, 1 - after save, 2 - active, 3 - synchronizing, 4 - deleted',
    `tag_id` int(11) DEFAULT NULL,
    `config` text NOT NULL,
    `name` varchar(100) NOT NULL,
    `caption` varchar(50) DEFAULT NULL COMMENT 'nazov, ktory sa zobrazuje v zozname (index) integracii',
    `last_import` datetime DEFAULT NULL,
    `last_scheduled` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `created` datetime NOT NULL,
    `modified` datetime NOT NULL,
    PRIMARY KEY (`id`),
    KEY `company_id` (`company_id`),
    KEY `tag_id` (`tag_id`),
    KEY `integration_ext_instance_id` (`integration_ext_instance_id`),
    CONSTRAINT `integrations_ibfk_3` FOREIGN KEY (`integration_ext_instance_id`) REFERENCES `integration_ext_instances` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 7242 DEFAULT CHARSET = utf8;

INSERT INTO `integrations` (`id`, `integration_ext_instance_id`, `external_instance_id`, `company_id`, `status`, `tag_id`, `config`, `name`, `caption`, `last_import`, `last_scheduled`, `created`, `modified`) VALUES
(1, 1, NULL, 100552, 2, 10767, '{\"importTickets\":\"0\",\"logOutboundAnswered\":\"1\",\"logOutboundAnsweredAsCallLog\":\"Completed\",\"logOutboundAnsweredAsCase\":\"None\",\"logOutboundUnanswered\":\"1\",\"logOutboundUnansweredAsCallLog\":\"In Progress\",\"logOutboundUnansweredAsCase\":\"Working\",\"logInboundAnswered\":\"1\",\"logInboundAnsweredAsCallLog\":\"Completed\",\"logInboundAnsweredAsCase\":\"None\",\"logMissed\":\"1\",\"logMissedAsCallLog\":\"Not Started\",\"logMissedAsCase\":\"None\",\"logVoicemail\":\"1\",\"logVoicemailAsCallLog\":\"Not Started\",\"logVoicemailAsCase\":\"None\",\"ifUnassociatedNumberThenCreate\":\"Contact\",\"restrictionByBusinessHours\":\"evenWhenLinesClosed\",\"linkedCallNumberIds\":[32405],\"logUnassociatedNumbers\":1}', 'salesforce', 'Salesforce', '2019-07-08 01:50:00', '0000-00-00 00:00:00', '2019-07-01 11:19:41', '2019-07-08 01:50:00');