const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditLogSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        required: true
    },
    resourceId: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String
    },
    details: {
        type: Object
    },
    status: {
        type: String,
        enum: ["success", "failure", "warning"],
        default: "success"
    },
    changes: {
        before: {
            type: Object
        },
        after: {
            type: Object
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("AuditLog", auditLogSchema);