{
  "name": "teams",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Team name"
    },
    "member_count": {
      "type": "number",
      "description": "Number of members"
    },
    "is_balanced": {
      "type": "boolean",
      "default": false,
      "description": "Whether team has balanced year spread"
    },
    "generation_batch": {
      "type": "string",
      "description": "Batch identifier for generation run"
    },
    "matched_business_id": {
      "type": "string",
      "description": "ID of matched business"
    },
    "matched_business_name": {
      "type": "string",
      "description": "Name of matched business for display"
    }
  },
  "required": [
    "name"
  ]
}