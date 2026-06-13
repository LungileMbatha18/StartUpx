{
  "name": "sponsor_pledges",
  "type": "object",
  "properties": {
    "sponsor_name": {
      "type": "string",
      "description": "Sponsor name"
    },
    "pledge_type": {
      "type": "string",
      "description": "Type of sponsorship"
    },
    "amount": {
      "type": "number",
      "description": "Pledge amount"
    },
    "logo_url": {
      "type": "string",
      "description": "Sponsor logo URL"
    },
    "status": {
      "type": "string",
      "enum": [
        "Pledged",
        "Confirmed",
        "Received"
      ],
      "default": "Pledged"
    }
  },
  "required": [
    "sponsor_name"
  ]
}