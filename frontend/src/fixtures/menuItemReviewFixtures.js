const menuItemReviewFixtures = {
    oneReview: {
        "id": 1,
        "menuItemId": 1,
        "reviewerEmail": "cgaucho@ucsb.edu",
        "stars": 5,
        "comment": "Good"
    },
    threeReviews: [
        {
            "id": 1,
            "itemId": 1,
            "reviewerEmail": "cgaucho@ucsb.edu",
            "stars": 5,
            "dateReviewed": "2022-01-02T12:00:00",
            "comments": "Good"
        },
        {
            "id": 2,
            "itemId": 2,
            "reviewerEmail": "brycewang@ucsb.edu",
            "stars": 1,
            "dateReviewed": "2022-04-03T12:00:00",
            "comments": "Bad"
        },
        {
            "id": 3,
            "itemId": 3,
            "reviewerEmail": "phtcon@ucsb.edu",
            "stars": 3,
            "dateReviewed": "2022-07-04T12:00:00",
            "comments": "Okay"
        }
    ]
}

export { menuItemReviewFixtures };