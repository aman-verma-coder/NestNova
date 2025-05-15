const AuditLog = require("../models/auditLog.js");

/**
 * Utility for creating audit log entries
 */
const auditLogger = {
    /**
     * Log an action in the system
     * @param {Object} logData - The log data
     * @param {string} logData.user - Username or identifier of the user performing the action
     * @param {string} logData.action - The action being performed (create, update, delete, login, etc.)
     * @param {string} logData.resourceType - Type of resource being acted upon (user, listing, booking, etc.)
     * @param {string} logData.resourceId - ID of the resource being acted upon
     * @param {string} [logData.ipAddress] - IP address of the user
     * @param {Object} [logData.details] - Additional details about the action
     * @param {string} [logData.status=success] - Status of the action (success, failure, warning)
     * @param {Object} [logData.changes] - Changes made to the resource
     * @param {Object} [logData.changes.before] - State of the resource before the change
     * @param {Object} [logData.changes.after] - State of the resource after the change
     * @returns {Promise<AuditLog>} The created audit log entry
     */
    async log(logData) {
        try {
            const auditLog = new AuditLog({
                user: logData.user,
                action: logData.action,
                resourceType: logData.resourceType,
                resourceId: logData.resourceId,
                ipAddress: logData.ipAddress,
                details: logData.details,
                status: logData.status || "success",
                changes: logData.changes
            });

            return await auditLog.save();
        } catch (error) {
            console.error("Error creating audit log:", error);
            // Still return something even if logging fails
            return null;
        }
    },

    /**
     * Get audit logs with optional filtering
     * @param {Object} filters - Filters to apply
     * @returns {Promise<Array>} Array of audit logs
     */
    async getLogs(filters = {}) {
        try {
            let query = {};

            // Apply filters if provided
            if (filters.user) query.user = filters.user;
            if (filters.action) query.action = filters.action;
            if (filters.resourceType) query.resourceType = filters.resourceType;
            if (filters.resourceId) query.resourceId = filters.resourceId;
            if (filters.status) query.status = filters.status;

            // Date range filtering
            if (filters.startDate || filters.endDate) {
                query.timestamp = {};
                if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
                if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
            }

            return await AuditLog.find(query).sort({ timestamp: -1 });
        } catch (error) {
            console.error("Error fetching audit logs:", error);
            return [];
        }
    }
};

module.exports = auditLogger;