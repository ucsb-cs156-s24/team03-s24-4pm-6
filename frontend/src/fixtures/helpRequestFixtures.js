const helpRequestFixtures = {
    oneHelpRequest:
    [
      {
        "id": 1,
        "requesterEmail": "ibareket@ucsb.edu",
        "teamId": "6",
        "tableOrBreakoutRoom": "breakout room",    
        "requestTime": "2022-01-02T12:00:00",
        "explanation": "need help",
        "solved": true

      }
    ],

    threeHelpRequests:
    [
        {
            "id": 2,
            "requesterEmail": "cgaucho@ucsb.edu",
            "teamId": "4",
            "tableOrBreakoutRoom": "table",    
            "requestTime": "2022-03-02T12:00:00",
            "explanation": "help please",
            "solved": true
        
        },

        {
            "id": 3,
            "requesterEmail": "12345@ucsb.edu",
            "teamId": "5",
            "tableOrBreakoutRoom": "breakout",    
            "requestTime": "2024-01-02T12:02:00",
            "explanation": "struggling",
            "solved": true

        },

        {
            "id": 4,
            "requesterEmail": "computer@ucsb.edu",
            "teamId": "1",
            "tableOrBreakoutRoom": "table",    
            "requestTime": "2024-05-08T12:00:00",
            "explanation": "need assistance",
            "solved": true

        },
        
    ]
};

export { helpRequestFixtures };