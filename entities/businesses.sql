{
  "name": "businesses",
  "type": "object",
  "properties": {
    "business_name": {
      "type": "string",
      "description": "Business name"
    },
    "founder_name": {
      "type": "string",
      "description": "Founder full name"
    },
    "founder_email": {
      "type": "string",
      "format": "email",
      "description": "Founder email"
    },
    "founder_phone": {
      "type": "string",
      "description": "Founder phone"
    },
    "institution": {
      "type": "string",
      "description": "Institution affiliation"
    },
    "industry": {
      "type": "string",
      "enum": [
        "Technology",
        "Retail",
        "Food & Beverage",
        "Agriculture",
        "Education",
        "Health & Wellness",
        "Accommodation",
        "Creative Industry",
        "Other"
      ],
      "description": "Business industry"
    },
    "stage": {
      "type": "string",
      "enum": [
        "Idea Stage",
        "Less than 6 months",
        "6\u201312 months",
        "1\u20133 years",
        "3+ years"
      ],
      "description": "Business stage"
    },
    "team_size": {
      "type": "number",
      "description": "Current team size"
    },
    "revenue_generating": {
      "type": "boolean",
      "default": false,
      "description": "Is revenue generating"
    },
    "support_needed": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Types of support needed"
    },
    "challenge_summary": {
      "type": "string",
      "description": "Summary of challenges"
    },
    "dignity_basket_commitment": {
      "type": "boolean",
      "default": true,
      "description": "Committed to dignity basket"
    },
    "basket_items": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Basket items committed"
    },
    "status": {
      "type": "string",
      "enum": [
        "Pending",
        "Approved",
        "Rejected"
      ],
      "default": "Pending",
      "description": "Registration status"
    }
  },
  "required": [
    "business_name",
    "founder_name",
    "founder_email"
  ]
}