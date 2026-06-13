{
  "name": "business_requests",
  "type": "object",
  "properties": {
    "business_id": {
      "type": "string",
      "description": "Reference to business"
    },
    "business_name": {
      "type": "string",
      "description": "Business name"
    },
    "support_category": {
      "type": "string",
      "description": "Support category"
    },
    "status": {
      "type": "string",
      "enum": [
        "Open",
        "Assigned",
        "Completed"
      ],
      "default": "Open"
    }
  },
  "required": [
    "business_id",
    "support_category"
  ]
}