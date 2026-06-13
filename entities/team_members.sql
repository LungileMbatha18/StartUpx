{
  "name": "team_members",
  "type": "object",
  "properties": {
    "team_id": {
      "type": "string",
      "description": "Reference to team"
    },
    "student_id": {
      "type": "string",
      "description": "Reference to student"
    },
    "student_name": {
      "type": "string",
      "description": "Student name for display"
    },
    "year_of_study": {
      "type": "string",
      "description": "Student year of study"
    },
    "role": {
      "type": "string",
      "description": "Assigned role in team"
    }
  },
  "required": [
    "team_id",
    "student_id"
  ]
}