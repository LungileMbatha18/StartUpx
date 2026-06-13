{
  "name": "dignity_contributions",
  "type": "object",
  "properties": {
    "contributor_type": {
      "type": "string",
      "enum": [
        "Student",
        "Business"
      ],
      "description": "Type of contributor"
    },
    "contributor_id": {
      "type": "string",
      "description": "Reference to student or business"
    },
    "contributor_name": {
      "type": "string",
      "description": "Contributor name"
    },
    "contribution_type": {
      "type": "string",
      "enum": [
        "Individual Item",
        "Shared Basket",
        "Complete Basket"
      ],
      "description": "Type of contribution"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Items contributed"
    }
  },
  "required": [
    "contributor_type",
    "contributor_id",
    "contribution_type"
  ]
}