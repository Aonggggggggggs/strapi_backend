'use strict';

/**
 * rent-request service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rent-request.rent-request');
