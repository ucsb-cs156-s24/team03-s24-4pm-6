const recommendationRequestFixtures = {
    oneRequest: {
        "id": 1,
        "requestorEmail":"dakotabarnes@ucsb.edu",
        "professorEmail":"yoga@ucsb.edu",
        "explanation":"Need Rec ASAP",
        "dateRequested":"2024-01-02T12:00:00",
        "dateNeeded":"2024-01-05T12:00:00",
        "done":"true"
    },
    threeRequests: [
        {
            "id": 1,
            "requestorEmail":"dakotabarnes@ucsb.edu",
            "professorEmail":"yoga@ucsb.edu",
            "explanation":"Need Rec ASAP",
            "dateRequested":"2024-01-02T12:00:00",
            "dateNeeded":"2024-01-05T12:00:00",
            "done":"true"
        },
        {
            "id": 2,
            "requestorEmail":"dakota@casabarnes.com",
            "professorEmail":"sawyeeRicee@ucsb.edu",
            "explanation":"How long should I put in cooker for",
            "dateRequested":"2023-01-02T12:00:00",
            "dateNeeded":"2023-01-05T12:00:00",
            "done":"false"
        },
        {
            "id": 3,
            "requestorEmail":"db@ucsb.edu",
            "professorEmail":"conrad@ucsb.edu",
            "explanation":"Yo, hit my line g",
            "dateRequested":"2022-01-02T12:00:00",
            "dateNeeded":"2022-01-05T12:00:00",
            "done":"true"
        }
    ]
};


export { recommendationRequestFixtures };