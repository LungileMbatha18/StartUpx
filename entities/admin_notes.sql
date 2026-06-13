{
  "name": "admin_notes",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Note title"
    },
    "content": {
      "type": "string",
      "description": "Note content"
    },
    "category": {
      "type": "string",
      "enum": [
        "General",
        "Students",
        "Businesses",
        "Teams",
        "Contributions"
      ],
      "default": "General"
    },
    "priority": {
      "type": "string",
      "enum": [
        "Low",
        "Medium",
        "High"
      ],
      "default": "Medium"
    }
  },
  "required": [
    "title",
    "content"
  ]
}