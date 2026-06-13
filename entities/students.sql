{
  "name": "students",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "description": "Student full name"
    },
    "student_number": {
      "type": "string",
      "description": "Unique student number"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "Student email"
    },
    "phone": {
      "type": "string",
      "description": "Phone number"
    },
    "institution": {
      "type": "string",
      "default": "University of the Free State",
      "description": "Institution name"
    },
    "faculty": {
      "type": "string",
      "description": "Faculty name"
    },
    "qualification": {
      "type": "string",
      "description": "Qualification/degree"
    },
    "year_of_study": {
      "type": "string",
      "enum": [
        "First Year",
        "Second Year",
        "Third Year",
        "Fourth Year",
        "Honours",
        "Masters",
        "PhD"
      ],
      "description": "Year of study"
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Selected skills"
    },
    "availability_hours": {
      "type": "string",
      "enum": [
        "2\u20134",
        "5\u20138",
        "8\u201312",
        "12+"
      ],
      "description": "Weekly hours available"
    },
    "preferred_role": {
      "type": "string",
      "description": "Preferred team role"
    },
    "dignity_contribution_type": {
      "type": "string",
      "enum": [
        "Individual Item",
        "Shared Basket",
        "Complete Basket"
      ],
      "description": "Type of dignity contribution"
    },
    "dignity_items": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Selected dignity items"
    },
    "consent": {
      "type": "boolean",
      "default": false,
      "description": "Consent given"
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
    "full_name",
    "student_number",
    "email"
  ]
}